import 'author_summary.dart';
import 'enums.dart';

/// Mirrors `CMSEvent` in `types/cms.ts`.
class CMSEvent {
  const CMSEvent({
    required this.id,
    required this.title,
    required this.slug,
    required this.eventType,
    required this.isOnline,
    required this.status,
    this.startDate,
    this.endDate,
    this.location,
    this.registrationUrl,
    this.recordingUrl,
    this.speakers,
    this.division,
    this.summary,
  });

  final String id;
  final String title;
  final String slug;
  final EventType eventType;
  final String? startDate;
  final String? endDate;
  final String? location;
  final bool isOnline;
  final String? registrationUrl;
  final String? recordingUrl;
  final List<AuthorSummary>? speakers;
  final ResearchDivision? division;
  final ContentStatus status;
  final String? summary;

  DateTime? get startDateTime =>
      startDate == null ? null : DateTime.tryParse(startDate!);

  DateTime? get endDateTime => endDate == null ? null : DateTime.tryParse(endDate!);

  factory CMSEvent.fromJson(Map<String, dynamic> json) {
    return CMSEvent(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      eventType: EventType.fromWire(json['eventType'] as String?),
      startDate: json['startDate'] as String?,
      endDate: json['endDate'] as String?,
      location: json['location'] as String?,
      isOnline: json['isOnline'] as bool? ?? false,
      registrationUrl: json['registrationUrl'] as String?,
      recordingUrl: json['recordingUrl'] as String?,
      speakers: (json['speakers'] as List<dynamic>?)
          ?.whereType<Map<String, dynamic>>()
          .map(AuthorSummary.fromJson)
          .toList(),
      division: ResearchDivision.fromWireNullable(json['division'] as String?),
      status: ContentStatus.fromWire(json['status'] as String?),
      summary: json['summary'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'eventType': eventType.wire,
      'startDate': startDate,
      'endDate': endDate,
      'location': location,
      'isOnline': isOnline,
      'registrationUrl': registrationUrl,
      'recordingUrl': recordingUrl,
      'speakers': speakers?.map((s) => s.toJson()).toList(),
      'division': division?.wire,
      'status': status.wire,
      'summary': summary,
    };
  }
}

List<CMSEvent> eventsFromJson(List<dynamic>? list) {
  if (list == null) return const [];
  return list
      .whereType<Map<String, dynamic>>()
      .map(CMSEvent.fromJson)
      .toList();
}
