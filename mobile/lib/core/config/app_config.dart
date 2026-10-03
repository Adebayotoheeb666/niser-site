import 'package:flutter/foundation.dart';

/// App configuration driven by `--dart-define=API_BASE_URL=...`.
///
/// Never hardcode environment-specific URLs. The API base URL is public
/// (read-only API) so it is safe to embed at build time.
class AppConfig {
  AppConfig._();

  static const String _envApiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: '',
  );

  static const String _envAppEnv = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'dev',
  );

  /// Android emulator reaches the host via 10.0.2.2; iOS simulator via localhost.
  static const String _devApiBaseUrl = 'http://10.0.2.2:3000';

  static const String stagingApiBaseUrl = 'https://staging.niser.gov.ng';
  static const String prodApiBaseUrl = 'https://www.niser.gov.ng';

  static String get apiBaseUrl {
    if (_envApiBaseUrl.isNotEmpty) {
      return _envApiBaseUrl;
    }
    switch (appEnv) {
      case 'staging':
        return stagingApiBaseUrl;
      case 'prod':
        return prodApiBaseUrl;
      default:
        return _devApiBaseUrl;
    }
  }

  static String get appEnv {
    if (kReleaseMode) return 'prod';
    if (_envAppEnv.isNotEmpty) return _envAppEnv;
    return 'dev';
  }

  static String get appName => 'NISER';

  static String get appVersion => '0.1.0';

  static String get privacyPolicyUrl =>
      '$_safeWebBase/privacy-policy';

  static String get _safeWebBase {
    if (_envApiBaseUrl.isNotEmpty) return _envApiBaseUrl;
    switch (appEnv) {
      case 'staging':
        return stagingApiBaseUrl;
      case 'prod':
        return prodApiBaseUrl;
      default:
        return 'http://10.0.2.2:3000';
    }
  }
}
