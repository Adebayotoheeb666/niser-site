import 'dart:async';

import '../cache/json_cache.dart';

/// Stale-while-revalidate list helper.
///
/// 1. Returns cached data immediately if present (with `fromCache=true`).
/// 2. Fires a background network refresh when the cache is stale.
/// 3. Falls back to cache on network error.
Future<CachedResult<List<T>>> swrList<T>({
  required String cacheKey,
  required Duration ttl,
  required JsonCache cache,
  required List<T> Function(Object? raw) parse,
  required Future<List<T>> Function() network,
}) async {
  final cached = cache.getRaw(cacheKey);

  if (cached != null) {
    List<T>? cachedItems;
    try {
      cachedItems = parse(cached);
    } catch (_) {
      cachedItems = null;
    }

    if (cachedItems != null) {
      final fresh = cache.isFresh(cacheKey, ttl);
      if (!fresh) {
        unawaited(_refresh(cacheKey, cache, parse, network));
      }
      return CachedResult<List<T>>(cachedItems, fromCache: true, stale: !fresh);
    }
  }

  final items = await network();
  await cache.put(cacheKey, items.map((e) => _serialize(e)).toList());
  return CachedResult<List<T>>(items);
}

/// Stale-while-revalidate detail helper (single object).
Future<CachedResult<T?>> swrDetail<T>({
  required String cacheKey,
  required Duration ttl,
  required JsonCache cache,
  required T Function(Object? raw) parse,
  required Future<T?> Function() network,
  int? maxEntries,
}) async {
  final cached = cache.getRaw(cacheKey);

  if (cached != null) {
    try {
      final cachedItem = parse(cached);
      if (cachedItem != null) {
        final fresh = cache.isFresh(cacheKey, ttl);
        if (!fresh) {
          unawaited(_refreshDetail(cacheKey, cache, parse, network, maxEntries: maxEntries));
        }
        return CachedResult<T?>(cachedItem, fromCache: true, stale: !fresh);
      }
    } catch (_) {
      // fall through to network
    }
  }

  final item = await network();
  if (item != null) {
    if (maxEntries != null) {
      await cache.putWithCap(cacheKey, _serialize(item), maxEntries: maxEntries);
    } else {
      await cache.put(cacheKey, _serialize(item));
    }
  }
  return CachedResult<T?>(item);
}

Future<void> _refresh<T>(
  String cacheKey,
  JsonCache cache,
  List<T> Function(Object? raw) parse,
  Future<List<T>> Function() network,
) async {
  try {
    final items = await network();
    await cache.put(cacheKey, items.map((e) => _serialize(e)).toList());
  } catch (_) {
    // best-effort refresh; stale cache remains usable
  }
}

Future<void> _refreshDetail<T>(
  String cacheKey,
  JsonCache cache,
  T Function(Object? raw) parse,
  Future<T?> Function() network, {
  int? maxEntries,
}) async {
  try {
    final item = await network();
    if (item != null) {
      if (maxEntries != null) {
        await cache.putWithCap(cacheKey, _serialize(item), maxEntries: maxEntries);
      } else {
        await cache.put(cacheKey, _serialize(item));
      }
    }
  } catch (_) {
    // best-effort refresh; stale cache remains usable
  }
}

/// Serialises an item for the cache. Primitives pass through; objects must
/// expose `toJson()`.
Object _serialize(dynamic item) {
  if (item is String || item is num || item is bool) return item;
  return item.toJson();
}
