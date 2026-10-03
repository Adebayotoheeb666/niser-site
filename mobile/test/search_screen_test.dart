import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/search_hit.dart';
import 'package:niser_mobile/data/repositories/search_repository.dart';

import 'helpers/fakes.dart';

void main() {
  testWidgets('search screen shows recent searches and grouped results', (tester) async {
    await pumpApp(tester, overrides: [
      searchRepositoryProvider.overrideWithValue(
        FakeSearchRepository(
          hits: [
            const SearchHit(
              id: '1',
              type: 'publication',
              title: 'Growth and Inflation',
              excerpt: 'An excerpt.',
              url: '/publications/macro-growth',
            ),
            const SearchHit(
              id: '2',
              type: 'researcher',
              title: 'Ada Obi',
              excerpt: 'Economist.',
              url: '/people/ada-obi',
            ),
          ],
        ),
      ),
    ]);

    // Open search from the home app bar.
    await tester.tap(find.byIcon(Icons.search));
    await tester.pumpAndSettle();

    // No query yet: recent searches hint is shown.
    expect(find.text('Publications, researchers, insights…'), findsWidgets);

    await tester.enterText(find.byType(TextField).first, 'niser');
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();

    expect(find.text('2 search results'), findsOneWidget);
    expect(find.text('Growth and Inflation'), findsOneWidget);
    expect(find.text('Ada Obi'), findsOneWidget);

    // Clear the query: the recent query should now appear.
    await tester.enterText(find.byType(TextField).first, '');
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();

    expect(find.text('Recent searches'), findsOneWidget);
    expect(find.text('niser'), findsOneWidget);
  });
}