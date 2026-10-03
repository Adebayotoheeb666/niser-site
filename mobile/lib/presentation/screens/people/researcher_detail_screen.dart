import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/researcher.dart';
import '../../../data/repositories/researcher_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/cached_image.dart';
import '../../widgets/async_view.dart';
import '../../widgets/content_cards.dart';
import '../../widgets/labels.dart';
import '../../widgets/section_header.dart';

final researcherDetailProvider =
    FutureProvider.autoDispose.family<Researcher?, String>((ref, slug) async {
  return (await ref.watch(researcherRepositoryProvider).bySlug(slug)).value;
});

class ResearcherDetailScreen extends ConsumerWidget {
  const ResearcherDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final async = ref.watch(researcherDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.researchers)),
      body: AsyncView<Researcher?>(
        async: async,
        onRetry: () => ref.invalidate(researcherDetailProvider(slug)),
        data: (r) {
          if (r == null) {
            return EmptyState(icon: Icons.person_off_outlined, message: l10n.noResearchers);
          }
          return _ResearcherBody(r: r);
        },
      ),
    );
  }
}

class _ResearcherBody extends ConsumerWidget {
  const _ResearcherBody({required this.r});

  final Researcher r;

  List<Widget> _contactItems(AppLocalizations l10n) {
    final items = <Widget>[];
    if (r.email != null && r.email!.isNotEmpty) {
      items.add(_ContactTile(
        icon: Icons.email_outlined,
        label: l10n.email,
        value: r.email!,
        onTap: () => AppLauncher.mail(r.email!),
      ));
    }
    if (r.phone != null && r.phone!.isNotEmpty) {
      items.add(_ContactTile(
        icon: Icons.phone_outlined,
        label: l10n.phone,
        value: r.phone!,
        onTap: () => AppLauncher.call(r.phone!),
      ));
    }
    if (r.orcid != null && r.orcid!.isNotEmpty) {
      final url = r.orcid!.startsWith('http') ? r.orcid! : 'https://orcid.org/${r.orcid}';
      items.add(_ContactTile(
        icon: Icons.badge_outlined,
        label: l10n.orcid,
        value: r.orcid!,
        onTap: () => AppLauncher.open(url),
      ));
    }
    if (r.websiteUrl != null && r.websiteUrl!.isNotEmpty) {
      final url = AppLauncher.normalizeUrl(r.websiteUrl);
      if (url != null) {
        items.add(_ContactTile(
          icon: Icons.language,
          label: l10n.website,
          value: r.websiteUrl!,
          onTap: () => AppLauncher.open(url),
        ));
      }
    }
    for (final (key, value) in [
      ('Google Scholar', r.googleScholar),
      ('ResearchGate', r.researchGate),
      ('LinkedIn', r.linkedin),
    ]) {
      if (value != null && value.isNotEmpty) {
        items.add(_ContactTile(
          icon: Icons.link,
          label: key,
          value: value,
          onTap: () {
            final url = AppLauncher.normalizeUrl(value);
            if (url != null) AppLauncher.open(url);
          },
        ));
      }
    }
    return items;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            NiserCachedAvatar(url: r.photo, radius: 32),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    r.displayName,
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  if (r.position.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(r.position, style: theme.textTheme.bodyMedium),
                  ],
                  const SizedBox(height: 8),
                  MetaTag(label: r.division.label),
                ],
              ),
            ),
          ],
        ),
        if (r.biography != null && r.biography!.isNotEmpty) ...[
          const SizedBox(height: 24),
          SectionHeader(title: l10n.biography),
          SelectableText(r.biography!, style: theme.textTheme.bodyMedium),
        ],
        if (r.researchInterests != null && r.researchInterests!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: l10n.researchInterests),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final i in r.researchInterests!) Chip(label: Text(i))],
          ),
        ],
        if (_contactItems(l10n).isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: l10n.contact),
          Card(
            child: Column(
              children: [
                for (final tile in _contactItems(l10n)) tile,
              ],
            ),
          ),
        ],
        if (r.selectedPublications != null && r.selectedPublications!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: l10n.selectedPublications),
          for (final p in r.selectedPublications!)
            ContentCards.publication(
              context: context,
              p: p,
              onTap: () => context.go('/publications/${p.slug}'),
            ),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}

class _ContactTile extends StatelessWidget {
  const _ContactTile({
    required this.icon,
    required this.label,
    required this.value,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final String value;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      subtitle: Text(value, maxLines: 1, overflow: TextOverflow.ellipsis),
      onTap: onTap,
    );
  }
}
