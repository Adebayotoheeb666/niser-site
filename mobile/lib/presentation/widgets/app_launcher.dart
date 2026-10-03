import 'package:url_launcher/url_launcher.dart';

/// URL launching helpers used across detail screens.
abstract class AppLauncher {
  static Future<bool> open(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return false;
    try {
      final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
      return ok;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> openWeb(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return false;
    try {
      final ok = await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
      return ok;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> mail(String address, {String? subject, String? body}) async {
    final uri = Uri(
      scheme: 'mailto',
      path: address,
      queryParameters: {
        if (subject != null) 'subject': subject,
        if (body != null) 'body': body,
      },
    );
    try {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      return false;
    }
  }

  static Future<bool> call(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    try {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      return false;
    }
  }

  static String? normalizeUrl(String? url) {
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://$url';
  }
}
