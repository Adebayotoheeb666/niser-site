import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../../core/config/app_config.dart';
import '../../core/storage/secure_store.dart';

/// Parsed SSE event from /api/chatbot.
class ChatStreamEvent {
  const ChatStreamEvent({this.token, this.event, this.mode, this.sources, this.error});

  final String? token;
  final String? event;
  final String? mode;
  final List<Map<String, dynamic>>? sources;
  final String? error;

  factory ChatStreamEvent.fromJson(Map<String, dynamic> json) {
    return ChatStreamEvent(
      token: json['token'] as String?,
      event: json['event'] as String?,
      mode: json['mode'] as String?,
      sources: (json['sources'] as List<dynamic>?)
          ?.whereType<Map<String, dynamic>>()
          .toList(),
      error: json['error'] as String?,
    );
  }
}

/// Streaming client for the chatbot SSE endpoint.
///
/// Maintains the `niser_chat_session` / `niser_chat_visitor` cookies so the
/// backend can persist conversation memory across requests. Cookies are
/// persisted through [SecureStore] and restored on the next launch.
class ChatSseClient {
  ChatSseClient({String? baseUrl, HttpClient? httpClient, SecureStore? store})
      : _baseUrl = baseUrl ?? AppConfig.apiBaseUrl,
        _httpClient = httpClient ?? HttpClient(),
        _store = store;

  final String _baseUrl;
  final HttpClient _httpClient;
  final SecureStore? _store;

  String? _sessionId;
  String? _visitorId;

  /// Restores persisted session/visitor cookies (call once at startup).
  Future<void> init() async {
    final store = _store;
    if (store == null) return;
    _sessionId = await store.readChatSessionId();
    _visitorId = await store.readChatVisitorId();
  }

  Uri get _uri => Uri.parse('$_baseUrl/api/chatbot');

  Stream<ChatStreamEvent> sendMessage({
    required String message,
    List<Map<String, String>> history = const [],
    String? fingerprint,
  }) async* {
    final request = await _httpClient.postUrl(_uri);
    request.headers.contentType = ContentType('application', 'json', charset: 'utf-8');
    request.headers.set('accept', 'text/event-stream');
    request.headers.set('x-client', 'niser-mobile');
    request.headers.set('x-niser-chat', 'mobile');

    final cookies = <String>[
      if (_sessionId != null) 'niser_chat_session=$_sessionId',
      if (_visitorId != null) 'niser_chat_visitor=$_visitorId',
    ];
    if (cookies.isNotEmpty) {
      request.headers.set(HttpHeaders.cookieHeader, cookies.join('; '));
    }

    request.write(jsonEncode({
      'message': message,
      'history': history,
      if (fingerprint != null && fingerprint.isNotEmpty) 'fingerprint': fingerprint,
    }));

    final response = await request.close();

    if (response.statusCode != 200) {
      final errorBody = await utf8.decoder.bind(response).join();
      throw HttpException(
        'Chat request failed (${response.statusCode}): $errorBody',
      );
    }

    _captureCookies(response);

    var buffer = '';
    await for (final chunk in response.transform(utf8.decoder)) {
      buffer += chunk;
      final frames = buffer.split('\n\n');
      buffer = frames.removeLast();
      for (final frame in frames) {
        for (final line in frame.split('\n')) {
          if (!line.startsWith('data:')) continue;
          final payload = line.substring(5).trim();
          if (payload.isEmpty) continue;
          try {
            final json = jsonDecode(payload) as Map<String, dynamic>;
            yield ChatStreamEvent.fromJson(json);
          } catch (_) {
            // ignore malformed frames
          }
        }
      }
    }
  }

  void _captureCookies(HttpClientResponse response) {
    final raw = response.headers.value(HttpHeaders.setCookieHeader);
    if (raw == null) return;
    for (final pair in raw.split(',')) {
      final parts = pair.split(';').first.trim();
      final eq = parts.indexOf('=');
      if (eq <= 0) continue;
      final name = parts.substring(0, eq).trim();
      final value = parts.substring(eq + 1).trim();
      if (name == 'niser_chat_session') {
        _sessionId = value;
        _store?.writeChatSessionId(value);
      }
      if (name == 'niser_chat_visitor') {
        _visitorId = value;
        _store?.writeChatVisitorId(value);
      }
    }
  }
}