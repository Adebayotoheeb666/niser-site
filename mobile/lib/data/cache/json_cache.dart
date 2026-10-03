import 'dart:convert';

import 'package:hive/hive.dart';

/// Wraps a value with metadata about whether it came from the offline cache.
class CachedResult<T> {
  const CachedResult(this.value, {this.fromCache = false, this.stale = false});

  final T value;
  final bool fromCache;
  final bool stale;
}

/// Hive-backed JSON cache implementing stale-while-revalidate.
///
/// Entries store `{"data": <json>, "fetchedAt": <iso8601>}`. TTL is checked
/// by the caller so list/detail TTLs can differ.
class JsonCache {
  const JsonCache(this._box);

  final Box<String> _box;

  Future<void> put(String key, Object data) async {
    await _box.put(
      key,
      jsonEncode({
        'data': data,
        'fetchedAt': DateTime.now().toUtc().toIso8601String(),
      }),
    );
  }

  /// Stores [data] and enforces an LRU cap of [maxEntries] by evicting the
  /// oldest entries (by `fetchedAt`). Used for publication detail infinite-cache
  /// per plan §4: LRU last 20, pinned handling left to the caller.
  Future<void> putWithCap(String key, Object data, {int maxEntries = 20}) async {
    await put(key, data);
    if (_box.length <= maxEntries) return;
    // Collect entries with fetchedAt for sorting.
    final entries = <(String key, DateTime fetchedAt)>[];
    for (final k in _box.keys.whereType<String>()) {
      final raw = _box.get(k);
      if (raw == null) continue;
      try {
        final decoded = jsonDecode(raw) as Map<String, dynamic>;
        final fetchedAt = DateTime.tryParse(decoded['fetchedAt'] as String? ?? '');
        if (fetchedAt != null) entries.add((k, fetchedAt));
      } catch (_) {
        entries.add((k, DateTime.fromMillisecondsSinceEpoch(0)));
      }
    }
    entries.sort((a, b) => a.$2.compareTo(b.$2));
    final toEvict = entries.length - maxEntries;
    for (var i = 0; i < toEvict; i++) {
      await _box.delete(entries[i].$1);
    }
  }

  /// Returns the cached JSON map (decoded) if present, otherwise null.
  Object? getRaw(String key) {
    final raw = _box.get(key);
    if (raw == null) return null;
    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic> && decoded.containsKey('data')) {
        return decoded['data'];
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// True if an entry exists for [key] and is newer than [ttl].
  bool isFresh(String key, Duration ttl) {
    final raw = _box.get(key);
    if (raw == null) return false;
    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      final fetchedAt =
          DateTime.tryParse(decoded['fetchedAt'] as String? ?? '');
      if (fetchedAt == null) return false;
      return DateTime.now().toUtc().difference(fetchedAt) <= ttl;
    } catch (_) {
      return false;
    }
  }

  Future<void> remove(String key) => _box.delete(key);

  Future<void> clear() => _box.clear();
}
