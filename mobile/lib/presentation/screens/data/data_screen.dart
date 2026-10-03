import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/dataset.dart';
import '../../../data/repositories/dataset_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../theme/app_theme.dart';
import '../../widgets/async_view.dart';

final datasetsProvider = FutureProvider.autoDispose<List<Dataset>>((ref) {
  return ref.watch(datasetRepositoryProvider).list();
});

class DataScreen extends ConsumerWidget {
  const DataScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final datasets = ref.watch(datasetsProvider);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.openData)),
      body: AsyncView<List<Dataset>>(
        async: datasets,
        onRetry: () => ref.invalidate(datasetsProvider),
        data: (items) {
          if (items.isEmpty) {
            return EmptyState(
              icon: Icons.dataset_outlined,
              message: l10n.noDatasets,
            );
          }
          return RefreshIndicator(
            onRefresh: () => ref.refresh(datasetsProvider.future),
            child: ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final dataset = items[index];
                return _DatasetCard(
                  dataset: dataset,
                  onTap: () => context.go('/data/${dataset.id}'),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _DatasetCard extends StatelessWidget {
  const _DatasetCard({required this.dataset, required this.onTap});

  final Dataset dataset;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: NiserColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child:
                    const Icon(Icons.dataset_outlined, color: NiserColors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      dataset.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    if (dataset.organization.title.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        dataset.organization.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                    if (dataset.rowsCount != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        '${dataset.rowsCount} ${AppLocalizations.of(context).rows}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const ExcludeSemantics(
                child: Icon(Icons.chevron_right, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}