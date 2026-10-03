import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/cms_event.dart';
import 'package:niser_mobile/data/models/insight.dart';
import 'package:niser_mobile/data/repositories/event_repository.dart';
import 'package:niser_mobile/data/repositories/insight_repository.dart';

import 'helpers/fakes.dart';

void main() {
  testWidgets('insights screen lists insights and opens detail', (tester) async {
    await pumpApp(tester, overrides: [
      insightRepositoryProvider.overrideWithValue(
        FakeInsightRepository(
          items: [
            Insight.fromJson(insightJson()),
            Insight.fromJson(insightJson(slug: 'fuel-subsidy', title: 'Fuel Subsidy Removal')),
          ],
        ),
      ),
    ]);

    await tester.tap(find.text('Insights'));
    await tester.pumpAndSettle();

    expect(find.text('What Higher Rates Mean for Growth'), findsOneWidget);
    expect(find.text('Fuel Subsidy Removal'), findsOneWidget);

    await tester.tap(find.text('What Higher Rates Mean for Growth'));
    await tester.pumpAndSettle();
    expect(find.text('The full plaintext body of the insight.'), findsOneWidget);
  });

  testWidgets('events screen toggles between upcoming and past', (tester) async {
    await pumpApp(tester, overrides: [
      eventRepositoryProvider.overrideWithValue(
        FakeEventRepository(
          items: [
            CMSEvent.fromJson(eventJson(upcoming: true)),
            CMSEvent.fromJson(eventJson(slug: 'past-event', title: 'Past Workshop', upcoming: false)),
          ],
        ),
      ),
    ]);

    await tester.tap(find.text('Events'));
    await tester.pumpAndSettle();

    expect(find.text('Annual Research Conference'), findsOneWidget);
    expect(find.text('Past Workshop'), findsOneWidget);

    await tester.tap(find.text('Past'));
    await tester.pumpAndSettle();
    expect(find.text('Annual Research Conference'), findsNothing);
    expect(find.text('Past Workshop'), findsOneWidget);
  });

  testWidgets('event detail shows register and add-to-calendar actions', (tester) async {
    await pumpApp(tester, overrides: [
      eventRepositoryProvider.overrideWithValue(FakeEventRepository()),
    ]);

    await tester.tap(find.text('Events'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Annual Research Conference'));
    await tester.pumpAndSettle();

    expect(find.text('Register'), findsOneWidget);
    expect(find.text('Add to calendar'), findsOneWidget);
    expect(find.text('Ibadan, Nigeria'), findsOneWidget);
    expect(find.text('The institute annual conference.'), findsOneWidget);
  });
}