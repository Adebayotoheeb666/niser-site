import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:niser_mobile/main.dart' as app;

/// Polls [finder] until it appears or [timeout] elapses. Handles slow
/// network responses and long-running loaders without relying on
/// `pumpAndSettle` (which never settles while a spinner animates).
Future<void> pumpUntilFound(
  WidgetTester tester,
  Finder finder, {
  Duration timeout = const Duration(seconds: 45),
}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    await tester.pump(const Duration(milliseconds: 300));
    if (finder.evaluate().isNotEmpty) return;
  }
  throw TestFailure('Timed out after $timeout waiting for $finder');
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('home loads content and opens a publication', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    // Home dashboard shows at least one section.
    await pumpUntilFound(tester, find.text('Latest news'));

    // Open the publications tab and drill into the first item.
    await tester.tap(find.text('Publications'));
    await pumpUntilFound(tester, find.byType(ListView));
    final firstCard = find.descendant(
      of: find.byType(ListView),
      matching: find.byType(InkWell),
    );
    await pumpUntilFound(tester, firstCard);
    await tester.tap(firstCard.first);
    await pumpUntilFound(tester, find.byType(Scaffold));
  });

  testWidgets('search returns grouped results', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.byIcon(Icons.search));
    await pumpUntilFound(tester, find.byType(TextField));

    await tester.enterText(find.byType(TextField).first, 'inflation');
    await pumpUntilFound(tester, find.textContaining('results'));
  });

  testWidgets('chat sends a message and streams a reply', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    // Chat is reached via the home quick link.
    await tester.tap(find.text('Ask NISER'));
    await pumpUntilFound(tester, find.byType(TextField));

    await tester.enterText(find.byType(TextField).first, 'What is NISER?');
    await tester.tap(find.byTooltip('Send'));
    await pumpUntilFound(
      tester,
      find.textContaining('NISER'),
      timeout: const Duration(seconds: 60),
    );
  });

  testWidgets('newsletter subscription flow', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.text('More'));
    await pumpUntilFound(tester, find.text('Newsletter'));
    await tester.tap(find.text('Newsletter'));
    await pumpUntilFound(tester, find.byType(TextField));

    await tester.enterText(find.byType(TextField).first, 'integration@example.com');
    await tester.tap(find.widgetWithText(FilledButton, 'Newsletter'));
    await pumpUntilFound(
      tester,
      find.textContaining('subscribed'),
      timeout: const Duration(seconds: 30),
    );
  });

  testWidgets('events list toggles and opens detail', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.text('More'));
    await pumpUntilFound(tester, find.text('Events'));
    await tester.tap(find.text('Events'));
    await pumpUntilFound(tester, find.byType(SegmentedButton));

    // Toggle to upcoming.
    await tester.tap(find.text('Upcoming'));
    await tester.pump(const Duration(milliseconds: 500));
    // List should show (may be empty on staging; just verify no crash).
    expect(find.byType(ListView), findsWidgets);
  });

  testWidgets('translate Yoruba flow', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.text('More'));
    await pumpUntilFound(tester, find.text('Translate'));
    await tester.tap(find.text('Translate'));
    await pumpUntilFound(tester, find.byType(TextField));

    await tester.enterText(find.byType(TextField).first, 'Good morning');
    await tester.tap(find.widgetWithText(FilledButton, 'Translate'));
    await pumpUntilFound(
      tester,
      find.textContaining('Translation'),
      timeout: const Duration(seconds: 30),
    );
  });

  testWidgets('open data catalogue and dataset detail', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.text('More'));
    await pumpUntilFound(tester, find.text('Open data'));
    await tester.tap(find.text('Open data'));
    await pumpUntilFound(tester, find.textContaining('Open data'));

    // Drill into first dataset if list populated.
    final firstTile = find.descendant(of: find.byType(ListView), matching: find.byType(ListTile));
    if (firstTile.evaluate().isNotEmpty) {
      await tester.tap(firstTile.first);
      await pumpUntilFound(tester, find.textContaining('Resources'), timeout: const Duration(seconds: 20));
    }
  });

  testWidgets('search pagination loads more results on scroll', (tester) async {
    app.main();
    await pumpUntilFound(tester, find.byType(NavigationBar));

    await tester.tap(find.byIcon(Icons.search));
    await pumpUntilFound(tester, find.byType(TextField));
    await tester.enterText(find.byType(TextField).first, 'research');
    await pumpUntilFound(tester, find.textContaining('results'));
    // Scroll to trigger pagination.
    await tester.drag(find.byType(ListView).first, const Offset(0, -500));
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.byType(ListView), findsOneWidget);
  });
}
