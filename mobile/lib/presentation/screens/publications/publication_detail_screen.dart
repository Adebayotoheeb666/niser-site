import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/utils/citation.dart';
import '../../../data/models/publication.dart';
import '../../../data/repositories/offline_library_repository.dart';
import '../../../data/repositories/publication_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';
import '../../widgets/cached_image.dart';
import '../../widgets/labels.dart';
import '../../widgets/section_header.dart';
import '../../widgets/recommendation_carousel.dart';
import '../viewer/pdf_viewer_screen.dart';

final publicationDetailProvider =
    FutureProvider.autoDispose.family<Publication?, String>((ref, slug) async {
  return (await ref.watch(publicationRepositoryProvider).bySlug(slug)).value;
});

class PublicationDetailScreen extends ConsumerWidget {
  const PublicationDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final async = ref.watch(publicationDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.publications)),
      body: AsyncView<Publication?>(
        async: async,
        onRetry: () => ref.invalidate(publicationDetailProvider(slug)),
        data: (publication) {
          if (publication == null) {
            return EmptyState(
              icon: Icons.menu_book_outlined,
              message: l10n.noPublications,
            );
          }
          return _PublicationBody(p: publication);
        },
      ),
    );
  }
}

class _PublicationBody extends ConsumerStatefulWidget {
  const _PublicationBody({required this.p});

  final Publication p;

  @override
  ConsumerState<_PublicationBody> createState() => _PublicationBodyState();
}

class _PublicationBodyState extends ConsumerState<_PublicationBody> {
  double? _downloadProgress;

  String get _key => OfflineLibrary.keyFor(
        slug: widget.p.slug,
        url: widget.p.pdfFile,
      );

  Future<void> _readOffline() async {
    final doc = ref.read(offlineLibraryProvider).get(_key);
    if (doc == null) return;
    await context.push('/viewer', extra: PdfDoc(
      title: widget.p.title,
      filePath: doc.filePath,
    ));
  }

  Future<void> _download() async {
    final url = widget.p.pdfFile;
    if (url == null || url.isEmpty || _downloadProgress != null) return;
    setState(() => _downloadProgress = 0.0);
    try {
      await ref.read(offlineLibraryProvider).download(
            key: _key,
            url: url,
            title: widget.p.title,
            onProgress: (p) {
              if (mounted) setState(() => _downloadProgress = p);
            },
          );
      if (!mounted) return;
      setState(() => _downloadProgress = null);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).savedForOffline)),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _downloadProgress = null);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).downloadFailed)),
      );
    }
  }

  Future<void> _removeOffline() async {
    await ref.read(offlineLibraryProvider).remove(_key);
    if (mounted) setState(() {});
  }

  void _copyCitation(BuildContext context, String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(AppLocalizations.of(context).copied)),
    );
  }

  void _sharePublication(BuildContext context) {
    final text = CitationBuilder.shareText(widget.p);
    // ignore: deprecated_member_use — fallback for share_plus <13 API; SharePlus is the new API
    SharePlus.instance.share(ShareParams(text: text, subject: widget.p.title));
  }

  void _showCitationSheet(BuildContext context) {
    final p = widget.p;
    final l10n = AppLocalizations.of(context);
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (sheetCtx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          minChildSize: 0.4,
          maxChildSize: 0.9,
          expand: false,
          builder: (_, controller) => ListView(
            controller: controller,
            padding: const EdgeInsets.all(16),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(l10n.citation, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              _CitationTile(title: 'APA', text: CitationBuilder.apa(p), onCopy: () => _copyCitation(context, CitationBuilder.apa(p))),
              _CitationTile(title: 'Chicago', text: CitationBuilder.chicago(p), onCopy: () => _copyCitation(context, CitationBuilder.chicago(p))),
              _CitationTile(title: 'BibTeX', text: CitationBuilder.bibtex(p), onCopy: () => _copyCitation(context, CitationBuilder.bibtex(p))),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: () => _sharePublication(context),
                icon: const Icon(Icons.share_outlined),
                label: const Text('Share'),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final library = ref.watch(offlineLibraryProvider);
    final isOffline = library.isOffline(_key);

    Widget pdfButton;
    if (_downloadProgress != null) {
      pdfButton = Expanded(
        child: FilledButton.icon(
          onPressed: null,
          icon: const SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          label: Text(l10n.downloadingPdf(
            (_downloadProgress! * 100).round(),
          )),
        ),
      );
    } else if (isOffline) {
      pdfButton = Expanded(
        child: FilledButton.icon(
          onPressed: _readOffline,
          icon: const Icon(Icons.menu_book_outlined),
          label: Text(l10n.read),
        ),
      );
    } else {
      pdfButton = Expanded(
        child: FilledButton.icon(
          onPressed: _download,
          icon: const Icon(Icons.download_outlined),
          label: Text(l10n.downloadPdf),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (widget.p.featuredImage != null && widget.p.featuredImage!.isNotEmpty) ...[
          NiserCachedImage(
            url: widget.p.featuredImage,
            width: double.infinity,
            height: 180,
            fit: BoxFit.cover,
            borderRadius: BorderRadius.circular(12),
          ),
          const SizedBox(height: 16),
        ],
        Text(
          widget.p.title,
          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Wrap(spacing: 8, runSpacing: 8, children: [
          MetaTag(label: widget.p.publicationType.label),
          if (widget.p.publishedYear > 0)
            MetaTag(label: '${widget.p.publishedYear}'),
          MetaTag(label: widget.p.researchDivision.label),
          if (widget.p.isOpenAccess)
            MetaTag(label: l10n.openAccess, icon: Icons.lock_open),
        ]),
        if (widget.p.authors.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text(
            widget.p.authors.map((a) => a.displayName).join(', '),
            style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
        const SizedBox(height: 20),
        Row(
          children: [
            if (widget.p.pdfFile != null && widget.p.pdfFile!.isNotEmpty) ...[
              pdfButton,
              if (isOffline)
                IconButton(
                  tooltip: l10n.removeFromDevice,
                  onPressed: _removeOffline,
                  icon: const Icon(Icons.delete_outline),
                ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _showCitationSheet(context),
                icon: const Icon(Icons.content_copy),
                label: Text(l10n.citation),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filledTonal(
              tooltip: 'Share',
              onPressed: () => _sharePublication(context),
              icon: const Icon(Icons.share_outlined),
            ),
          ],
        ),
        if (widget.p.doi != null && widget.p.doi!.isNotEmpty) ...[
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.link),
              title: const Text('DOI'),
              subtitle: Text(
                widget.p.doi!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              onTap: () => AppLauncher.open(
                widget.p.doi!.startsWith('http')
                    ? widget.p.doi!
                    : 'https://doi.org/${widget.p.doi}',
              ),
            ),
          ),
        ],
        if (widget.p.abstract.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'Abstract'),
          SelectableText(widget.p.abstract, style: theme.textTheme.bodyMedium),
        ],
        if (widget.p.keywords.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'Keywords'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final k in widget.p.keywords) Chip(label: Text(k)),
            ],
          ),
        ],
        if (widget.p.slug.isNotEmpty) ...[
          const SizedBox(height: 24),
          RecommendationCarousel(slug: widget.p.slug, type: 'publication'),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}

class _CitationTile extends StatelessWidget {
  const _CitationTile({required this.title, required this.text, required this.onCopy});

  final String title;
  final String text;
  final VoidCallback onCopy;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                const Spacer(),
                IconButton(
                  tooltip: 'Copy $title',
                  icon: const Icon(Icons.content_copy, size: 20),
                  onPressed: onCopy,
                ),
              ],
            ),
            SelectableText(text, style: theme.textTheme.bodySmall?.copyWith(fontFamily: title == 'BibTeX' ? 'monospace' : null)),
          ],
        ),
      ),
    );
  }
}
