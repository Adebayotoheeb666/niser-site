import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/date_format.dart';
import '../../../data/models/dataset.dart';
import '../../../data/repositories/dataset_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';

final datasetByIdProvider = FutureProvider.autoDispose
    .family<Dataset, String>((ref, id) {
  return ref.watch(datasetRepositoryProvider).byId(id);
});

class DatasetDetailScreen extends ConsumerWidget {
  const DatasetDetailScreen({super.key, required this.datasetId});

  final String datasetId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final dataset = ref.watch(datasetByIdProvider(datasetId));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.openData)),
      body: AsyncView<Dataset>(
        async: dataset,
        onRetry: () => ref.invalidate(datasetByIdProvider(datasetId)),
        data: (item) {
          if (item.id.isEmpty) {
            return EmptyState(
              icon: Icons.dataset_outlined,
              message: l10n.noDatasets,
            );
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                item.title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              if (item.organization.title.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  item.organization.title,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                ),
              ],
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: [
                  for (final tag in item.tags)
                    Chip(
                      label: Text(tag),
                      visualDensity: VisualDensity.compact,
                    ),
                ],
              ),
              if (item.notes.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(item.notes),
              ],
              const SizedBox(height: 24),
              _MetadataSection(dataset: item),
              const SizedBox(height: 24),
              _ResourcesSection(dataset: item),
            ],
          );
        },
      ),
    );
  }
}

class _MetadataSection extends StatelessWidget {
  const _MetadataSection({required this.dataset});

  final Dataset dataset;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    final rows = <(String, String)>[
      if (dataset.rowsCount != null)
        (l10n.rows, dataset.rowsCount.toString()),
      if (dataset.author.isNotEmpty) (l10n.authorLabel, dataset.author),
      if (dataset.maintainer != null && dataset.maintainer!.isNotEmpty)
        (l10n.maintainerLabel, dataset.maintainer!),
      if (dataset.licenseTitle != null && dataset.licenseTitle!.isNotEmpty)
        (l10n.license, dataset.licenseTitle!),
      if (dataset.metadataModified != null)
        (
          l10n.updatedLabel,
          formatDate(
            DateTime.tryParse(dataset.metadataModified!) ?? DateTime.now(),
          ),
        ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          l10n.datasetMetadata,
          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                for (final (i, (label, value)) in rows.indexed) ...[
                  if (i > 0) const Divider(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 110,
                        child: Text(
                          label,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                      Expanded(child: Text(value)),
                    ],
                  ),
                ],
                if (rows.isEmpty)
                  Text(
                    l10n.noMetadata,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.outline,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _ResourcesSection extends StatelessWidget {
  const _ResourcesSection({required this.dataset});

  final Dataset dataset;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    if (dataset.resources.isEmpty) {
      return Text(
        l10n.noResources,
        style: theme.textTheme.bodyMedium?.copyWith(
          color: theme.colorScheme.outline,
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          l10n.resources,
          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        for (final resource in dataset.resources)
          Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: const Icon(Icons.insert_drive_file_outlined),
              title: Text(resource.name, maxLines: 2, overflow: TextOverflow.ellipsis),
              subtitle: Text(
                [
                  resource.format.toUpperCase(),
                  if (resource.size != null) resource.size!,
                ].join(' · '),
              ),
              trailing: IconButton(
                icon: const Icon(Icons.download),
                tooltip: l10n.download,
                onPressed: () => AppLauncher.open(resource.url),
              ),
            ),
          ),
      ],
    );
  }
}