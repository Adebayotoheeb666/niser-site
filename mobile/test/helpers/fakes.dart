import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/app.dart';
import 'package:niser_mobile/core/storage/secure_store.dart';
import 'package:niser_mobile/data/cache/json_cache.dart';
import 'package:niser_mobile/data/models/cms_event.dart';
import 'package:niser_mobile/data/models/dataset.dart';
import 'package:niser_mobile/data/models/enums.dart';
import 'package:niser_mobile/data/models/insight.dart';
import 'package:niser_mobile/data/models/news_item.dart';
import 'package:niser_mobile/data/models/publication.dart';
import 'package:niser_mobile/data/models/push_notification.dart';
import 'package:niser_mobile/data/models/researcher.dart';
import 'package:niser_mobile/data/models/search_hit.dart';
import 'package:niser_mobile/data/repositories/chatbot_repository.dart';
import 'package:niser_mobile/data/repositories/contact_repository.dart';
import 'package:niser_mobile/data/repositories/dataset_repository.dart';
import 'package:niser_mobile/data/repositories/event_repository.dart';
import 'package:niser_mobile/data/repositories/insight_repository.dart';
import 'package:niser_mobile/data/repositories/news_repository.dart';
import 'package:niser_mobile/data/repositories/notification_repository.dart';
import 'package:niser_mobile/data/repositories/publication_repository.dart';
import 'package:niser_mobile/data/repositories/researcher_repository.dart';
import 'package:niser_mobile/data/repositories/search_repository.dart';
import 'package:niser_mobile/data/repositories/subscription_repository.dart';
import 'package:niser_mobile/data/repositories/translate_repository.dart';
import 'package:niser_mobile/data/services/chat_sse_client.dart';
import 'package:niser_mobile/data/services/fcm_service.dart';
import 'package:niser_mobile/presentation/services/push_navigator.dart';

/// Sample JSON payloads mirroring the backend BFF responses.
Map<String, dynamic> publicationJson({
  String slug = 'macro-growth',
  String title = 'Growth and Inflation in Nigeria',
  int year = 2024,
  bool openAccess = true,
}) {
  return {
    'id': slug,
    'title': title,
    'slug': slug,
    'publicationType': 'working_paper',
    'authors': [
      {'id': 'a1', 'fullName': 'Ada Obi', 'slug': 'ada-obi', 'titlePrefix': 'Dr'},
    ],
    'researchDivision': 'macroeconomics',
    'abstract': 'An abstract about the Nigerian economy.',
    'keywords': ['growth', 'inflation'],
    'publishedYear': year,
    'doi': '10.1234/example',
    'isOpenAccess': openAccess,
    'pdfFile': 'https://example.com/pub.pdf',
    'status': 'published',
  };
}

Map<String, dynamic> researcherJson({
  String slug = 'ada-obi',
  String position = 'Research Fellow',
  String? fullName,
}) {
  return {
    'id': slug,
    'fullName': fullName ?? 'Ada Obi',
    'slug': slug,
    'titlePrefix': 'Dr',
    'position': position,
    'division': 'macroeconomics',
    'biography': 'Economist specialising in monetary policy.',
    'researchInterests': ['Inflation', 'Fiscal policy'],
    'email': 'a.obi@niser.gov.ng',
    'phone': '+2348000000000',
    'orcid': '0000-0001-2345-6789',
    'isActive': true,
    'status': 'published',
  };
}

Map<String, dynamic> insightJson({
  String slug = 'cbn-rates',
  String title = 'What Higher Rates Mean for Growth',
}) {
  return {
    'id': slug,
    'title': title,
    'slug': slug,
    'contentType': 'analysis',
    'author': {
      'id': 'a1',
      'fullName': 'Ada Obi',
      'slug': 'ada-obi',
      'titlePrefix': 'Dr',
    },
    'publishedDate': '2024-06-01T00:00:00Z',
    'excerpt': 'A short excerpt.',
    'bodyPlaintext': 'The full plaintext body of the insight.',
    'tags': ['monetary', 'growth'],
    'status': 'published',
  };
}

Map<String, dynamic> eventJson({
  String slug = 'annual-conference',
  String title = 'Annual Research Conference',
  bool upcoming = true,
}) {
  final start = upcoming ? '2026-09-10T09:00:00Z' : '2024-03-01T09:00:00Z';
  return {
    'id': slug,
    'title': title,
    'slug': slug,
    'eventType': 'conference',
    'startDate': start,
    'endDate': '2026-09-12T17:00:00Z',
    'location': 'Ibadan, Nigeria',
    'isOnline': false,
    'registrationUrl': 'https://example.com/register',
    'summary': 'The institute annual conference.',
    'status': 'published',
  };
}

Map<String, dynamic> newsJson({
  String slug = 'news-1',
  String title = 'NISER Releases 2024 Annual Report',
}) {
  return {
    'id': slug,
    'title': title,
    'slug': slug,
    'category': 'institutional',
    'publishedDate': '2024-05-20T00:00:00Z',
    'summary': 'A short news summary.',
    'body': 'The full body text.',
    'status': 'published',
  };
}

Map<String, dynamic> datasetJson({
  String id = 'd1',
  String title = 'National Accounts 2023',
}) {
  return {
    'id': id,
    'title': title,
    'notes': 'Quarterly national accounts.',
    'author': 'NISER',
    'tags': ['GDP', 'macro'],
    'rowsCount': 1200,
    'organization': {'name': 'niser', 'title': 'NISER'},
    'metadataModified': '2024-01-15T00:00:00Z',
    'resources': [
      {
        'id': 'r1',
        'name': 'accounts.csv',
        'format': 'CSV',
        'url': 'https://example.com/accounts.csv',
        'size': '1.2 MB',
      },
    ],
    'status': 'published',
  };
}

/// Fakes replacing the repositories so tests never touch Hive or the network.
class FakePublicationRepository implements PublicationRepository {
  FakePublicationRepository({List<Publication>? items})
      : items = items ?? [Publication.fromJson(publicationJson())];

  List<Publication> items;

  @override
  Future<CachedResult<List<Publication>>> list({
    String? query,
    PublicationType? type,
    ResearchDivision? division,
    int? year,
    int page = 1,
    int limit = 20,
  }) async {
    var filtered = items;
    if (type != null) filtered = filtered.where((p) => p.publicationType == type).toList();
    if (division != null) filtered = filtered.where((p) => p.researchDivision == division).toList();
    if (year != null) filtered = filtered.where((p) => p.publishedYear == year).toList();
    if (query != null && query.isNotEmpty) {
      filtered = filtered.where((p) => p.title.toLowerCase().contains(query.toLowerCase())).toList();
    }
    return CachedResult(filtered);
  }

  @override
  Future<CachedResult<Publication?>> bySlug(String slug) async {
    for (final p in items) {
      if (p.slug == slug) return CachedResult(p);
    }
    return const CachedResult(null);
  }
}

class FakeNewsRepository implements NewsRepository {
  FakeNewsRepository({List<NewsItem>? items})
      : items = items ?? [NewsItem.fromJson(newsJson())];

  List<NewsItem> items;

  @override
  Future<CachedResult<List<NewsItem>>> list({
    NewsCategory? category,
    String? query,
    int page = 1,
    int limit = 20,
  }) async {
    var filtered = items;
    if (category != null) filtered = filtered.where((n) => n.category == category).toList();
    final start = (page - 1) * limit;
    final pageItems = start >= filtered.length
        ? <NewsItem>[]
        : filtered.skip(start).take(limit).toList();
    return CachedResult(pageItems);
  }

  @override
  Future<CachedResult<NewsItem?>> bySlug(String slug) async {
    for (final n in items) {
      if (n.slug == slug) return CachedResult(n);
    }
    return const CachedResult(null);
  }
}

class FakeEventRepository implements EventRepository {
  FakeEventRepository({List<CMSEvent>? items})
      : items = items ?? [CMSEvent.fromJson(eventJson())];

  List<CMSEvent> items;

  @override
  Future<CachedResult<List<CMSEvent>>> list({
    EventScope scope = EventScope.all,
    EventType? type,
    int page = 1,
    int limit = 20,
  }) async {
    var filtered = items;
    if (scope == EventScope.upcoming) {
      filtered = filtered.where((e) => (e.startDateTime ?? DateTime(2100)).isAfter(DateTime.now())).toList();
    } else if (scope == EventScope.past) {
      filtered = filtered.where((e) => (e.startDateTime ?? DateTime(1900)).isBefore(DateTime.now())).toList();
    }
    final start = (page - 1) * limit;
    final pageItems = start >= filtered.length
        ? <CMSEvent>[]
        : filtered.skip(start).take(limit).toList();
    return CachedResult(pageItems);
  }

  @override
  Future<CachedResult<CMSEvent?>> bySlug(String slug) async {
    for (final e in items) {
      if (e.slug == slug) return CachedResult(e);
    }
    return const CachedResult(null);
  }
}

class FakeInsightRepository implements InsightRepository {
  FakeInsightRepository({List<Insight>? items})
      : items = items ?? [Insight.fromJson(insightJson())];

  List<Insight> items;

  @override
  Future<CachedResult<List<Insight>>> list({
    InsightContentType? contentType,
    String? query,
    int page = 1,
    int limit = 20,
  }) async {
    var filtered = items;
    if (contentType != null) {
      filtered = filtered.where((i) => i.contentType == contentType).toList();
    }
    final start = (page - 1) * limit;
    final pageItems = start >= filtered.length
        ? <Insight>[]
        : filtered.skip(start).take(limit).toList();
    return CachedResult(pageItems);
  }

  @override
  Future<CachedResult<Insight?>> bySlug(String slug) async {
    for (final i in items) {
      if (i.slug == slug) return CachedResult(i);
    }
    return const CachedResult(null);
  }
}

class FakeResearcherRepository implements ResearcherRepository {
  FakeResearcherRepository({List<Researcher>? items})
      : items = items ?? [Researcher.fromJson(researcherJson())];

  List<Researcher> items;

  @override
  Future<CachedResult<List<Researcher>>> list({
    String? query,
    ResearchDivision? division,
    int page = 1,
    int limit = 20,
  }) async {
    var filtered = items;
    if (division != null) filtered = filtered.where((r) => r.division == division).toList();
    if (query != null && query.isNotEmpty) {
      filtered = filtered.where((r) => r.fullName.toLowerCase().contains(query.toLowerCase())).toList();
    }
    final start = (page - 1) * limit;
    final paged = start >= filtered.length ? <Researcher>[] : filtered.skip(start).take(limit).toList();
    return CachedResult(paged);
  }

  @override
  Future<CachedResult<Researcher?>> bySlug(String slug) async {
    for (final r in items) {
      if (r.slug == slug) return CachedResult(r);
    }
    return const CachedResult(null);
  }
}

class FakeSearchRepository implements SearchRepository {
  FakeSearchRepository({List<SearchHit>? hits}) : hits = hits ?? [];

  List<SearchHit> hits;
  final List<String> recent = [];

  @override
  Future<SearchResponse> search({
    required String query,
    String mode = 'keyword',
    String type = 'all',
    String division = 'all',
    String year = 'all',
    int page = 1,
    int limit = 20,
    CancelToken? cancelToken,
  }) async {
    final filtered = type == 'all'
        ? hits
        : hits.where((h) => h.type == type).toList();
    return SearchResponse(
      hits: filtered,
      total: filtered.length,
      page: 1,
      totalPages: 1,
      mode: mode,
    );
  }

  @override
  Future<List<String>> recentQueries() async => recent.reversed.take(20).toList();

  @override
  Future<void> persistQuery(String query) async {
    recent.remove(query);
    recent.add(query);
    while (recent.length > 20) {
      recent.removeAt(0);
    }
  }

  @override
  Future<void> clearRecentQueries() async {
    recent.clear();
  }
}

class FakeDatasetRepository implements DatasetRepository {
  FakeDatasetRepository({List<Dataset>? items})
      : items = items ?? [Dataset.fromJson(datasetJson())];

  List<Dataset> items;

  @override
  Future<List<Dataset>> list() async => List.of(items);

  @override
  Future<Dataset> byId(String id) async {
    return items.firstWhere((d) => d.id == id, orElse: () => items.first);
  }
}

class FakeSubscriptionRepository implements SubscriptionRepository {
  String? subscribedEmail;
  bool fail = false;

  @override
  Future<void> subscribe({required String email, String? name}) async {
    if (fail) throw Exception('network');
    subscribedEmail = email;
  }
}

class FakeContactRepository implements ContactRepository {
  int submitCount = 0;
  bool fail = false;

  @override
  Future<void> submit({
    required String firstName,
    required String lastName,
    required String email,
    required String subject,
    required String message,
    String? organization,
  }) async {
    if (fail) throw Exception('network');
    submitCount++;
  }
}

class FakeTranslateRepository implements TranslateRepository {
  String? lastText;
  String? lastTargetLang;

  @override
  Future<TranslationResult> translate({
    required String text,
    required String targetLang,
  }) async {
    lastText = text;
    lastTargetLang = targetLang;
    return TranslationResult(
      translatedText: 'Eto iṣẹ ti o ga',
      sourceLanguage: 'en',
      targetLanguage: targetLang,
      qualityScore: 0.95,
    );
  }
}

class FakeChatbotRepository implements ChatbotRepository {
  FakeChatbotRepository({List<Map<String, dynamic>>? historyEntries})
      : historyEntries = historyEntries ?? [];

  List<Map<String, dynamic>> historyEntries;
  List<Map<String, String>>? lastHistory;
  String? lastMessage;
  bool cleared = false;

  @override
  Future<void> init() async {}

  @override
  Stream<ChatStreamEvent> sendMessage({
    required String message,
    List<Map<String, String>> history = const [],
    String? fingerprint,
  }) async* {
    lastMessage = message;
    lastHistory = history;
    yield const ChatStreamEvent(token: 'Here is');
    yield const ChatStreamEvent(token: ' your answer.');
    yield const ChatStreamEvent(
      event: 'sources',
      sources: [
        {'title': 'NISER Working Paper 1', 'url': 'https://example.com/1'},
      ],
    );
    yield const ChatStreamEvent(event: 'done');
  }

  @override
  Future<List<Map<String, dynamic>>> history() async => historyEntries;

  @override
  Future<void> clearHistory() async {
    cleared = true;
    historyEntries = [];
  }
}

class FakeNotificationRepository implements NotificationRepository {
  FakeNotificationRepository({List<PushNotification>? items})
      : items = items ?? [];

  List<PushNotification> items;
  String? registeredToken;
  String? registeredPlatform;
  List<String>? registeredTopics;
  String? unregisteredToken;

  @override
  Future<void> register({
    required String token,
    required String platform,
    List<String> topics = const [],
  }) async {
    registeredToken = token;
    registeredPlatform = platform;
    registeredTopics = topics;
  }

  @override
  Future<void> unregister(String token) async {
    unregisteredToken = token;
  }

  @override
  Future<void> addToFeed(PushNotification notification) async {
    items.removeWhere((n) => n.id == notification.id);
    items.add(notification);
  }

  @override
  Future<List<PushNotification>> feed() async =>
      items.reversed.toList();

  @override
  Future<void> markRead(String id) async {
    items = [
      for (final n in items)
        if (n.id == id) n.copyWith(read: true) else n,
    ];
  }

  @override
  Future<void> markAllRead() async {
    items = [for (final n in items) n.copyWith(read: true)];
  }

  @override
  Future<void> clearFeed() async {
    items = [];
  }
}

class FakeFcmService extends FcmService {
  FakeFcmService({
    required super.store,
    required super.repo,
  });

  @override
  bool get isConfigured => true;

  @override
  Future<void> init({required PushNavigator navigator}) async {
    // No-op: never touch the Firebase platform channel in tests.
  }

  List<String>? syncedTopics;
  List<String>? unsubscribedTopics;
  bool permissionGranted = true;
  List<String> storedTopics = const [];

  @override
  Future<List<String>> currentTopics() async =>
      storedTopics.isNotEmpty ? storedTopics : const ['niser_publications', 'niser_insights'];

  @override
  Future<bool> requestPermission() async => permissionGranted;

  @override
  Future<void> syncTopicsAndToken({required List<String> topics}) async {
    syncedTopics = topics;
    storedTopics = topics;
  }

  @override
  Future<void> unsubscribeAll({required List<String> topics}) async {
    unsubscribedTopics = topics;
    storedTopics = const [];
  }
}

/// In-memory [SecureStore] so tests avoid the platform plugin channel.
class FakeSecureStore extends SecureStore {
  FakeSecureStore() : super(storage: _NullStorage());

  final Map<String, String> values = {};

  @override
  Future<String?> read(String key) async => values[key];

  @override
  Future<void> write(String key, String value) async => values[key] = value;

  @override
  Future<void> delete(String key) async => values.remove(key);

  @override
  Future<String?> readChatSessionId() async => values['chat_session_id'];

  @override
  Future<void> writeChatSessionId(String value) async =>
      values['chat_session_id'] = value;

  @override
  Future<String?> readChatVisitorId() async => values['chat_visitor_id'];

  @override
  Future<void> writeChatVisitorId(String value) async =>
      values['chat_visitor_id'] = value;

  @override
  Future<String?> readChatFingerprint() async => values['chat_fingerprint'];

  @override
  Future<void> writeChatFingerprint(String value) async =>
      values['chat_fingerprint'] = value;

  @override
  Future<List<String>?> readNotificationTopics() async {
    final raw = values['notification_topics'];
    if (raw == null || raw.isEmpty) return null;
    return raw.split(',').where((t) => t.isNotEmpty).toList();
  }

  @override
  Future<void> writeNotificationTopics(List<String> topics) async =>
      values['notification_topics'] = topics.join(',');

  @override
  Future<bool> readNotificationsEnabled() async =>
      values['notifications_enabled'] == 'true';

  @override
  Future<void> writeNotificationsEnabled(bool enabled) async =>
      values['notifications_enabled'] = '$enabled';

  @override
  Future<void> clear() async => values.clear();
}

class _NullStorage extends FlutterSecureStorage {
  const _NullStorage();
}

/// Builds the full app with repository overrides.
Future<void> pumpApp(
  WidgetTester tester, {
  List<Override> overrides = const [],
}) async {
  tester.view.physicalSize = const Size(800, 1600);
  tester.view.devicePixelRatio = 1.0;
  addTearDown(tester.view.reset);

  await tester.pumpWidget(
    ProviderScope(overrides: overrides, child: const NiserApp()),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 50));
}