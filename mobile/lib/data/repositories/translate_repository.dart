import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';

/// Translates text via /api/translate.
class TranslationResult {
  const TranslationResult({
    required this.translatedText,
    this.sourceLanguage,
    this.targetLanguage,
    this.qualityScore,
  });

  final String translatedText;
  final String? sourceLanguage;
  final String? targetLanguage;
  final double? qualityScore;

  factory TranslationResult.fromJson(Map<String, dynamic> json) {
    return TranslationResult(
      translatedText: json['translatedText'] as String? ?? '',
      sourceLanguage: json['sourceLanguage'] as String?,
      targetLanguage: json['targetLanguage'] as String?,
      qualityScore: (json['qualityScore'] as num?)?.toDouble(),
    );
  }
}

class TranslateRepository {
  TranslateRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<TranslationResult> translate({
    required String text,
    required String targetLang,
  }) async {
    final json = await _api.postJson<Map<String, dynamic>>(
      '/api/translate',
      data: {'text': text, 'targetLang': targetLang},
    );
    return TranslationResult.fromJson(json);
  }
}

final translateRepositoryProvider = Provider<TranslateRepository>((ref) {
  return TranslateRepository(api: ref.watch(apiClientProvider));
});