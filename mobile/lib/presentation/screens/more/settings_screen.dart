import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

import '../../../data/repositories/language_prefs.dart';
import '../../../data/repositories/saved_content_repository.dart';
import '../../../data/repositories/theme_prefs.dart';

/// Settings hub: interface/content language, appearance, notifications,
/// saved content.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final currentLanguage = ref.watch(contentLanguageProvider);
    final currentThemeMode = ref.watch(themeModeProvider);

    final themeModeLabels = {
      ThemeMode.system: l10n.themeSystem,
      ThemeMode.light: l10n.themeLight,
      ThemeMode.dark: l10n.themeDark,
    };

    return Scaffold(
      appBar: AppBar(title: Text(l10n.settings)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.translate),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          l10n.contentLanguage,
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    l10n.contentLanguageSubtitle,
                    style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.outline),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final entry in LanguagePrefs.languages.entries)
                        ChoiceChip(
                          label: Text(entry.value),
                          selected: currentLanguage == entry.key,
                          onSelected: (_) {
                            ref.read(contentLanguageProvider.notifier).state = entry.key;
                            ref.read(languagePrefsProvider).save(entry.key);
                          },
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.brightness_6_outlined),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          l10n.appearance,
                          style: theme.textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    l10n.appearanceSubtitle,
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: theme.colorScheme.outline),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final entry in themeModeLabels.entries)
                        ChoiceChip(
                          label: Text(entry.value),
                          selected: currentThemeMode == entry.key,
                          onSelected: (_) {
                            ref.read(themeModeProvider.notifier).state =
                                entry.key;
                            ref.read(themePrefsProvider).save(entry.key);
                          },
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: const Icon(Icons.bookmark_border),
              title: Text(l10n.savedForOffline),
              subtitle: Text(l10n.itemsCount(
                  ref.watch(savedContentRepositoryProvider).list().length)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/saved'),
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
              leading: const Icon(Icons.info_outline),
              title: Text(l10n.about),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/more/about'),
            ),
          ),
        ],
      ),
    );
  }
}
