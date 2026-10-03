import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// Error logging — no-op when `SENTRY_DSN` is not set at build time.
class CrashLogger {
  const CrashLogger._();

  static const String _dsn = String.fromEnvironment('SENTRY_DSN');

  static bool get enabled => !kDebugMode && _dsn.isNotEmpty;

  /// Initialises Sentry if `SENTRY_DSN` was provided via dart-define.
  static Future<void> init() async {
    if (_dsn.isEmpty) return;
    await SentryFlutter.init(
      (options) {
        options.dsn = _dsn;
        options.tracesSampleRate = 0.1;
        options.environment = kReleaseMode ? 'production' : 'development';
      },
    );
  }

  static void captureError(
    Object error, {
    StackTrace? stackTrace,
    String? context,
  }) {
    debugPrint('[NISER] error($context): $error');
    if (enabled) {
      Sentry.captureException(
        error,
        stackTrace: stackTrace,
      );
    }
    if (stackTrace != null) {
      debugPrintStack(stackTrace: stackTrace);
    }
  }

  static void captureMessage(String message) {
    debugPrint('[NISER] $message');
    if (enabled) {
      Sentry.captureMessage(message);
    }
  }
}

/// Attaches global Flutter error handlers that forward to CrashLogger.
Future<void> setupGlobalErrorHandlers() async {
  if (String.fromEnvironment('SENTRY_DSN').isEmpty) return;

  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    CrashLogger.captureError(
      details.exception,
      stackTrace: details.stack,
      context: 'flutter',
    );
  };
  PlatformDispatcher.instance.onError = (error, stackTrace) {
    CrashLogger.captureError(error, stackTrace: stackTrace);
    return true;
  };
}