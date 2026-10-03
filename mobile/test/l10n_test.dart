import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/repositories/language_prefs.dart';

import 'helpers/fakes.dart';

void main() {
  testWidgets('interface defaults to English', (tester) async {
    await pumpApp(tester, overrides: const []);

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Ask NISER'), findsOneWidget);
    expect(find.text('More'), findsOneWidget);
  });

  testWidgets('selecting Yorùbá localises navigation and titles',
      (tester) async {
    await pumpApp(tester, overrides: [
      contentLanguageProvider.overrideWith((ref) => 'yo'),
    ]);

    expect(find.text('Ilé'), findsOneWidget);
    expect(find.text('Ìwádìí'), findsOneWidget);
    expect(find.text('Béèrè NISER'), findsOneWidget);
    expect(find.text('Diẹ̀ sii'), findsOneWidget);
  });

  testWidgets('selecting Hausa localises navigation', (tester) async {
    await pumpApp(tester, overrides: [
      contentLanguageProvider.overrideWith((ref) => 'ha'),
    ]);

    expect(find.text('Gida'), findsOneWidget);
    expect(find.text('Tambaye NISER'), findsOneWidget);
  });

  testWidgets('language switch via settings updates interface immediately',
      (tester) async {
    await pumpApp(tester, overrides: const []);
    expect(find.text('Home'), findsOneWidget);

    await tester.tap(find.text('More'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Settings').first);
    await tester.pumpAndSettle();

    // English before the switch.
    expect(find.text('Appearance'), findsOneWidget);

    await tester.tap(find.text('Igbo'));
    await tester.pumpAndSettle();

    // The settings screen re-localises immediately.
    expect(find.text('Ntọala'), findsOneWidget);
    expect(find.text('Ọdịdị'), findsOneWidget);
    expect(find.text('Sistemụ'), findsOneWidget);
  });
}
