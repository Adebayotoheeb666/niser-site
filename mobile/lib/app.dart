import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

import 'data/repositories/language_prefs.dart';
import 'data/repositories/theme_prefs.dart';
import 'data/services/fcm_service.dart';
import 'l10n/fallback_delegates.dart';
import 'presentation/router/app_router.dart';
import 'presentation/services/push_navigator.dart';
import 'presentation/theme/app_theme.dart';
import 'presentation/widgets/offline_banner.dart';

/// Root widget: provider scope + router + theme.
class NiserApp extends ConsumerStatefulWidget {
  const NiserApp({super.key});

  @override
  ConsumerState<NiserApp> createState() => _NiserAppState();
}

class _NiserAppState extends ConsumerState<NiserApp> {
  bool _pushInitStarted = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_pushInitStarted) {
      _pushInitStarted = true;
      _initPush();
    }
  }

  Future<void> _initPush() async {
    final router = ref.read(appRouterProvider);
    final navigator = ref.read(pushNavigatorProvider);
    navigator.attach(router);
    await ref.read(fcmServiceProvider).init(navigator: navigator);
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(appRouterProvider);
    final themeMode = ref.watch(themeModeProvider);
    final contentLanguage = ref.watch(contentLanguageProvider);

    return MaterialApp.router(
      // Resolved below MaterialApp so delegates are available.
      onGenerateTitle: (context) => AppLocalizations.of(context).appTitle,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeMode,
      localizationsDelegates: [
        ...AppLocalizations.localizationsDelegates,
        // SDK lacks yo/ha/ig Material/Cupertino labels; fall back to the
        // defaults so widgets don't crash (app strings stay localised).
        const FallbackMaterialLocalizationsDelegate(),
        const FallbackCupertinoLocalizationsDelegate(),
      ],
      supportedLocales: AppLocalizations.supportedLocales,
      // The interface follows the content-language preference
      // (en/yo/ha/ig); unknown codes resolve to English via supportedLocales.
      locale: Locale(contentLanguage),
      routerConfig: router,
      builder: (context, child) {
        // Global offline banner overlay (connectivity_plus). Appears above
        // every route when offline; collapses to zero height when online.
        return Column(
          children: [
            const OfflineBanner(),
            Expanded(child: child ?? const SizedBox.shrink()),
          ],
        );
      },
    );
  }
}