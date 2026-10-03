import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';
import '../cache/json_cache.dart';
import '../models/enums.dart';
import '../models/news_item.dart';
import 'swr.dart';

/// Reads /api/news and /api/news/[slug].
class NewsRepository {
  NewsRepository({required ApiClient api, required JsonCache cache})
      : _api = api,
        _cache = cache;

  final ApiClient _api;
  final JsonCache _cache;

  static const Duration ttl = Duration(hours: 6);

  Future<CachedResult<List<NewsItem>>> list({
    NewsCategory? category,
    String? query,
    int page = 1,
    int limit = 20,
  }) {
    final cacheKey = 'news:$category?.wire:$query:$page:$limit';
    return swrList<NewsItem>(
      cacheKey: cacheKey,
      ttl: ttl,
      cache: _cache,
      parse: _parseList,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/news',
          queryParameters: {
            if (category != null) 'category': category.wire,
            if (query != null && query.isNotEmpty) 'q': query,
            'page': page,
            'limit': limit,
          },
        );
        return _parseItems(json);
      },
    );
  }

  Future<CachedResult<NewsItem?>> bySlug(String slug) {
    return swrDetail<NewsItem>(
      cacheKey: 'news:detail:$slug',
      ttl: ttl,
      cache: _cache,
      parse: _parseOne,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/news/$slug',
        );
        return json.isEmpty ? null : NewsItem.fromJson(json);
      },
    );
  }

  List<NewsItem> _parseList(Object? raw) {
    if (raw is! List) return const [];
    return raw
        .whereType<Map<String, dynamic>>()
        .map(NewsItem.fromJson)
        .toList();
  }

  List<NewsItem> _parseItems(Map<String, dynamic> json) {
    return (json['items'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(NewsItem.fromJson)
            .toList() ??
        const [];
  }

  NewsItem _parseOne(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      throw const ApiException('Unexpected news payload');
    }
    return NewsItem.fromJson(raw);
  }
}

final newsRepositoryProvider = Provider<NewsRepository>((ref) {
  return NewsRepository(
    api: ref.watch(apiClientProvider),
    cache: JsonCache(Hive.box<String>(HiveBoxes.news)),
  );
});
