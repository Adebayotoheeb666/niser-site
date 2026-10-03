import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/date_format.dart';
import '../../../data/models/insight.dart';
import '../../../data/repositories/insight_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';
import '../../widgets/cached_image.dart';
import '../../widgets/insight_body.dart';
import '../../widgets/labels.dart';
import '../../widgets/section_header.dart';
import '../../widgets/recommendation_carousel.dart';

final insightDetailProvider =
    FutureProvider.autoDispose.family<Insight?, String>((ref, slug) async {
  return (await ref.watch(insightRepositoryProvider).bySlug(slug)).value;
});

class InsightDetailScreen extends ConsumerWidget {
  const InsightDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final async = ref.watch(insightDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.insights)),
      body: AsyncView<Insight?>(
        async: async,
        onRetry: () => ref.invalidate(insightDetailProvider(slug)),
        data: (insight) {
          if (insight == null) {
            return EmptyState(icon: Icons.lightbulb_outline, message: l10n.noInsights);
          }
          return _InsightBody(insight: insight);
        },
      ),
    );
  }
}

class _InsightBody extends StatelessWidget {
  const _InsightBody({required this.insight});

  final Insight insight;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final when = formatDate(insight.publishedDateTime);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            MetaTag(label: insight.contentType.label),
            if (when.isNotEmpty) MetaTag(label: when),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          insight.title,
          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        if (insight.author != null && insight.author!.displayName.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(
            insight.author!.displayName,
            style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
        if (insight.featuredImage != null && insight.featuredImage!.isNotEmpty) ...[
          const SizedBox(height: 16),
          NiserCachedImage(
            url: insight.featuredImage,
            width: double.infinity,
            height: 200,
            fit: BoxFit.cover,
            borderRadius: BorderRadius.circular(12),
          ),
        ],
        if (insight.excerpt != null && insight.excerpt!.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text(
            insight.excerpt!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontStyle: FontStyle.italic,
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
        const SizedBox(height: 20),
        InsightBody(insight: insight),
        if (insight.pdfFile != null && insight.pdfFile!.isNotEmpty) ...[
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: () => AppLauncher.openWeb(insight.pdfFile!),
            icon: const Icon(Icons.picture_as_pdf_outlined),
            label: Text(l10n.downloadPdf),
          ),
        ],
        if (insight.tags != null && insight.tags!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'Tags'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final t in insight.tags!) Chip(label: Text(t))],
          ),
        ],
        if (insight.documents != null && insight.documents!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'Documents'),
          Card(
            child: Column(
              children: [
                for (final doc in insight.documents!)
                  ListTile(
                    leading: const Icon(Icons.insert_drive_file_outlined),
                    title: Text(doc.title),
                    subtitle: doc.description?.isNotEmpty == true
                        ? Text(doc.description!, maxLines: 2)
                        : null,
                    onTap: () => AppLauncher.openWeb(doc.url),
                  ),
              ],
            ),
          ),
        ],
        if (insight.slug.isNotEmpty) ...[
          const SizedBox(height: 24),
          RecommendationCarousel(slug: insight.slug, type: 'insight'),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}
