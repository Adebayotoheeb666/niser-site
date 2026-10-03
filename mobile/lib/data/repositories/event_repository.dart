import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/api/api_exception.dart';
import '../../core/storage/hive_boxes.dart';
import '../cache/json_cache.dart';
import '../models/cms_event.dart';
import '../models/enums.dart';
import 'swr.dart';

enum EventScope { all, upcoming, past }

/// Reads /api/events and /api/events/[slug].
class EventRepository {
  EventRepository({required ApiClient api, required JsonCache cache})
      : _api = api,
        _cache = cache;

  final ApiClient _api;
  final JsonCache _cache;

  static const Duration ttl = Duration(hours: 1);

  Future<CachedResult<List<CMSEvent>>> list({
    EventScope scope = EventScope.all,
    EventType? type,
    int page = 1,
    int limit = 20,
  }) {
    final cacheKey = 'events:$scope.name:${type?.wire}:$page:$limit';
    return swrList<CMSEvent>(
      cacheKey: cacheKey,
      ttl: ttl,
      cache: _cache,
      parse: _parseList,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/events',
          queryParameters: {
            if (scope != EventScope.all) 'scope': scope.name,
            if (type != null) 'type': type.wire,
            'page': page,
            'limit': limit,
          },
        );
        return _parseItems(json);
      },
    );
  }

  Future<CachedResult<CMSEvent?>> bySlug(String slug) {
    return swrDetail<CMSEvent>(
      cacheKey: 'event:detail:$slug',
      ttl: ttl,
      cache: _cache,
      parse: _parseOne,
      network: () async {
        final json = await _api.getJson<Map<String, dynamic>>(
          '/api/events/$slug',
        );
        return json.isEmpty ? null : CMSEvent.fromJson(json);
      },
    );
  }

  List<CMSEvent> _parseList(Object? raw) {
    if (raw is! List) return const [];
    return raw
        .whereType<Map<String, dynamic>>()
        .map(CMSEvent.fromJson)
        .toList();
  }

  List<CMSEvent> _parseItems(Map<String, dynamic> json) {
    return (json['items'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(CMSEvent.fromJson)
            .toList() ??
        const [];
  }

  CMSEvent _parseOne(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      throw const ApiException('Unexpected event payload');
    }
    return CMSEvent.fromJson(raw);
  }
}

final eventRepositoryProvider = Provider<EventRepository>((ref) {
  return EventRepository(
    api: ref.watch(apiClientProvider),
    cache: JsonCache(Hive.box<String>(HiveBoxes.events)),
  );
});
