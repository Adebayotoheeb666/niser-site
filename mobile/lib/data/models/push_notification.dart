/// A received push notification, persisted locally for the in-app feed.
class PushNotification {
  const PushNotification({
    required this.id,
    required this.title,
    required this.body,
    this.type,
    this.target,
    this.url,
    required this.receivedAt,
    this.read = false,
  });

  final String id;
  final String title;
  final String body;

  /// Content type: publication | insight | event | news | rapid_response.
  final String? type;

  /// Slug or id of the linked content (used for deep links).
  final String? target;

  /// External URL fallback (rapid response briefs, etc.).
  final String? url;

  final DateTime receivedAt;
  final bool read;

  factory PushNotification.fromJson(Map<String, dynamic> json) {
    return PushNotification(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? '',
      type: json['type'] as String?,
      target: json['target'] as String?,
      url: json['url'] as String?,
      receivedAt:
          DateTime.tryParse(json['receivedAt'] as String? ?? '') ?? DateTime.now(),
      read: json['read'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'body': body,
      'type': type,
      'target': target,
      'url': url,
      'receivedAt': receivedAt.toIso8601String(),
      'read': read,
    };
  }

  PushNotification copyWith({bool? read}) {
    return PushNotification(
      id: id,
      title: title,
      body: body,
      type: type,
      target: target,
      url: url,
      receivedAt: receivedAt,
      read: read ?? this.read,
    );
  }
}
