import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/api/api_client.dart';
import '../../core/storage/hive_boxes.dart';
import '../models/push_notification.dart';

const allowedTopics = [
  'niser_publications',
  'niser_events',
  'niser_insights',
  'niser_rapid_response',
];

/// FCM device-token registration via /api/fcm-register and
/// /api/fcm-unregister, plus a local in-app feed of received pushes.
///
/// Tokens are stored anonymously in Firestore; the feed lives in a Hive box.
class NotificationRepository {
  NotificationRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<void> register({
    required String token,
    required String platform,
    List<String> topics = const [],
  }) async {
    await _api.postJson<Map<String, dynamic>>(
      '/api/fcm-register',
      data: {
        'token': token,
        'platform': platform,
        'topics': topics.where(allowedTopics.contains).toList(),
      },
    );
  }

  Future<void> unregister(String token) async {
    await _api.postJson<Map<String, dynamic>>(
      '/api/fcm-unregister',
      data: {'token': token},
    );
  }

  // ---- Local feed ----------------------------------------------------------

  Box<String> _feedBox() => Hive.box<String>(HiveBoxes.notificationsFeed);

  Future<void> addToFeed(PushNotification notification) async {
    final box = _feedBox();
    await box.put(
      notification.id,
      jsonEncode(notification.toJson()),
    );
  }

  Future<List<PushNotification>> feed() async {
    final box = _feedBox();
    final entries = <(int, PushNotification)>[];
    for (final entry in box.toMap().entries) {
      final json = jsonDecode(entry.value) as Map<String, dynamic>;
      json['id'] = entry.key;
      final notif = PushNotification.fromJson(json);
      entries.add((notif.receivedAt.microsecondsSinceEpoch, notif));
    }
    entries.sort((a, b) => b.$1.compareTo(a.$1));
    return entries.map((e) => e.$2).toList();
  }

  Future<void> markRead(String id) async {
    final box = _feedBox();
    final raw = box.get(id);
    if (raw == null) return;
    final json = jsonDecode(raw) as Map<String, dynamic>;
    json['read'] = true;
    await box.put(id, jsonEncode(json));
  }

  Future<void> markAllRead() async {
    final box = _feedBox();
    for (final entry in box.toMap().entries) {
      final json = jsonDecode(entry.value) as Map<String, dynamic>;
      json['read'] = true;
      await box.put(entry.key, jsonEncode(json));
    }
  }

  Future<void> clearFeed() async {
    await _feedBox().clear();
  }
}

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepository(api: ref.watch(apiClientProvider));
});