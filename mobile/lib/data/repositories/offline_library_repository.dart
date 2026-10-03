import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';

/// A publication PDF stored on the device for offline reading.
class OfflineDoc {
  const OfflineDoc({
    required this.key,
    required this.url,
    required this.title,
    required this.filePath,
    required this.savedAt,
  });

  final String key;
  final String url;
  final String title;
  final String filePath;
  final DateTime savedAt;

  Map<String, dynamic> toJson() => {
        'key': key,
        'url': url,
        'title': title,
        'filePath': filePath,
        'savedAt': savedAt.toIso8601String(),
      };

  factory OfflineDoc.fromJson(Map<String, dynamic> json) => OfflineDoc(
        key: json['key'] as String? ?? '',
        url: json['url'] as String? ?? '',
        title: json['title'] as String? ?? '',
        filePath: json['filePath'] as String? ?? '',
        savedAt: DateTime.tryParse(json['savedAt'] as String? ?? '') ??
            DateTime.fromMillisecondsSinceEpoch(0),
      );
}

/// Download queue + registry for offline PDFs.
///
/// Files live under `<app documents>/offline_pdfs/<key>.pdf` so they survive
/// restarts; the Hive `offline_files` box maps keys to metadata. Hive and
/// filesystem access degrade gracefully when unavailable.
///
/// Per plan §4 + post-MVP backlog, the PDF download queue is capped at
/// 500 MB (design doc §7.2). Oldest docs are evicted first when the quota
/// would be exceeded. Settings → Clear cache also clears this box.
class OfflineLibrary {
  OfflineLibrary({Dio? dio, Future<Directory?> Function()? resolveDir})
      : _dio = dio ?? Dio(),
        _resolveDir = resolveDir;

  final Dio _dio;
  final Future<Directory?> Function()? _resolveDir;

  /// 500 MB quota for offline PDFs (`NISER_Mobile_App_Flutter_Implementation_Plan.md:434`).
  static const int maxTotalBytes = 500 * 1024 * 1024;

  static Box<String>? get _box {
    try {
      return Hive.box<String>(HiveBoxes.offlineFiles);
    } catch (_) {
      return null;
    }
  }

  Future<Directory?> get _libraryDir async {
    if (_resolveDir != null) return _resolveDir();
    try {
      final base = await getApplicationDocumentsDirectory();
      final dir = Directory('${base.path}/offline_pdfs');
      if (!await dir.exists()) await dir.create(recursive: true);
      return dir;
    } catch (_) {
      return null;
    }
  }

  /// Stable key for a document: slug when available, else URL hash.
  static String keyFor({required String slug, String? url}) {
    if (slug.isNotEmpty) return slug;
    return 'u${(url ?? '').hashCode.abs()}';
  }

  bool isOffline(String key) => get(key) != null;

  OfflineDoc? get(String key) {
    final entry = _box?.get(key);
    if (entry == null) return null;
    try {
      final doc = OfflineDoc.fromJson(jsonDecode(entry));
      if (doc.filePath.isEmpty || !File(doc.filePath).existsSync()) {
        // The file was cleared by the OS or the user; treat as absent.
        return null;
      }
      return doc;
    } catch (_) {
      return null;
    }
  }

  List<OfflineDoc> list() {
    final box = _box;
    if (box == null) return const [];
    final docs = <OfflineDoc>[];
    for (final raw in box.values) {
      try {
        final doc = OfflineDoc.fromJson(jsonDecode(raw));
        if (doc.filePath.isNotEmpty && File(doc.filePath).existsSync()) {
          docs.add(doc);
        }
      } catch (_) {
        // Skip corrupt entries.
      }
    }
    return docs..sort((a, b) => b.savedAt.compareTo(a.savedAt));
  }

  /// Downloads [url] into the offline library, reporting progress in
  /// 0.0–1.0 via [onProgress]. Throws [ApiException] on failure.
  Future<OfflineDoc> download({
    required String key,
    required String url,
    required String title,
    void Function(double progress)? onProgress,
  }) async {
    final dir = await _libraryDir;
    if (dir == null) {
      throw const ApiException('Storage is unavailable.');
    }
    final file = File('${dir.path}/$key.pdf');
    try {
      await _dio.download(
        url,
        file.path,
        onReceiveProgress: (received, total) {
          if (onProgress != null && total > 0) {
            onProgress((received / total).clamp(0.0, 1.0));
          }
        },
      );
    } on DioException catch (e) {
      if (!await file.exists()) {
        throw ApiException(
          e.type == DioExceptionType.connectionError ||
                  e.type == DioExceptionType.connectionTimeout ||
                  e.type == DioExceptionType.receiveTimeout
              ? 'You appear to be offline.'
              : 'Download failed.',
        );
      }
      // A partial file from an earlier attempt exists and completed now.
    }
    final doc = OfflineDoc(
      key: key,
      url: url,
      title: title,
      filePath: file.path,
      savedAt: DateTime.now(),
    );
    await _box?.put(key, jsonEncode(doc.toJson()));
    await _enforceQuota(excludeKey: key);
    return doc;
  }

  /// Returns total bytes used by offline files on disk.
  Future<int> totalBytes() async {
    var total = 0;
    for (final doc in list()) {
      try {
        final f = File(doc.filePath);
        if (await f.exists()) total += await f.length();
      } catch (_) {}
    }
    return total;
  }

  int totalBytesSync() {
    var total = 0;
    for (final d in list()) {
      try {
        total += File(d.filePath).lengthSync();
      } catch (_) {}
    }
    return total;
  }

  Future<void> _enforceQuota({String? excludeKey}) async {
    final box = _box;
    if (box == null) return;
    // Build LRU order oldest-first by savedAt.
    final docs = list()..sort((a, b) => a.savedAt.compareTo(b.savedAt));
    var total = 0;
    final sizes = <String, int>{};
    for (final d in docs) {
      try {
        sizes[d.key] = File(d.filePath).lengthSync();
        total += sizes[d.key]!;
      } catch (_) {
        sizes[d.key] = 0;
      }
    }
    if (total <= maxTotalBytes) return;
    for (final d in docs) {
      if (d.key == excludeKey) continue;
      if (total <= maxTotalBytes) break;
      try {
        await File(d.filePath).delete();
      } catch (_) {}
      await box.delete(d.key);
      total -= sizes[d.key] ?? 0;
    }
  }

  Future<void> remove(String key) async {
    final doc = get(key);
    if (doc != null) {
      try {
        await File(doc.filePath).delete();
      } catch (_) {}
    }
    await _box?.delete(key);
  }
}

final offlineLibraryProvider = Provider<OfflineLibrary>((ref) {
  return OfflineLibrary(dio: ref.watch(apiClientProvider).dio);
});
