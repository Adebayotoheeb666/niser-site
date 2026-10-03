/// Mirrors the item shape emitted by GET /api/recommendations.
class Recommendation {
  const Recommendation({
    required this.id,
    required this.title,
    required this.type,
    this.slug,
    this.url,
    this.excerpt,
    this.score,
  });

  final String id;
  final String title;
  final String type; // publication | insight | event | news
  final String? slug;
  final String? url;
  final String? excerpt;
  final double? score;

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      type: json['type'] as String? ?? 'publication',
      slug: json['slug'] as String?,
      url: json['url'] as String?,
      excerpt: json['excerpt'] as String?,
      score: (json['score'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'type': type,
        'slug': slug,
        'url': url,
        'excerpt': excerpt,
        'score': score,
      };

  /// Route path inside the app for deep-linking to the matching detail screen.
  String get routePath {
    switch (type) {
      case 'publication':
        return '/publications/$slug';
      case 'insight':
        return '/insights/$slug';
      case 'event':
        return '/events/$slug';
      case 'news':
        return '/news/$slug';
      default:
        return url ?? '/';
    }
  }
}
