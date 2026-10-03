/// Mirrors the `SearchHit` shape emitted by `/api/search`.
class SearchHit {
  const SearchHit({
    required this.id,
    required this.type,
    required this.title,
    required this.excerpt,
    required this.url,
    this.division,
    this.year,
    this.extraInfo,
    this.relevanceScore,
    this.matchReason,
  });

  final String id;
  final String type; // publication | researcher | insight | event | news
  final String title;
  final String excerpt;
  final String url;
  final String? division;
  final int? year;
  final String? extraInfo;
  final double? relevanceScore;
  final String? matchReason;

  factory SearchHit.fromJson(Map<String, dynamic> json) {
    return SearchHit(
      id: json['id'] as String? ?? '',
      type: json['type'] as String? ?? 'publication',
      title: json['title'] as String? ?? '',
      excerpt: json['excerpt'] as String? ?? '',
      url: json['url'] as String? ?? '',
      division: json['division'] as String?,
      year: json['year'] as int?,
      extraInfo: json['extraInfo'] as String?,
      relevanceScore: (json['relevanceScore'] as num?)?.toDouble(),
      matchReason: json['matchReason'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'excerpt': excerpt,
      'url': url,
      'division': division,
      'year': year,
      'extraInfo': extraInfo,
      'relevanceScore': relevanceScore,
      'matchReason': matchReason,
    };
  }
}

class SearchResponse {
  const SearchResponse({
    required this.hits,
    required this.total,
    required this.page,
    required this.totalPages,
    required this.mode,
  });

  final List<SearchHit> hits;
  final int total;
  final int page;
  final int totalPages;
  final String mode;

  factory SearchResponse.fromJson(Map<String, dynamic> json) {
    return SearchResponse(
      hits: (json['hits'] as List<dynamic>?)
              ?.whereType<Map<String, dynamic>>()
              .map(SearchHit.fromJson)
              .toList() ??
          const [],
      total: json['total'] as int? ?? 0,
      page: json['page'] as int? ?? 1,
      totalPages: json['totalPages'] as int? ?? 1,
      mode: json['mode'] as String? ?? 'keyword',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hits': hits.map((h) => h.toJson()).toList(),
      'total': total,
      'page': page,
      'totalPages': totalPages,
      'mode': mode,
    };
  }
}
