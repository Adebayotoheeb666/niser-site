import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';

/// Newsletter subscription via /api/subscribe.
class SubscriptionRepository {
  SubscriptionRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<void> subscribe({
    required String email,
    String? name,
  }) async {
    await _api.postJson<Map<String, dynamic>>(
      '/api/subscribe',
      data: {
        'email': email,
        if (name != null && name.isNotEmpty) 'name': name,
      },
    );
  }
}

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>((ref) {
  return SubscriptionRepository(api: ref.watch(apiClientProvider));
});