import 'author_summary.dart';
import 'enums.dart';

/// Mirrors `Publication` in `types/cms.ts`.
class Publication {
  const Publication({
    required this.id,
    required this.title,
    required this.slug,
    required this.publicationType,
    required this.authors,
    required this.researchDivision,
    required this.abstract,
    required this.keywords,
    required this.publishedYear,
    required this.isOpenAccess,
    required this.status,
    this.doi,
    this.pdfFile,
    this.featuredImage,
    this.citationCount,
  });

  final String id;
  final String title;
  final String slug;
  final PublicationType publicationType;
  final List<AuthorSummary> authors;
  final ResearchDivision researchDivision;
  final String abstract;
  final List<String> keywords;
  final int publishedYear;
  final bool isOpenAccess;
  final ContentStatus status;
  final String? doi;
  final String? pdfFile;
  final String? featuredImage;
  final int? citationCount;

  factory Publication.fromJson(Map<String, dynamic> json) {
    return Publication(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      publicationType: PublicationType.fromWire(json['publicationType'] as String?),
      authors: authorSummariesFromJson(json['authors'] as List<dynamic>?),
      researchDivision:
          ResearchDivision.fromWire(json['researchDivision'] as String? ?? ''),
      abstract: json['abstract'] as String? ?? '',
      keywords: (json['keywords'] as List<dynamic>?)
              ?.whereType<String>()
              .toList() ??
          const [],
      publishedYear: json['publishedYear'] as int? ?? 0,
      doi: json['doi'] as String?,
      pdfFile: json['pdfFile'] as String?,
      featuredImage: json['featuredImage'] as String?,
      isOpenAccess: json['isOpenAccess'] as bool? ?? false,
      citationCount: json['citationCount'] as int?,
      status: ContentStatus.fromWire(json['status'] as String?),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'publicationType': publicationType.wire,
      'authors': authors.map((a) => a.toJson()).toList(),
      'researchDivision': researchDivision.wire,
      'abstract': abstract,
      'keywords': keywords,
      'publishedYear': publishedYear,
      'doi': doi,
      'pdfFile': pdfFile,
      'featuredImage': featuredImage,
      'isOpenAccess': isOpenAccess,
      'citationCount': citationCount,
      'status': status.wire,
    };
  }
}

List<Publication> publicationsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(Publication.fromJson)
      .toList();
}
