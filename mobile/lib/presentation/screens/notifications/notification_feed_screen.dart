import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/push_notification.dart';
import '../../../data/repositories/notification_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../services/push_navigator.dart';
import '../../widgets/async_view.dart';
import '../../widgets/app_launcher.dart';

final notificationFeedProvider =
    FutureProvider.autoDispose<List<PushNotification>>((ref) {
  return ref.watch(notificationRepositoryProvider).feed();
});

class NotificationFeedScreen extends ConsumerWidget {
  const NotificationFeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final feed = ref.watch(notificationFeedProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.policyAlerts),
        actions: [
          TextButton(
            onPressed: () async {
              await ref.read(notificationRepositoryProvider).markAllRead();
              ref.invalidate(notificationFeedProvider);
            },
            child: Text(l10n.markAllRead),
          ),
        ],
      ),
      body: AsyncView<List<PushNotification>>(
        async: feed,
        onRetry: () => ref.invalidate(notificationFeedProvider),
        data: (items) {
          if (items.isEmpty) {
            return EmptyState(
              icon: Icons.notifications_none,
              message: l10n.noNotifications,
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final notif = items[index];
              return _NotificationTile(notification: notif);
            },
          );
        },
      ),
    );
  }
}

class _NotificationTile extends ConsumerWidget {
  const _NotificationTile({required this.notification});

  final PushNotification notification;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          notification.read
              ? Icons.notifications_none
              : Icons.notifications_active,
          color: notification.read
              ? theme.colorScheme.outline
              : theme.colorScheme.primary,
        ),
        title: Text(
          notification.title,
          style: TextStyle(
            fontWeight:
                notification.read ? FontWeight.normal : FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              notification.body,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              _formatTime(notification.receivedAt, l10n),
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.outline,
              ),
            ),
          ],
        ),
        onTap: () async {
          if (!notification.read) {
            await ref.read(notificationRepositoryProvider).markRead(notification.id);
            ref.invalidate(notificationFeedProvider);
          }
          final payload = {
            'type': notification.type ?? '',
            'slug': notification.target ?? '',
            'url': notification.url ?? '',
          };
          if (notification.type == 'rapid_response' &&
              (notification.url?.isNotEmpty ?? false)) {
            AppLauncher.openWeb(notification.url!);
            return;
          }
          ref.read(pushNavigatorProvider).navigate(payload);
        },
      ),
    );
  }

  String _formatTime(DateTime time, AppLocalizations l10n) {
    final now = DateTime.now();
    final diff = now.difference(time);
    if (diff.inMinutes < 1) return l10n.timeNow;
    if (diff.inHours < 1) return '${diff.inMinutes}m';
    if (diff.inDays < 1) return '${diff.inHours}h';
    return '${time.day}/${time.month}/${time.year}';
  }
}