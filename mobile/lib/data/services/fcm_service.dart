import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/logger/sentry.dart';
import '../../core/storage/secure_store.dart';
import '../../presentation/services/push_navigator.dart';
import '../models/push_notification.dart';
import '../repositories/notification_repository.dart';

final fcmServiceProvider = Provider<FcmService>((ref) {
  return FcmService(
    store: ref.watch(secureStoreProvider),
    repo: ref.watch(notificationRepositoryProvider),
  );
});

/// Firebase Cloud Messaging integration.
///
/// Firebase is configured at build time via `--dart-define`:
/// `FIREBASE_API_KEY`, `FIREBASE_APP_ID`, `FIREBASE_MESSAGING_SENDER_ID`,
/// `FIREBASE_PROJECT_ID`, `FIREBASE_IOS_BUNDLE_ID`. When any required
/// define is missing the service degrades to a no-op, so the app still
/// builds and runs without Firebase credentials.
class FcmService {
  FcmService({required SecureStore store, required NotificationRepository repo})
      : _store = store,
        _repo = repo;

  final SecureStore _store;
  final NotificationRepository _repo;
  final _localNotifications = FlutterLocalNotificationsPlugin();

  static const String _apiKey = String.fromEnvironment('FIREBASE_API_KEY');
  static const String _appId = String.fromEnvironment('FIREBASE_APP_ID');
  static const String _senderId =
      String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID');
  static const String _projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const String _iosBundleId =
      String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID');

  static const String channelId = 'niser_channel';
  static const String channelName = 'NISER notifications';

  /// True when Firebase credentials were supplied at build time.
  bool get isConfigured =>
      _apiKey.isNotEmpty &&
      _appId.isNotEmpty &&
      _senderId.isNotEmpty &&
      _projectId.isNotEmpty;

  FirebaseOptions get _options => FirebaseOptions(
        apiKey: _apiKey,
        appId: _appId,
        messagingSenderId: _senderId,
        projectId: _projectId,
        iosBundleId: _iosBundleId,
      );

  String get _platform =>
      defaultTargetPlatform == TargetPlatform.iOS ||
              defaultTargetPlatform == TargetPlatform.macOS
          ? 'ios'
          : 'android';

  Future<void> init({required PushNavigator navigator}) async {
    if (!isConfigured) return;

    try {
      await Firebase.initializeApp(options: _options);
    } catch (e) {
      CrashLogger.captureError(e, context: 'firebase-init');
      return;
    }

    final messaging = FirebaseMessaging.instance;
    await _initLocalNotifications();

    final settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    final status = settings.authorizationStatus;
    final authorized = status == AuthorizationStatus.authorized ||
        status == AuthorizationStatus.provisional;

    await _store.writeNotificationsEnabled(authorized);

    messaging.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    if (authorized) {
      await _syncToken(messaging);
    }

    messaging.onTokenRefresh.listen((token) => _syncToken(messaging));
    FirebaseMessaging.onMessage.listen(_handleForeground);
    FirebaseMessaging.onMessageOpenedApp.listen(
      (message) => navigator.navigate(_dataOf(message)),
    );

    final initial = await messaging.getInitialMessage();
    if (initial != null) {
      navigator.buffer(_dataOf(initial));
    }
  }

  Map<String, String> _dataOf(RemoteMessage message) {
    final data = message.data;
    final result = <String, String>{};
    for (final entry in data.entries) {
      if (entry.value != null) result[entry.key] = entry.value.toString();
    }
    return result;
  }

  Future<void> _syncToken(FirebaseMessaging messaging) async {
    final token = await messaging.getToken();
    if (token == null) return;

    final enabled = await _store.readNotificationsEnabled();
    if (!enabled) return;

    final topics = await currentTopics();
    await _syncTokenTopics(messaging, topics);
  }

  Future<void> _syncTokenTopics(
    FirebaseMessaging messaging,
    List<String> topics,
  ) async {
    final token = await messaging.getToken();
    if (token == null) return;
    await _repo.register(token: token, platform: _platform, topics: topics);
    for (final topic in topics) {
      await messaging.subscribeToTopic(topic);
    }
    for (final topic in allowedTopics) {
      if (!topics.contains(topic)) {
        await messaging.unsubscribeFromTopic(topic);
      }
    }
  }

  /// Persists the selected topics and pushes them to FCM + the backend.
  Future<void> syncTopicsAndToken({required List<String> topics}) async {
    await _store.writeNotificationTopics(topics);
    if (!isConfigured) return;
    final enabled = await _store.readNotificationsEnabled();
    if (!enabled) return;
    await _syncTokenTopics(FirebaseMessaging.instance, topics);
  }

  /// Unsubscribes from all topics and clears the backend topic list.
  Future<void> unsubscribeAll({required List<String> topics}) async {
    if (!isConfigured) return;
    final messaging = FirebaseMessaging.instance;
    for (final topic in topics) {
      await messaging.unsubscribeFromTopic(topic);
    }
    final token = await messaging.getToken();
    if (token != null) {
      await _repo.register(token: token, platform: _platform, topics: const []);
    }
  }

  Future<List<String>> currentTopics() async {
    final stored = await _store.readNotificationTopics();
    if (stored != null && stored.isNotEmpty) {
      return stored.where(allowedTopics.contains).toList();
    }
    return const ['niser_publications', 'niser_insights'];
  }

  Future<void> _initLocalNotifications() async {
    await _localNotifications.initialize(
      const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(),
      ),
    );
  }

  Future<void> _handleForeground(RemoteMessage message) async {
    final title = message.notification?.title ?? 'NISER';
    final body = message.notification?.body ?? '';
    if (title.isEmpty && body.isEmpty) return;

    final notif = PushNotification(
      id: message.messageId ?? '${DateTime.now().microsecondsSinceEpoch}',
      title: title,
      body: body,
      type: message.data['type'],
      target: message.data['slug'] ?? message.data['id'],
      url: message.data['url'],
      receivedAt: DateTime.now(),
    );

    await _repo.addToFeed(notif);

    await _localNotifications.show(
      0,
      title,
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          channelName,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
      payload: jsonEncode({
        'type': notif.type,
        'target': notif.target,
        'url': notif.url,
      }),
    );
  }

  /// Prompts the OS permission dialog (used from the preferences screen).
  Future<bool> requestPermission() async {
    if (!isConfigured) return false;
    final settings = await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    final status = settings.authorizationStatus;
    final granted = status == AuthorizationStatus.authorized ||
        status == AuthorizationStatus.provisional;
    await _store.writeNotificationsEnabled(granted);
    return granted;
  }
}
