import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/date_format.dart';
import '../../../data/models/news_item.dart';
import '../../../data/repositories/news_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';
import '../../widgets/labels.dart';
import '../../widgets/section_header.dart';

final newsDetailProvider =
    FutureProvider.autoDispose.family<NewsItem?, String>((ref, slug) async {
  return (await ref.watch(newsRepositoryProvider).bySlug(slug)).value;
});

class NewsDetailScreen extends ConsumerWidget {
  const NewsDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final async = ref.watch(newsDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.news)),
      body: AsyncView<NewsItem?>(
        async: async,
        onRetry: () => ref.invalidate(newsDetailProvider(slug)),
        data: (news) {
          if (news == null) {
            return EmptyState(icon: Icons.newspaper_outlined, message: l10n.noNews);
          }
          return _NewsBody(news: news);
        },
      ),
    );
  }
}

class _NewsBody extends StatelessWidget {
  const _NewsBody({required this.news});

  final NewsItem news;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final when = formatDate(news.publishedDateTime);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            MetaTag(label: news.category.label),
            if (when.isNotEmpty) MetaTag(label: when),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          news.title,
          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        if (news.summary != null && news.summary!.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text(
            news.summary!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontStyle: FontStyle.italic,
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
        if (news.body != null && news.body!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SelectableText(news.body!, style: theme.textTheme.bodyMedium),
        ],
        if (news.externalUrl != null && news.externalUrl!.isNotEmpty) ...[
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () => AppLauncher.open(news.externalUrl!),
            icon: const Icon(Icons.open_in_new),
            label: Text(AppLocalizations.of(context).open),
          ),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}