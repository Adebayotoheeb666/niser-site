import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'app.dart';
import 'core/logger/sentry.dart';
import 'core/storage/hive_boxes.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await CrashLogger.init();
  await setupGlobalErrorHandlers();

  try {
    await Hive.initFlutter();
    await HiveBoxes.init();
  } catch (error) {
    // Continue without offline cache if Hive initialisation fails.
    CrashLogger.captureError(error, context: 'hive-init');
  }

  runApp(const ProviderScope(child: NiserApp()));
}
