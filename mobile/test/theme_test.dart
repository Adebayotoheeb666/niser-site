import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:niser_mobile/core/storage/hive_boxes.dart';
import 'package:niser_mobile/data/repositories/theme_prefs.dart';

import 'helpers/fakes.dart';

void main() {
  setUpAll(() async {
    final tmp = await Directory.systemTemp.createTemp('niser_theme_test');
    Hive.init(tmp.path);
    await Hive.openBox<String>(HiveBoxes.settings);
    await Hive.openBox<String>(HiveBoxes.savedContent);
  });

  Future<void> openSettings(WidgetTester tester) async {
    await pumpApp(tester, overrides: const []);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Settings').first);
    await tester.pumpAndSettle();

    expect(find.text('Appearance'), findsOneWidget);
  }

  testWidgets('defaults to system theme mode', (tester) async {
    await pumpApp(tester, overrides: const []);

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.system);
    expect(app.darkTheme, isNotNull);
  });

  testWidgets('selecting Dark applies the dark theme immediately',
      (tester) async {
    await openSettings(tester);

    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.dark);

    final context = tester.element(find.byType(Scaffold).first);
    expect(Theme.of(context).brightness, Brightness.dark);
    expect(
      Theme.of(context).scaffoldBackgroundColor,
      const Color(0xFF111511),
    );
  });

  testWidgets('selection persists across restarts', (tester) async {
    await openSettings(tester);
    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();

    // Simulate an app restart with the same Hive storage.
    await pumpApp(tester, overrides: const []);

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.dark);
  });

  testWidgets('selecting Light restores the light theme', (tester) async {
    await openSettings(tester);

    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Light'));
    await tester.pumpAndSettle();

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.light);

    final context = tester.element(find.byType(Scaffold).first);
    expect(Theme.of(context).brightness, Brightness.light);
  });

  testWidgets('System chip resets to following the platform', (tester) async {
    await openSettings(tester);

    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('System'));
    await tester.pumpAndSettle();

    expect(Hive.box<String>(HiveBoxes.settings).get(ThemePrefs.boxKey),
        'system');
    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.system);
  });
}
