/// Mirrors `AuthorSummary` in `types/cms.ts`.
class AuthorSummary {
  const AuthorSummary({
    required this.id,
    required this.fullName,
    required this.slug,
    this.titlePrefix,
    this.position,
    this.photo,
  });

  final String id;
  final String fullName;
  final String slug;
  final String? titlePrefix;
  final String? position;
  final String? photo;

  String get displayName =>
      (titlePrefix == null || titlePrefix!.isEmpty) ? fullName : '$titlePrefix $fullName';

  factory AuthorSummary.fromJson(Map<String, dynamic> json) {
    return AuthorSummary(
      id: json['id'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      titlePrefix: json['titlePrefix'] as String?,
      position: json['position'] as String?,
      photo: json['photo'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'slug': slug,
      'titlePrefix': titlePrefix,
      'position': position,
      'photo': photo,
    };
  }
}

List<AuthorSummary> authorSummariesFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(AuthorSummary.fromJson)
      .toList();
}
