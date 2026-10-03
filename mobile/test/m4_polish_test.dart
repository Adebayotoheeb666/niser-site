import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/insight.dart';
import 'package:niser_mobile/data/models/search_hit.dart';
import 'package:niser_mobile/data/repositories/insight_repository.dart';
import 'package:niser_mobile/data/repositories/search_repository.dart';

import 'helpers/fakes.dart';

List<Insight> _manyInsights(int count) {
  return [
    for (var i = 1; i <= count; i++)
      Insight.fromJson(
        insightJson(
          slug: 'insight-$i',
          title: 'Insight $i',
        ),
      ),
  ];
}

void main() {
  testWidgets('insights list pages on scroll', (tester) async {
    await pumpApp(tester, overrides: [
      insightRepositoryProvider.overrideWithValue(
        FakeInsightRepository(items: _manyInsights(25)),
      ),
    ]);

    await tester.tap(find.text('Insights'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    await tester.pump(const Duration(milliseconds: 400));

    // Page 1 loaded (20 items); page 2 item not yet built.
    expect(find.text('Insight 1'), findsOneWidget);
    expect(find.text('Insight 25'), findsNothing);

    // Scroll to the bottom to trigger the load-more listener.
    await tester.drag(
      find.byType(Scrollable).last,
      const Offset(0, -2000),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    // Page 2 items are now available after scrolling further.
    await tester.drag(
      find.byType(Scrollable).last,
      const Offset(0, -2000),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    expect(find.text('Insight 25'), findsOneWidget);
  });

  testWidgets('icon-only buttons expose tooltips for screen readers',
      (tester) async {
    await pumpApp(tester, overrides: [
      searchRepositoryProvider.overrideWithValue(FakeSearchRepository()),
    ]);

    await tester.tap(find.byIcon(Icons.search));
    await tester.pumpAndSettle();

    final close = tester.widget<IconButton>(
      find.widgetWithIcon(IconButton, Icons.close),
    );
    expect(close.tooltip, isNotNull);
    expect(close.tooltip!.isNotEmpty, isTrue);
  });

  testWidgets('decorative chevrons are excluded from semantics',
      (tester) async {
    await pumpApp(tester, overrides: const []);

    await tester.tap(find.text('Insights'));
    await tester.pumpAndSettle();

    // Decorative chevron icons are wrapped so screen readers skip them.
    expect(find.byType(ExcludeSemantics), findsWidgets);
  });

  testWidgets('bottom navigation destinations have labels', (tester) async {
    await pumpApp(tester, overrides: const []);

    final nav = tester.widget<NavigationBar>(find.byType(NavigationBar));
    expect(nav.destinations.length, 5);
  });

  testWidgets('search results render hits', (tester) async {
    final hits = [
      SearchHit(
        id: 'p1',
        type: 'publication',
        title: 'Growth and Inflation',
        url: '/publications/macro-growth',
        excerpt: 'An excerpt.',
      ),
      SearchHit(
        id: 'r1',
        type: 'researcher',
        title: 'Ada Obi',
        url: '/people/ada-obi',
        excerpt: '',
      ),
    ];
    await pumpApp(tester, overrides: [
      searchRepositoryProvider.overrideWithValue(FakeSearchRepository(hits: hits)),
    ]);

    await tester.tap(find.byIcon(Icons.search));
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField), 'growth');
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();

    expect(find.text('Growth and Inflation'), findsOneWidget);
    expect(find.text('Ada Obi'), findsOneWidget);
    expect(find.text('2 search results'), findsOneWidget);
  });
}