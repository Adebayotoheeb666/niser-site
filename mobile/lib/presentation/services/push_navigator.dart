import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../widgets/app_launcher.dart';

/// Maps push-notification payloads to in-app routes.
///
/// The router is attached once the app shell exists; payloads received
/// while the app is terminated are buffered and flushed on attach.
class PushNavigator {
  GoRouter? _router;
  Map<String, String>? _pending;

  /// True while a deep-link payload awaits an attached router.
  bool get hasPending => _pending != null;

  void attach(GoRouter router) {
    _router = router;
    final pending = _pending;
    _pending = null;
    if (pending != null) navigate(pending);
  }

  /// Stores a payload for a terminated/background launch until a router is ready.
  void buffer(Map<String, String> data) {
    if (_router == null) {
      _pending = data;
    } else {
      navigate(data);
    }
  }

  String? routeFor(Map<String, String> data) {
    final type = data['type'] ?? data['contentType'];
    final slug = data['slug'] ?? data['id'];
    switch (type) {
      case 'publication':
        return slug != null ? '/publications/$slug' : '/publications';
      case 'insight':
        return slug != null ? '/insights/$slug' : '/insights';
      case 'event':
        return slug != null ? '/events/$slug' : '/events';
      case 'news':
        return slug != null ? '/news/$slug' : '/news';
      case 'rapid_response':
        final url = data['url'];
        if (url != null && url.isNotEmpty) return null;
        return '/news';
      default:
        return '/home';
    }
  }

  void navigate(Map<String, String> data) {
    final router = _router;
    if (router == null) {
      _pending = data;
      return;
    }
    if (data['type'] == 'rapid_response') {
      final url = data['url'];
      if (url != null && url.isNotEmpty) {
        AppLauncher.openWeb(url);
        return;
      }
    }
    final path = routeFor(data);
    if (path != null) {
      router.go(path);
    }
  }
}

final pushNavigatorProvider = Provider<PushNavigator>((ref) => PushNavigator());
