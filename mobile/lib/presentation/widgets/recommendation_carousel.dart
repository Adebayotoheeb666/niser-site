import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/recommendation.dart';
import '../../data/repositories/recommendation_repository.dart';
import '../../data/repositories/saved_content_repository.dart';

/// Horizontal carousel of related content below each content item
/// (Implementation Plan §9 Capability 5 — mobile surface).
///
/// Cards show the content-type badge, title, and a "Save offline" action.
class RecommendationCarousel extends ConsumerWidget {
  const RecommendationCarousel({super.key, required this.slug, required this.type});

  final String slug;
  final String type;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final async = ref.watch(recommendationsFamily((slug: slug, type: type)));

    return async.when(
      data: (items) {
        if (items.isEmpty) return const SizedBox.shrink();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Related for you',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            SizedBox(
              height: 168,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final item = items[index];
                  return _RecommendationCard(item: item);
                },
              ),
            ),
          ],
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}

class _RecommendationCard extends ConsumerWidget {
  const _RecommendationCard({required this.item});

  final Recommendation item;

  static const Map<String, ({String label, Color color})> _typeMeta = {
    'publication': (label: 'Publication', color: Color(0xFF0A5F3D)),
    'insight': (label: 'Insight', color: Color(0xFF1D4ED8)),
    'event': (label: 'Event', color: Color(0xFF7C3AED)),
    'news': (label: 'News', color: Color(0xFFB45309)),
  };

  Future<void> _saveOffline(BuildContext context, WidgetRef ref) async {
    await ref.read(savedContentRepositoryProvider).save(
          id: item.id,
          title: item.title,
          type: item.type,
          slug: item.slug ?? '',
        );
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Saved "${item.title}" for offline')),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final meta = _typeMeta[item.type] ?? (label: 'Content', color: Colors.grey);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.go(item.routePath),
        child: Container(
          width: 220,
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: meta.color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  meta.label,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: meta.color,
                        fontWeight: FontWeight.w700,
                      ),
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Text(
                  item.title,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () => _saveOffline(context, ref),
                  icon: const Icon(Icons.bookmark_add_outlined, size: 18),
                  label: const Text('Save'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
