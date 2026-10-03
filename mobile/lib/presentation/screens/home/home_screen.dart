import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/cms_event.dart';
import '../../../data/models/insight.dart';
import '../../../data/models/news_item.dart';
import '../../../data/repositories/event_repository.dart';
import '../../../data/repositories/insight_repository.dart';
import '../../../data/repositories/news_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../theme/app_theme.dart';
import '../../widgets/content_cards.dart';
import '../../widgets/section_header.dart';

final homeNewsProvider = FutureProvider.autoDispose((ref) async {
  return (await ref.watch(newsRepositoryProvider).list(limit: 5)).value;
});

final homeEventsProvider = FutureProvider.autoDispose((ref) async {
  return (await ref
          .watch(eventRepositoryProvider)
          .list(scope: EventScope.upcoming, limit: 3))
      .value;
});

final homeInsightsProvider = FutureProvider.autoDispose((ref) async {
  return (await ref.watch(insightRepositoryProvider).list(limit: 3)).value;
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final news = ref.watch(homeNewsProvider);
    final events = ref.watch(homeEventsProvider);
    final insights = ref.watch(homeInsightsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            tooltip: l10n.search,
            onPressed: () => context.go('/search'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const _Hero(),
          const SizedBox(height: 24),
          _QuickLinks(),
          const SizedBox(height: 24),
          SectionHeader(
            title: l10n.latestNews,
            onViewAll: () => context.go('/news'),
            viewAllLabel: l10n.viewAll,
          ),
          _NewsSection(async: news),
          const SizedBox(height: 16),
          SectionHeader(
            title: l10n.upcomingEvents,
            onViewAll: () => context.go('/events'),
            viewAllLabel: l10n.viewAll,
          ),
          _EventsSection(async: events),
          const SizedBox(height: 16),
          SectionHeader(
            title: l10n.featuredInsights,
            onViewAll: () => context.go('/insights'),
            viewAllLabel: l10n.viewAll,
          ),
          _InsightsSection(async: insights),
        ],
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [NiserColors.primary, NiserColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l10n.homeHeroTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            l10n.homeHeroSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.white.withValues(alpha: 0.92),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickLinks extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final items = [
      (Icons.menu_book_outlined, l10n.publications, '/publications'),
      (Icons.groups_outlined, l10n.researchers, '/people'),
      (Icons.lightbulb_outline, l10n.insights, '/insights'),
      (Icons.event_outlined, l10n.events, '/events'),
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.7,
      children: [
        for (final (icon, label, path) in items)
          Card(
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => context.go(path),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Icon(icon, color: NiserColors.primary),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        label,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _NewsSection extends ConsumerWidget {
  const _NewsSection({required this.async});

  final AsyncValue<List<NewsItem>> async;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return async.when(
      loading: () => const _SectionLoading(),
      error: (_, __) => const SizedBox.shrink(),
      data: (items) {
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          children: [
            for (final item in items)
              ContentCards.news(
                context: context,
                n: item,
                onTap: () => context.go('/news/${item.slug}'),
              ),
          ],
        );
      },
    );
  }
}

class _EventsSection extends ConsumerWidget {
  const _EventsSection({required this.async});

  final AsyncValue<List<CMSEvent>> async;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return async.when(
      loading: () => const _SectionLoading(),
      error: (_, __) => const SizedBox.shrink(),
      data: (items) {
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          children: [
            for (final event in items)
              ContentCards.event(
                context: context,
                e: event,
                onTap: () => context.go('/events/${event.slug}'),
              ),
          ],
        );
      },
    );
  }
}

class _InsightsSection extends ConsumerWidget {
  const _InsightsSection({required this.async});

  final AsyncValue<List<Insight>> async;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return async.when(
      loading: () => const _SectionLoading(),
      error: (_, __) => const SizedBox.shrink(),
      data: (items) {
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          children: [
            for (final insight in items)
              ContentCards.insight(
                context: context,
                i: insight,
                onTap: () => context.go('/insights/${insight.slug}'),
              ),
          ],
        );
      },
    );
  }
}

class _SectionLoading extends StatelessWidget {
  const _SectionLoading();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 24),
      child: Center(
        child: SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    );
  }
}
