import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/storage/hive_boxes.dart';

/// Saved-for-offline content entries (Implementation Plan §9 Capability 5:
/// "Save for offline" button on recommendation/content cards).
class SavedItem {
  const SavedItem({
    required this.id,
    required this.title,
    required this.type,
    required this.slug,
    required this.savedAt,
  });

  final String id;
  final String title;
  final String type;
  final String slug;
  final DateTime savedAt;

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'type': type,
        'slug': slug,
        'savedAt': savedAt.toIso8601String(),
      };

  factory SavedItem.fromJson(Map<String, dynamic> json) => SavedItem(
        id: json['id'] as String? ?? '',
        title: json['title'] as String? ?? '',
        type: json['type'] as String? ?? 'publication',
        slug: json['slug'] as String? ?? '',
        savedAt: DateTime.tryParse(json['savedAt'] as String? ?? '') ??
            DateTime.fromMillisecondsSinceEpoch(0),
      );

  String get routePath {
    switch (type) {
      case 'publication':
        return '/publications/$slug';
      case 'insight':
        return '/insights/$slug';
      case 'event':
        return '/events/$slug';
      case 'news':
        return '/news/$slug';
      default:
        return '/';
    }
  }
}

class SavedContentRepository {
  /// Returns null when Hive is unavailable (init failed in main or tests);
  /// callers degrade gracefully instead of crashing the screen.
  Box<String>? get _box {
    try {
      return Hive.box<String>(HiveBoxes.savedContent);
    } catch (_) {
      return null;
    }
  }

  Future<void> save({
    required String id,
    required String title,
    required String type,
    required String slug,
  }) async {
    if (slug.isEmpty) return;
    final box = _box;
    if (box == null) return;
    final key = '$type:$slug';
    await box.put(
      key,
      jsonEncode(SavedItem(
        id: id,
        title: title,
        type: type,
        slug: slug,
        savedAt: DateTime.now(),
      ).toJson()),
    );
  }

  List<SavedItem> list() {
    final box = _box;
    if (box == null) return const [];
    return box.values
        .map((raw) {
          try {
            return SavedItem.fromJson(jsonDecode(raw) as Map<String, dynamic>);
          } catch (_) {
            return null;
          }
        })
        .whereType<SavedItem>()
        .toList()
      ..sort((a, b) => b.savedAt.compareTo(a.savedAt));
  }

  bool isSaved({required String type, required String slug}) {
    final box = _box;
    if (box == null) return false;
    return box.containsKey('$type:$slug');
  }

  Future<void> remove({required String type, required String slug}) async {
    final box = _box;
    if (box == null) return;
    await box.delete('$type:$slug');
  }
}

final savedContentRepositoryProvider = Provider<SavedContentRepository>((ref) {
  return SavedContentRepository();
});
