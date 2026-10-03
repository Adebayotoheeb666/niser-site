import 'package:hive/hive.dart';

/// Hive box names + registration. Mirrors the offline-cache plan (§4).
class HiveBoxes {
  HiveBoxes._();

  static const String publications = 'publications_cache';
  static const String pubDetail = 'pub_detail_cache';
  static const String researchers = 'researcher_cache';
  static const String insights = 'insights_cache';
  static const String events = 'events_cache';
  static const String news = 'news_cache';
  static const String recentSearches = 'recent_searches';
  static const String chatSessions = 'chat_sessions';
  static const String notificationsFeed = 'notifications_feed';
  static const String savedContent = 'saved_content';
  static const String settings = 'settings';
  static const String offlineFiles = 'offline_files';

  static Future<void> init() async {
    await Hive.openBox<String>(publications);
    await Hive.openBox<String>(pubDetail);
    await Hive.openBox<String>(researchers);
    await Hive.openBox<String>(insights);
    await Hive.openBox<String>(events);
    await Hive.openBox<String>(news);
    await Hive.openBox<String>(recentSearches);
    await Hive.openBox<String>(chatSessions);
    await Hive.openBox<String>(notificationsFeed);
    await Hive.openBox<String>(savedContent);
    await Hive.openBox<String>(settings);
    await Hive.openBox<String>(offlineFiles);
  }

  static Future<void> clearCache() async {
    await Hive.box(publications).clear();
    await Hive.box(pubDetail).clear();
    await Hive.box(researchers).clear();
    await Hive.box(insights).clear();
    await Hive.box(events).clear();
    await Hive.box(news).clear();
  }
}
