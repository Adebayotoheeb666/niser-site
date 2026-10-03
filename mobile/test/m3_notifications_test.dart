import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/core/storage/secure_store.dart';
import 'package:niser_mobile/data/models/push_notification.dart';
import 'package:niser_mobile/data/repositories/notification_repository.dart';
import 'package:niser_mobile/data/repositories/publication_repository.dart';
import 'package:niser_mobile/data/services/fcm_service.dart';
import 'package:niser_mobile/presentation/screens/notifications/notification_feed_screen.dart';
import 'package:niser_mobile/presentation/screens/notifications/notification_prefs_screen.dart';
import 'package:niser_mobile/presentation/services/push_navigator.dart';
import 'package:niser_mobile/presentation/screens/publications/publication_detail_screen.dart';

import 'helpers/fakes.dart';

PushNotification _notif({
  String id = 'n1',
  String title = 'New Working Paper',
  String? type = 'publication',
  String? target = 'macro-growth',
  bool read = false,
}) {
  return PushNotification(
    id: id,
    title: title,
    body: 'A new publication is available.',
    type: type,
    target: target,
    receivedAt: DateTime.now(),
    read: read,
  );
}

void main() {
  group('PushNavigator', () {
    test('maps payloads to routes', () {
      final nav = PushNavigator();
      expect(nav.routeFor({'type': 'publication', 'slug': 'x'}), '/publications/x');
      expect(nav.routeFor({'type': 'insight', 'slug': 'y'}), '/insights/y');
      expect(nav.routeFor({'type': 'event', 'id': 'z'}), '/events/z');
      expect(nav.routeFor({'type': 'news', 'slug': 'n'}), '/news/n');
      expect(nav.routeFor({'type': 'rapid_response', 'slug': 'r'}), '/news');
      expect(nav.routeFor({'type': 'unknown'}), '/home');
    });

    test('buffers payload until a router is attached', () {
      final nav = PushNavigator();
      nav.buffer({'type': 'news', 'slug': 'n'});
      expect(nav.hasPending, isTrue);
      expect(nav.routeFor({'type': 'news', 'slug': 'n'}), '/news/n');
    });
  });

  testWidgets('feed renders notifications and tap navigates', (tester) async {
    final repo = FakeNotificationRepository(
      items: [_notif(), _notif(id: 'n2', title: 'Rapid brief', type: 'rapid_response', target: null, read: true)],
    );
    await pumpApp(tester, overrides: [
      notificationRepositoryProvider.overrideWithValue(repo),
      publicationRepositoryProvider.overrideWithValue(FakePublicationRepository()),
    ]);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Notifications'));
    await tester.pumpAndSettle();

    expect(find.byType(NotificationFeedScreen), findsOneWidget);
    expect(find.text('New Working Paper'), findsOneWidget);
    expect(find.text('Rapid brief'), findsOneWidget);

    await tester.tap(find.text('New Working Paper'));
    await tester.pumpAndSettle();

    expect(repo.items.first.read, isTrue);
    expect(find.byType(PublicationDetailScreen), findsOneWidget);
  });

  testWidgets('feed empty state and mark all read', (tester) async {
    final repo = FakeNotificationRepository(
      items: [_notif(id: 'n3', title: 'Event reminder', type: 'event', target: 'annual-conference')],
    );
    await pumpApp(tester, overrides: [
      notificationRepositoryProvider.overrideWithValue(repo),
    ]);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Notifications'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Mark all read'));
    await tester.pumpAndSettle();

    expect(repo.items.every((n) => n.read), isTrue);
  });

  testWidgets('prefs shows defaults and enables with topic sync', (tester) async {
    final store = FakeSecureStore();
    final repo = FakeNotificationRepository();
    final fcm = FakeFcmService(store: store, repo: repo);
    await pumpApp(tester, overrides: [
      secureStoreProvider.overrideWithValue(store),
      notificationRepositoryProvider.overrideWithValue(repo),
      fcmServiceProvider.overrideWithValue(fcm),
    ]);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Notification preferences'));
    await tester.pumpAndSettle();

    expect(find.byType(NotificationPrefsScreen), findsOneWidget);
    expect(find.text('Enable notifications'), findsOneWidget);

    await tester.tap(find.byType(SwitchListTile).first);
    await tester.pumpAndSettle();

    expect(store.values['notifications_enabled'], 'true');
    expect(fcm.syncedTopics, ['niser_publications', 'niser_insights']);
  });

  testWidgets('prefs toggle topic syncs updated topics', (tester) async {
    final store = FakeSecureStore();
    final repo = FakeNotificationRepository();
    final fcm = FakeFcmService(store: store, repo: repo);
    await pumpApp(tester, overrides: [
      secureStoreProvider.overrideWithValue(store),
      notificationRepositoryProvider.overrideWithValue(repo),
      fcmServiceProvider.overrideWithValue(fcm),
    ]);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Notification preferences'));
    await tester.pumpAndSettle();

    await tester.tap(find.byType(SwitchListTile).first);
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(SwitchListTile, 'Events & webinars'));
    await tester.pumpAndSettle();

    expect(fcm.syncedTopics, ['niser_publications', 'niser_insights', 'niser_events']);
  });
}