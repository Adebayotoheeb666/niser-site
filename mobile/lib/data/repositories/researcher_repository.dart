import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';
import '../cache/json_cache.dart';
import '../models/enums.dart';
import '../models/researcher.dart';
import 'swr.dart';

/// Reads /api/people and /api/people/[slug].
class ResearcherRepository {
  ResearcherRepository({required ApiClient api, required JsonCache cache})
      : _api = api,
        _cache = cache;

  final ApiClient _api;
  final JsonCache _cache;

  static const Duration listTtl = Duration(hours: 12);
  static const Duration detailTtl = Duration(days: 30);

  Future<CachedResult<List<Researcher>>> list({
    String? query,
    ResearchDivision? division,
    int page = 1,
    int limit = 20,
  }) {
    final cacheKey = 'researchers:$query:${division?.wire}:$page:$limit';
    return swrList<Researcher>(
      cacheKey: cacheKey,
      ttl: listTtl,
      cache: _cache,
      parse: _parseList,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/people',
          queryParameters: {
            if (query != null && query.isNotEmpty) 'q': query,
            if (division != null) 'division': division.wire,
            'page': page,
            'limit': limit,
          },
        );
        return _parseItems(json);
      },
    );
  }

  Future<CachedResult<Researcher?>> bySlug(String slug) {
    return swrDetail<Researcher>(
      cacheKey: 'researcher:detail:$slug',
      ttl: detailTtl,
      cache: _cache,
      parse: _parseOne,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/people/$slug',
        );
        return json.isEmpty ? null : Researcher.fromJson(json);
      },
    );
  }

  List<Researcher> _parseList(Object? raw) {
    if (raw is! List) return const [];
    return raw
        .whereType<Map<String, dynamic>>()
        .map(Researcher.fromJson)
        .toList();
  }

  List<Researcher> _parseItems(Map<String, dynamic> json) {
    return (json['items'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(Researcher.fromJson)
            .toList() ??
        const [];
  }

  Researcher _parseOne(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      throw const ApiException('Unexpected researcher payload');
    }
    return Researcher.fromJson(raw);
  }
}

final researcherRepositoryProvider = Provider<ResearcherRepository>((ref) {
  return ResearcherRepository(
    api: ref.watch(apiClientProvider),
    cache: JsonCache(Hive.box<String>(HiveBoxes.researchers)),
  );
});
