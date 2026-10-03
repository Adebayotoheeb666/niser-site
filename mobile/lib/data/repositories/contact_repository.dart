import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';

/// Contact form submission via /api/contact.
class ContactRepository {
  ContactRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<void> submit({
    required String firstName,
    required String lastName,
    required String email,
    required String subject,
    required String message,
    String? organization,
  }) async {
    await _api.postJson<Map<String, dynamic>>(
      '/api/contact',
      data: {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'subject': subject,
        'message': message,
        if (organization != null && organization.isNotEmpty)
          'organization': organization,
      },
    );
  }
}

final contactRepositoryProvider = Provider<ContactRepository>((ref) {
  return ContactRepository(api: ref.watch(apiClientProvider));
});