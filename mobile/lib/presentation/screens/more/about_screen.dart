import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:niser_mobile/l10n/generated/app_localizations.dart';

/// About screen: contact info, privacy policy link, app version.
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.about)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'NISER',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF006B3F),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Nigerian Institute of Social and Economic Research',
                    style: theme.textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Ibadan, Nigeria',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.outline,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.privacy_tip_outlined),
              title: Text(l10n.privacyPolicy),
              trailing: const Icon(Icons.open_in_new),
              onTap: () => context.go('/more/privacy'),
            ),
          ),
          const SizedBox(height: 12),
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

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Privacy policy')),
      body: const Padding(
        padding: EdgeInsets.all(16),
        child: Text(
          'The NISER mobile app respects your privacy.\n\n'
          '• Notification tokens are stored anonymously and can be removed at any time.\n'
          '• Chat sessions are kept only for as long as needed to answer you, and can be cleared.\n'
          '• No personal data is sold or shared. Read the full policy on the NISER website.\n\n'
          'This is a placeholder summary — full text lands with the release build.',
        ),
      ),
    );
  }
}
