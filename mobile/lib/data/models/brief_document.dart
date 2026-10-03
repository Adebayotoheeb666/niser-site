/// Mirrors `BriefDocument` in `types/cms.ts`.
class BriefDocument {
  const BriefDocument({
    required this.id,
    required this.title,
    required this.url,
    required this.fileType,
    this.fileSize,
    this.description,
  });

  final String id;
  final String title;
  final String url;
  final String fileType;
  final String? fileSize;
  final String? description;

  factory BriefDocument.fromJson(Map<String, dynamic> json) {
    return BriefDocument(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      url: json['url'] as String? ?? '',
      fileType: json['fileType'] as String? ?? '',
      fileSize: json['fileSize'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'url': url,
      'fileType': fileType,
      'fileSize': fileSize,
      'description': description,
    };
  }
}

List<BriefDocument> briefDocumentsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(BriefDocument.fromJson)
      .toList();
}
