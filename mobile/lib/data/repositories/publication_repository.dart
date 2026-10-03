import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';
import '../cache/json_cache.dart';
import '../models/enums.dart';
import '../models/publication.dart';
import 'swr.dart';

/// Reads /api/publications and /api/publications/[slug].
class PublicationRepository {
  PublicationRepository({
    required ApiClient api,
    required JsonCache cache,
    JsonCache? detailCache,
  })  : _api = api,
        _cache = cache,
        _detailCache = detailCache ?? cache;

  final ApiClient _api;
  final JsonCache _cache;
  final JsonCache _detailCache;

  static const Duration listTtl = Duration(hours: 6);
  static const Duration detailTtl = Duration(days: 30);
  static const int detailLruCap = 20;

  Future<CachedResult<List<Publication>>> list({
    String? query,
    PublicationType? type,
    ResearchDivision? division,
    int? year,
    int page = 1,
    int limit = 20,
  }) {
    final cacheKey =
        'pub:$query:$type?.wire:$division?.wire:$year:$page:$limit';
    return swrList<Publication>(
      cacheKey: cacheKey,
      ttl: listTtl,
      cache: _cache,
      parse: _parseList,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/publications',
          queryParameters: {
            if (query != null && query.isNotEmpty) 'q': query,
            if (type != null) 'type': type.wire,
            if (division != null) 'division': division.wire,
            if (year != null) 'year': year,
            'page': page,
            'limit': limit,
          },
        );
        return _parseItems(json);
      },
    );
  }

  Future<CachedResult<Publication?>> bySlug(String slug) {
    return swrDetail<Publication>(
      cacheKey: 'pub:detail:$slug',
      ttl: detailTtl,
      cache: _detailCache,
      parse: _parseOne,
      maxEntries: detailLruCap,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/publications/$slug',
        );
        return json.isEmpty ? null : Publication.fromJson(json);
      },
    );
  }

  List<Publication> _parseList(Object? raw) {
    if (raw is! List) return const [];
    return raw
        .whereType<Map<String, dynamic>>()
        .map(Publication.fromJson)
        .toList();
  }

  List<Publication> _parseItems(Map<String, dynamic> json) {
    return (json['items'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(Publication.fromJson)
            .toList() ??
        const [];
  }

  Publication _parseOne(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      throw const ApiException('Unexpected publication payload');
    }
    return Publication.fromJson(raw);
  }
}

final publicationRepositoryProvider = Provider<PublicationRepository>((ref) {
  final api = ref.watch(apiClientProvider);
  return PublicationRepository(
    api: api,
    cache: JsonCache(Hive.box<String>(HiveBoxes.publications)),
    detailCache: JsonCache(Hive.box<String>(HiveBoxes.pubDetail)),
  );
});
