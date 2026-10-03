import '../../data/models/publication.dart';

/// Generates citations in APA, BibTeX and Chicago styles and a shareable
/// plain-text summary. Mirrors the web `CitationExport` component.
abstract class CitationBuilder {
  static String apa(Publication p) {
    final authors = p.authors.map((a) => a.displayName).join(', ');
    final year = p.publishedYear > 0 ? ' (${p.publishedYear}).' : '';
    final title = p.title.endsWith('.') ? p.title : '${p.title}.';
    final doi = p.doi != null && p.doi!.isNotEmpty
        ? ' https://doi.org/${p.doi!.replaceAll(RegExp(r'^https?://doi.org/'), '')}'
        : '';
    return '$authors$year $title NISER, Nigeria.$doi';
  }

  static String chicago(Publication p) {
    final authors = p.authors.map((a) => a.displayName).join(', ');
    final year = p.publishedYear > 0 ? ' ${p.publishedYear}.' : '';
    final doi = p.doi != null && p.doi!.isNotEmpty
        ? ' doi:${p.doi!.replaceAll(RegExp(r'^https?://doi.org/'), '')}.'
        : '';
    return '$authors. "$year ${p.title}." NISER.$doi';
  }

  static String bibtex(Publication p) {
    final key = _bibtexKey(p);
    final authors = p.authors.map((a) => a.displayName).join(' and ');
    final year = p.publishedYear > 0 ? p.publishedYear.toString() : 'n.d.';
    final url = p.pdfFile ?? '';
    return '''@techreport{$key,
  author = {$authors},
  title = {${_escapeBibtex(p.title)}},
  institution = {Nigerian Institute of Social and Economic Research},
  year = {$year},
  type = {${p.publicationType.wire}},
  url = {$url},
  doi = {${p.doi ?? ''}},
}''';
  }

  static String shareText(Publication p, {String? url}) {
    final link = url ?? 'https://niser.gov.ng/publications/${p.slug}';
    return '${p.title}\n${apa(p)}\n$link';
  }

  static String _bibtexKey(Publication p) {
    final first = p.authors.isNotEmpty
        ? p.authors.first.fullName.split(' ').last.toLowerCase()
        : 'niser';
    final year = p.publishedYear > 0 ? p.publishedYear.toString() : 'nd';
    final slug = p.slug.replaceAll(RegExp(r'[^a-z0-9]'), '').substring(0, p.slug.length.clamp(0, 12));
    return '${first}_${year}_$slug';
  }

  static String _escapeBibtex(String s) => s.replaceAll('{', r'\{').replaceAll('}', r'\}');
}
