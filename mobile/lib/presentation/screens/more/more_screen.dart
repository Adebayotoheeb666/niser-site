import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:niser_mobile/l10n/generated/app_localizations.dart';

/// "More" menu hub — entries surface in later phases.
class MoreScreen extends ConsumerWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.tabMore)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.event_outlined),
              title: Text(l10n.events),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/events'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.dataset_outlined),
              title: Text(l10n.dataCatalogue),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/data'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.newspaper_outlined),
              title: Text(l10n.news),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/news'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.notifications_outlined),
              title: Text(l10n.policyAlerts),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/notifications'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.tune),
              title: Text(l10n.notificationPrefs),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/notification-prefs'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.bookmark_border),
              title: const Text('Saved for offline'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/saved'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: Text(l10n.settings),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/settings'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.mail_outline),
              title: Text(l10n.newsletter),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/subscribe'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.contact_mail_outlined),
              title: Text(l10n.contactUs),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/contact'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.translate),
              title: Text(l10n.translate),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/translate'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: Text(l10n.settings),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/settings'),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.info_outline),
              title: Text(l10n.about),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/about'),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'NISER Mobile v0.1.0',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.outline,
            ),
          ),
        ],
      ),
    );
  }
}
