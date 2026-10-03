/// Mirrors `Dataset` and `DatasetResource` in `types/cms.ts`.
class DatasetResource {
  const DatasetResource({
    required this.id,
    required this.name,
    required this.format,
    required this.url,
    this.size,
    this.description,
  });

  final String id;
  final String name;
  final String format;
  final String url;
  final String? size;
  final String? description;

  factory DatasetResource.fromJson(Map<String, dynamic> json) {
    return DatasetResource(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      format: json['format'] as String? ?? 'CSV',
      url: json['url'] as String? ?? '',
      size: json['size'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'format': format,
      'url': url,
      'size': size,
      'description': description,
    };
  }
}

class DatasetOrganization {
  const DatasetOrganization({
    required this.name,
    required this.title,
    this.description,
  });

  final String name;
  final String title;
  final String? description;

  factory DatasetOrganization.fromJson(Map<String, dynamic> json) {
    return DatasetOrganization(
      name: json['name'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'title': title,
      'description': description,
    };
  }
}

class Dataset {
  const Dataset({
    required this.id,
    required this.title,
    required this.notes,
    required this.author,
    required this.tags,
    required this.resources,
    required this.organization,
    this.metadataCreated,
    this.metadataModified,
    this.maintainer,
    this.licenseTitle,
    this.rowsCount,
  });

  final String id;
  final String title;
  final String notes;
  final String author;
  final List<String> tags;
  final List<DatasetResource> resources;
  final DatasetOrganization organization;
  final String? metadataCreated;
  final String? metadataModified;
  final String? maintainer;
  final String? licenseTitle;
  final int? rowsCount;

  factory Dataset.fromJson(Map<String, dynamic> json) {
    return Dataset(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      notes: json['notes'] as String? ?? '',
      author: json['author'] as String? ?? '',
      tags: (json['tags'] as List<dynamic>?)
              ?.whereType<String>()
              .toList() ??
          const [],
      resources: (json['resources'] as List<dynamic>?)
              ?.whereType<Map<String, dynamic>>()
              .map(DatasetResource.fromJson)
              .toList() ??
          const [],
      organization: json['organization'] is Map<String, dynamic>
          ? DatasetOrganization.fromJson(json['organization'] as Map<String, dynamic>)
          : const DatasetOrganization(name: '', title: ''),
      metadataCreated: json['metadataCreated'] as String?,
      metadataModified: json['metadataModified'] as String?,
      maintainer: json['maintainer'] as String?,
      licenseTitle: json['licenseTitle'] as String?,
      rowsCount: json['rowsCount'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'notes': notes,
      'author': author,
      'tags': tags,
      'resources': resources.map((r) => r.toJson()).toList(),
      'organization': organization.toJson(),
      'metadataCreated': metadataCreated,
      'metadataModified': metadataModified,
      'maintainer': maintainer,
      'licenseTitle': licenseTitle,
      'rowsCount': rowsCount,
    };
  }
}

List<Dataset> datasetsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(Dataset.fromJson)
      .toList();
}
