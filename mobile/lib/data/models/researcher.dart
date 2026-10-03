import 'enums.dart';
import 'publication.dart';

/// Mirrors `Researcher` in `types/cms.ts`.
class Researcher {
  const Researcher({
    required this.id,
    required this.fullName,
    required this.slug,
    required this.position,
    required this.division,
    required this.isActive,
    required this.status,
    this.titlePrefix,
    this.photo,
    this.biography,
    this.researchInterests,
    this.orcid,
    this.googleScholar,
    this.researchGate,
    this.email,
    this.phone,
    this.linkedin,
    this.websiteUrl,
    this.selectedPublications,
  });

  final String id;
  final String fullName;
  final String slug;
  final TitlePrefix? titlePrefix;
  final String position;
  final ResearchDivision division;
  final String? photo;
  final String? biography;
  final List<String>? researchInterests;
  final String? orcid;
  final String? googleScholar;
  final String? researchGate;
  final String? email;
  final String? phone;
  final String? linkedin;
  final String? websiteUrl;
  final List<Publication>? selectedPublications;
  final bool isActive;
  final ContentStatus status;

  String get displayName => titlePrefix == null ? fullName : '${titlePrefix!.wire} $fullName';

  factory Researcher.fromJson(Map<String, dynamic> json) {
    return Researcher(
      id: json['id'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      titlePrefix: TitlePrefix.fromWireNullable(json['titlePrefix'] as String?),
      position: json['position'] as String? ?? '',
      division: ResearchDivision.fromWire(json['division'] as String? ?? ''),
      photo: json['photo'] as String?,
      biography: json['biography'] as String?,
      researchInterests: (json['researchInterests'] as List<dynamic>?)
          ?.whereType<String>()
          .toList(),
      orcid: json['orcid'] as String?,
      googleScholar: json['googleScholar'] as String?,
      researchGate: json['researchGate'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      linkedin: json['linkedin'] as String?,
      websiteUrl: json['websiteUrl'] as String?,
      selectedPublications: (json['selectedPublications'] as List<dynamic>?)
          ?.whereType<Map<String, dynamic>>()
          .map(Publication.fromJson)
          .toList(),
      isActive: json['isActive'] as bool? ?? false,
      status: ContentStatus.fromWire(json['status'] as String?),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'slug': slug,
      'titlePrefix': titlePrefix?.wire,
      'position': position,
      'division': division.wire,
      'photo': photo,
      'biography': biography,
      'researchInterests': researchInterests,
      'orcid': orcid,
      'googleScholar': googleScholar,
      'researchGate': researchGate,
      'email': email,
      'phone': phone,
      'linkedin': linkedin,
      'websiteUrl': websiteUrl,
      'selectedPublications':
          selectedPublications?.map((p) => p.toJson()).toList(),
      'isActive': isActive,
      'status': status.wire,
    };
  }
}

List<Researcher> researchersFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(Researcher.fromJson)
      .toList();
}
