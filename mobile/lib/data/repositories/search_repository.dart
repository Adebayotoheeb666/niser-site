import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/storage/hive_boxes.dart';
import '../models/search_hit.dart';

/// Reads /api/search (keyword + semantic hybrid).
///
/// Search results are intentionally not cached to disk (plan §4); only the
/// last 20 query strings are persisted as recent searches.
class SearchRepository {
  SearchRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<SearchResponse> search({
    required String query,
    String mode = 'keyword',
    String type = 'all',
    String division = 'all',
    String year = 'all',
    int page = 1,
    int limit = 20,
    CancelToken? cancelToken,
  }) async {
    final json = await _api.getJson<Map<String, dynamic>>(
      '/api/search',
      queryParameters: {
        'q': query,
        'mode': mode,
        'type': type,
        'division': division,
        'year': year,
        'page': page,
        'limit': limit,
      },
      cancelToken: cancelToken,
    );
    return SearchResponse.fromJson(json);
  }

  Future<List<String>> recentQueries() async {
    final box = Hive.box<String>(HiveBoxes.recentSearches);
    return box.values.toList().reversed.take(20).toList();
  }

  Future<void> persistQuery(String query) async {
    final box = Hive.box<String>(HiveBoxes.recentSearches);
    await box.add(query);
    while (box.values.length > 20) {
      await box.deleteAt(0);
    }
  }

  Future<void> clearRecentQueries() async {
    await Hive.box<String>(HiveBoxes.recentSearches).clear();
  }
}

final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  return SearchRepository(api: ref.watch(apiClientProvider));
});