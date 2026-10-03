import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../screens/chat/chat_screen.dart';
import '../screens/contact/contact_screen.dart';
import '../screens/data/data_screen.dart';
import '../screens/data/dataset_detail_screen.dart';
import '../screens/events/event_detail_screen.dart';
import '../screens/events/events_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/insights/insight_detail_screen.dart';
import '../screens/insights/insights_screen.dart';
import '../screens/more/about_screen.dart';
import '../screens/more/more_screen.dart';
import '../screens/more/saved_content_screen.dart';
import '../screens/more/settings_screen.dart';
import '../screens/news/news_detail_screen.dart';
import '../screens/news/news_screen.dart';
import '../screens/notifications/notification_feed_screen.dart';
import '../screens/notifications/notification_prefs_screen.dart';
import '../screens/people/people_screen.dart';
import '../screens/people/researcher_detail_screen.dart';
import '../screens/publications/publication_detail_screen.dart';
import '../screens/publications/publications_screen.dart';
import '../screens/search/search_screen.dart';
import '../screens/subscribe/subscribe_screen.dart';
import '../screens/translate/translate_screen.dart';
import '../screens/viewer/pdf_viewer_screen.dart';
import '../widgets/offline_banner.dart';

/// App-wide navigation. Five-tab shell + secondary routes.
final rootNavigatorKey = GlobalKey<NavigatorState>();

final appRouterProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/home',
    routes: [
      ShellRoute(
        builder: (context, state, child) => _AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            name: 'home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/publications',
            name: 'publications',
            builder: (context, state) => const PublicationsScreen(),
          ),
          GoRoute(
            path: '/people',
            name: 'people',
            builder: (context, state) => const PeopleScreen(),
          ),
          GoRoute(
            path: '/chat',
            name: 'chat',
            builder: (context, state) => const ChatScreen(),
          ),
          GoRoute(
            path: '/more',
            name: 'more',
            builder: (context, state) => const MoreScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/publications/:slug',
        name: 'publication-detail',
        builder: (context, state) => PublicationDetailScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/people/:slug',
        name: 'researcher-detail',
        builder: (context, state) => ResearcherDetailScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/insights',
        name: 'insights',
        builder: (context, state) => const InsightsScreen(),
      ),
      GoRoute(
        path: '/insights/:slug',
        name: 'insight-detail',
        builder: (context, state) => InsightDetailScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/events',
        name: 'events',
        builder: (context, state) => const EventsScreen(),
      ),
      GoRoute(
        path: '/events/:slug',
        name: 'event-detail',
        builder: (context, state) => EventDetailScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/news',
        name: 'news',
        builder: (context, state) => const NewsScreen(),
      ),
      GoRoute(
        path: '/news/:slug',
        name: 'news-detail',
        builder: (context, state) => NewsDetailScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/search',
        name: 'search',
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: '/more/events',
        name: 'more-events',
        builder: (context, state) => const EventsScreen(),
      ),
      GoRoute(
        path: '/more/data',
        name: 'more-data',
        builder: (context, state) => const DataScreen(),
      ),
      GoRoute(
        path: '/data/:id',
        name: 'dataset-detail',
        builder: (context, state) => DatasetDetailScreen(
          datasetId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/more/news',
        name: 'more-news',
        builder: (context, state) => const NewsScreen(),
      ),
      GoRoute(
        path: '/more/notifications',
        name: 'more-notifications',
        builder: (context, state) => const NotificationFeedScreen(),
      ),
      GoRoute(
        path: '/more/notification-prefs',
        name: 'more-notification-prefs',
        builder: (context, state) => const NotificationPrefsScreen(),
      ),
      GoRoute(
        path: '/more/settings',
        name: 'more-settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/viewer',
        name: 'viewer',
        builder: (context, state) {
          final doc = state.extra as PdfDoc?;
          if (doc == null) return const Scaffold(body: SizedBox.shrink());
          return PdfViewerScreen(doc: doc);
        },
      ),
      GoRoute(
        path: '/more/saved',
        name: 'more-saved',
        builder: (context, state) => const SavedContentScreen(),
      ),
      GoRoute(
        path: '/more/subscribe',
        name: 'more-subscribe',
        builder: (context, state) => const SubscribeScreen(),
      ),
      GoRoute(
        path: '/more/contact',
        name: 'more-contact',
        builder: (context, state) => const ContactScreen(),
      ),
      GoRoute(
        path: '/more/translate',
        name: 'more-translate',
        builder: (context, state) => const TranslateScreen(),
      ),
      GoRoute(
        path: '/more/about',
        name: 'more-about',
        builder: (context, state) => const AboutScreen(),
      ),
      GoRoute(
        path: '/more/privacy',
        name: 'more-privacy',
        builder: (context, state) => const PrivacyScreen(),
      ),
    ],
  );
  return router;
});

/// Bottom-navigation shell wrapping the five primary tabs.
class _AppShell extends ConsumerWidget {
  const _AppShell({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      body: Column(
        children: [
          const OfflineBanner(),
          Expanded(child: child),
        ],
      ),
      bottomNavigationBar: _ShellNav(l10n: l10n),
    );
  }
}

class _ShellNav extends StatelessWidget {
  const _ShellNav({required this.l10n});

  final AppLocalizations l10n;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;

    int index;
    if (location.startsWith('/publications')) {
      index = 1;
    } else if (location.startsWith('/people')) {
      index = 2;
    } else if (location.startsWith('/chat')) {
      index = 3;
    } else if (location.startsWith('/more')) {
      index = 4;
    } else {
      index = 0;
    }

    return NavigationBar(
      selectedIndex: index,
      onDestinationSelected: (i) {
        switch (i) {
          case 0:
            context.go('/home');
          case 1:
            context.go('/publications');
          case 2:
            context.go('/people');
          case 3:
            context.go('/chat');
          case 4:
            context.go('/more');
        }
      },
      destinations: [
        NavigationDestination(
          icon: const Icon(Icons.home_outlined),
          selectedIcon: const Icon(Icons.home),
          label: l10n.tabHome,
        ),
        NavigationDestination(
          icon: const Icon(Icons.menu_book_outlined),
          selectedIcon: const Icon(Icons.menu_book),
          label: l10n.tabResearch,
        ),
        NavigationDestination(
          icon: const Icon(Icons.groups_outlined),
          selectedIcon: const Icon(Icons.groups),
          label: l10n.tabPeople,
        ),
        NavigationDestination(
          icon: const Icon(Icons.chat_bubble_outline),
          selectedIcon: const Icon(Icons.chat_bubble),
          label: l10n.tabChat,
        ),
        NavigationDestination(
          icon: const Icon(Icons.more_horiz),
          selectedIcon: const Icon(Icons.more_horiz),
          label: l10n.tabMore,
        ),
      ],
    );
  }
}
