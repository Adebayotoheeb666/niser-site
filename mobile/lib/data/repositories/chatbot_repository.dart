import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/storage/secure_store.dart';
import '../services/chat_sse_client.dart';

/// Ask NISER chat backed by /api/chatbot (SSE stream).
class ChatbotRepository {
  ChatbotRepository({required ApiClient api, required ChatSseClient sse})
      : _api = api,
        _sse = sse;

  final ApiClient _api;
  final ChatSseClient _sse;

  /// Restores persisted chat cookies. Call once before the first message.
  Future<void> init() => _sse.init();

  Stream<ChatStreamEvent> sendMessage({
    required String message,
    List<Map<String, String>> history = const [],
    String? fingerprint,
  }) {
    return _sse.sendMessage(message: message, history: history, fingerprint: fingerprint);
  }

  Future<List<Map<String, dynamic>>> history() async {
    final json = await _api.getJson<List<dynamic>>('/api/chatbot/history');
    return json.whereType<Map<String, dynamic>>().toList();
  }

  Future<void> clearHistory() async {
    await _api.postJson<Map<String, dynamic>>('/api/chatbot/clear');
  }
}

final chatbotRepositoryProvider = Provider<ChatbotRepository>((ref) {
  return ChatbotRepository(
    api: ref.watch(apiClientProvider),
    sse: ChatSseClient(store: ref.watch(secureStoreProvider)),
  );
});