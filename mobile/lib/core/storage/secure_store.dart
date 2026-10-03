import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wrapper around `flutter_secure_storage` for tokens and user preferences.
///
/// Used for: FCM device token cache, notification topic preferences,
/// text scale, language. Nothing sensitive is stored in Hive.
class SecureStore {
  SecureStore({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _chatSessionKey = 'chat_session_id';
  static const _chatVisitorKey = 'chat_visitor_id';
  static const _notificationTopicsKey = 'notification_topics';
  static const _notificationsEnabledKey = 'notifications_enabled';
  static const _fingerprintKey = 'chat_fingerprint';

  Future<String?> read(String key) => _storage.read(key: key);

  Future<void> write(String key, String value) =>
      _storage.write(key: key, value: value);

  Future<void> delete(String key) => _storage.delete(key: key);

  Future<String?> readChatSessionId() => _storage.read(key: _chatSessionKey);

  Future<void> writeChatSessionId(String value) =>
      _storage.write(key: _chatSessionKey, value: value);

  Future<String?> readChatVisitorId() => _storage.read(key: _chatVisitorKey);

  Future<void> writeChatVisitorId(String value) =>
      _storage.write(key: _chatVisitorKey, value: value);

  Future<String?> readChatFingerprint() => _storage.read(key: _fingerprintKey);

  Future<void> writeChatFingerprint(String value) =>
      _storage.write(key: _fingerprintKey, value: value);

  Future<List<String>?> readNotificationTopics() async {
    final raw = await _storage.read(key: _notificationTopicsKey);
    if (raw == null || raw.isEmpty) return null;
    return raw.split(',').where((t) => t.isNotEmpty).toList();
  }

  Future<void> writeNotificationTopics(List<String> topics) =>
      _storage.write(key: _notificationTopicsKey, value: topics.join(','));

  Future<bool> readNotificationsEnabled() async {
    final raw = await _storage.read(key: _notificationsEnabledKey);
    return raw == 'true';
  }

  Future<void> writeNotificationsEnabled(bool enabled) =>
      _storage.write(key: _notificationsEnabledKey, value: '$enabled');

  Future<void> clear() async {
    await _storage.deleteAll();
  }
}

final secureStoreProvider = Provider<SecureStore>((ref) => SecureStore());
