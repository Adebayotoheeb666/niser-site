import 'enums.dart';

/// Mirrors `NewsItem` in `types/cms.ts`.
class NewsItem {
  const NewsItem({
    required this.id,
    required this.title,
    required this.slug,
    required this.category,
    required this.status,
    this.body,
    this.summary,
    this.publishedDate,
    this.externalUrl,
    this.featuredImage,
  });

  final String id;
  final String title;
  final String slug;
  final String? body;
  final String? summary;
  final String? publishedDate;
  final NewsCategory category;
  final String? externalUrl;
  final String? featuredImage;
  final ContentStatus status;

  DateTime? get publishedDateTime =>
      publishedDate == null ? null : DateTime.tryParse(publishedDate!);

  factory NewsItem.fromJson(Map<String, dynamic> json) {
    return NewsItem(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      body: json['body'] as String?,
      summary: json['summary'] as String?,
      publishedDate: json['publishedDate'] as String?,
      category: NewsCategory.fromWire(json['category'] as String? ?? ''),
      externalUrl: json['externalUrl'] as String?,
      featuredImage: json['featuredImage'] as String?,
      status: ContentStatus.fromWire(json['status'] as String?),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'body': body,
      'summary': summary,
      'publishedDate': publishedDate,
      'category': category.wire,
      'externalUrl': externalUrl,
      'featuredImage': featuredImage,
      'status': status.wire,
    };
  }
}

List<NewsItem> newsItemsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(NewsItem.fromJson)
      .toList();
}
