import 'author_summary.dart';
import 'brief_document.dart';
import 'enums.dart';

/// Mirrors `Insight` in `types/cms.ts`.
class Insight {
  const Insight({
    required this.id,
    required this.title,
    required this.slug,
    required this.contentType,
    required this.status,
    this.author,
    this.publishedDate,
    this.body,
    this.bodyPlaintext,
    this.excerpt,
    this.socialSummary,
    this.featuredImage,
    this.pdfFile,
    this.documents,
    this.tags,
    this.isBreaking,
    this.aiGenerated,
  });

  final String id;
  final String title;
  final String slug;
  final InsightContentType contentType;
  final AuthorSummary? author;
  final String? publishedDate;
  final String? body;
  final String? bodyPlaintext;
  final String? excerpt;
  final String? socialSummary;
  final String? featuredImage;
  final String? pdfFile;
  final List<BriefDocument>? documents;
  final List<String>? tags;
  final bool? isBreaking;
  final bool? aiGenerated;
  final ContentStatus status;

  DateTime? get publishedDateTime =>
      publishedDate == null ? null : DateTime.tryParse(publishedDate!);

  factory Insight.fromJson(Map<String, dynamic> json) {
    return Insight(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      contentType: InsightContentType.fromWire(json['contentType'] as String?),
      author: json['author'] is Map<String, dynamic>
          ? AuthorSummary.fromJson(json['author'] as Map<String, dynamic>)
          : null,
      publishedDate: json['publishedDate'] as String?,
      body: json['body'] as String?,
      bodyPlaintext: json['bodyPlaintext'] as String?,
      excerpt: json['excerpt'] as String?,
      socialSummary: json['socialSummary'] as String?,
      featuredImage: json['featuredImage'] as String?,
      pdfFile: json['pdfFile'] as String?,
      documents: (json['documents'] as List<dynamic>?)
          ?.whereType<Map<String, dynamic>>()
          .map(BriefDocument.fromJson)
          .toList(),
      tags: (json['tags'] as List<dynamic>?)?.whereType<String>().toList(),
      isBreaking: json['isBreaking'] as bool?,
      aiGenerated: json['aiGenerated'] as bool?,
      status: ContentStatus.fromWire(json['status'] as String?),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'contentType': contentType.wire,
      'author': author?.toJson(),
      'publishedDate': publishedDate,
      'body': body,
      'bodyPlaintext': bodyPlaintext,
      'excerpt': excerpt,
      'socialSummary': socialSummary,
      'featuredImage': featuredImage,
      'pdfFile': pdfFile,
      'documents': documents?.map((d) => d.toJson()).toList(),
      'tags': tags,
      'isBreaking': isBreaking,
      'aiGenerated': aiGenerated,
      'status': status.wire,
    };
  }
}

List<Insight> insightsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(Insight.fromJson)
      .toList();
}
