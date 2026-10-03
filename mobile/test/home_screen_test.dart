import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/repositories/event_repository.dart';
import 'package:niser_mobile/data/repositories/insight_repository.dart';
import 'package:niser_mobile/data/repositories/news_repository.dart';

import 'helpers/fakes.dart';

void main() {
  testWidgets('home renders hero, quick links and content sections', (tester) async {
    await pumpApp(tester, overrides: [
      newsRepositoryProvider.overrideWithValue(FakeNewsRepository()),
      eventRepositoryProvider.overrideWithValue(FakeEventRepository()),
      insightRepositoryProvider.overrideWithValue(FakeInsightRepository()),
    ]);

    expect(find.text('Welcome to NISER'), findsOneWidget);
    expect(find.text('Latest news'), findsOneWidget);
    expect(find.text('Upcoming events'), findsOneWidget);
    expect(find.text('Featured insights'), findsOneWidget);
    expect(find.text('NISER Releases 2024 Annual Report'), findsOneWidget);
    expect(find.text('Annual Research Conference'), findsOneWidget);
    expect(find.text('What Higher Rates Mean for Growth'), findsOneWidget);

    // Quick links navigate to their lists.
    await tester.tap(find.text('Insights'));
    await tester.pumpAndSettle();
    expect(find.text('What Higher Rates Mean for Growth'), findsOneWidget);
  });

  testWidgets('home handles empty sections gracefully', (tester) async {
    await pumpApp(tester, overrides: [
      newsRepositoryProvider.overrideWithValue(FakeNewsRepository(items: [])),
      eventRepositoryProvider.overrideWithValue(FakeEventRepository(items: [])),
      insightRepositoryProvider.overrideWithValue(FakeInsightRepository(items: [])),
    ]);

    expect(find.text('Welcome to NISER'), findsOneWidget);
    expect(find.text('Latest news'), findsOneWidget);
    expect(find.text('No news yet.'), findsNothing);
  });
}