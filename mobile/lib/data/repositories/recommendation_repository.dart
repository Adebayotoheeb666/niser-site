import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../models/recommendation.dart';

/// Reads GET /api/recommendations — related content for a given item.
///
/// Recommendations are computed server-side on request; they are not cached
/// to disk (cheap, contextual, and always fresh).
class RecommendationRepository {
  RecommendationRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<List<Recommendation>> forContent({
    required String slug,
    String type = 'publication',
    int limit = 6,
  }) async {
    final json = await _api.getJson<Map<String, dynamic>>(
      '/api/recommendations',
      queryParameters: {
        'slug': slug,
        'type': type,
        'limit': '$limit',
      },
    );
    final items = json['recommendations'];
    if (items is! List) return const [];
    return items
        .whereType<Map<String, dynamic>>()
        .map(Recommendation.fromJson)
        .toList(growable: false);
  }
}

final recommendationRepositoryProvider = Provider<RecommendationRepository>((ref) {
  return RecommendationRepository(api: ref.watch(apiClientProvider));
});

final recommendationsFamily = FutureProvider.autoDispose
    .family<List<Recommendation>, ({String slug, String type})>((ref, params) {
  return ref.watch(recommendationRepositoryProvider).forContent(
        slug: params.slug,
        type: params.type,
      );
});
