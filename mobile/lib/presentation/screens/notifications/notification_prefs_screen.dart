import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/storage/secure_store.dart';
import '../../../data/services/fcm_service.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

/// Push notification preferences: master switch + topic subscriptions.
class NotificationPrefsScreen extends ConsumerStatefulWidget {
  const NotificationPrefsScreen({super.key});

  @override
  ConsumerState<NotificationPrefsScreen> createState() =>
      _NotificationPrefsScreenState();
}

class _NotificationPrefsScreenState
    extends ConsumerState<NotificationPrefsScreen> {
  bool? _enabled;
  List<String> _topics = const ['niser_publications', 'niser_insights'];
  bool _busy = false;
  bool _needsPermission = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final store = ref.read(secureStoreProvider);
    final enabled = await store.readNotificationsEnabled();
    final topics = await ref.read(fcmServiceProvider).currentTopics();
    if (!mounted) return;
    setState(() {
      _enabled = enabled;
      _topics = topics;
      _needsPermission = enabled == false;
    });
  }

  Future<void> _setEnabled(bool value) async {
    final fcm = ref.read(fcmServiceProvider);
    setState(() {
      _enabled = value;
      _busy = true;
    });

    if (value) {
      var granted = true;
      if (!fcm.isConfigured || _needsPermission) {
        granted = await fcm.requestPermission();
        if (!mounted) return;
        if (!granted) {
          setState(() {
            _enabled = false;
            _busy = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(AppLocalizations.of(context).notificationsDenied)),
          );
          return;
        }
        if (!mounted) return;
      }
      await ref.read(secureStoreProvider).writeNotificationsEnabled(true);
      await fcm.syncTopicsAndToken(topics: _topics);
    } else {
      await ref.read(secureStoreProvider).writeNotificationsEnabled(false);
      await fcm.unsubscribeAll(topics: _topics);
    }

    if (!mounted) return;
    setState(() {
      _needsPermission = false;
      _busy = false;
    });
  }

  Future<void> _toggleTopic(String topic, bool on) async {
    final next = on
        ? [..._topics, topic]
        : _topics.where((t) => t != topic).toList();
    setState(() => _topics = next);

    if (_enabled == true) {
      await ref.read(fcmServiceProvider).syncTopicsAndToken(topics: next);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.notificationPrefs)),
      body: _enabled == null
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                SwitchListTile(
                  value: _enabled!,
                  onChanged: _busy ? null : _setEnabled,
                  title: Text(l10n.enableNotifications),
                  subtitle: Text(l10n.notificationsSubtitle),
                  contentPadding: EdgeInsets.zero,
                ),
                const SizedBox(height: 12),
                Text(
                  l10n.notificationTopics,
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                SwitchListTile(
                  value: _topics.contains('niser_publications'),
                  onChanged: _busy
                      ? null
                      : (v) => _toggleTopic('niser_publications', v),
                  title: Text(l10n.topicPublications),
                  contentPadding: EdgeInsets.zero,
                ),
                SwitchListTile(
                  value: _topics.contains('niser_insights'),
                  onChanged: _busy
                      ? null
                      : (v) => _toggleTopic('niser_insights', v),
                  title: Text(l10n.topicInsights),
                  contentPadding: EdgeInsets.zero,
                ),
                SwitchListTile(
                  value: _topics.contains('niser_events'),
                  onChanged:
                      _busy ? null : (v) => _toggleTopic('niser_events', v),
                  title: Text(l10n.topicEvents),
                  contentPadding: EdgeInsets.zero,
                ),
                SwitchListTile(
                  value: _topics.contains('niser_rapid_response'),
                  onChanged: _busy
                      ? null
                      : (v) => _toggleTopic('niser_rapid_response', v),
                  title: Text(l10n.topicRapidResponse),
                  contentPadding: EdgeInsets.zero,
                ),
                const SizedBox(height: 16),
                Text(
                  l10n.notificationsPrivacy,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.outline,
                  ),
                ),
              ],
            ),
    );
  }
}