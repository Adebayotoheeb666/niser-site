import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';
import '../cache/json_cache.dart';
import '../models/enums.dart';
import '../models/insight.dart';
import 'swr.dart';

/// Reads /api/insights and /api/insights/[slug].
class InsightRepository {
  InsightRepository({required ApiClient api, required JsonCache cache})
      : _api = api,
        _cache = cache;

  final ApiClient _api;
  final JsonCache _cache;

  static const Duration ttl = Duration(hours: 12);

  Future<CachedResult<List<Insight>>> list({
    InsightContentType? contentType,
    String? query,
    int page = 1,
    int limit = 20,
  }) {
    final cacheKey = 'insights:$contentType?.wire:$query:$page:$limit';
    return swrList<Insight>(
      cacheKey: cacheKey,
      ttl: ttl,
      cache: _cache,
      parse: _parseList,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/insights',
          queryParameters: {
            if (contentType != null) 'contentType': contentType.wire,
            if (query != null && query.isNotEmpty) 'q': query,
            'page': page,
            'limit': limit,
          },
        );
        return _parseItems(json);
      },
    );
  }

  Future<CachedResult<Insight?>> bySlug(String slug) {
    return swrDetail<Insight>(
      cacheKey: 'insight:detail:$slug',
      ttl: ttl,
      cache: _cache,
      parse: _parseOne,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/insights/$slug',
        );
        return json.isEmpty ? null : Insight.fromJson(json);
      },
    );
  }

  List<Insight> _parseList(Object? raw) {
    if (raw is! List) return const [];
    return raw
        .whereType<Map<String, dynamic>>()
        .map(Insight.fromJson)
        .toList();
  }

  List<Insight> _parseItems(Map<String, dynamic> json) {
    return (json['items'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(Insight.fromJson)
            .toList() ??
        const [];
  }

  Insight _parseOne(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      throw const ApiException('Unexpected insight payload');
    }
    return Insight.fromJson(raw);
  }
}

final insightRepositoryProvider = Provider<InsightRepository>((ref) {
  return InsightRepository(
    api: ref.watch(apiClientProvider),
    cache: JsonCache(Hive.box<String>(HiveBoxes.insights)),
  );
});
