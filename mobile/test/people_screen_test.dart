import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/researcher.dart';
import 'package:niser_mobile/data/repositories/researcher_repository.dart';

import 'helpers/fakes.dart';

void main() {
  Future<void> openPeopleTab(WidgetTester tester) async {
    await pumpApp(tester, overrides: [
      researcherRepositoryProvider.overrideWithValue(
        FakeResearcherRepository(
          items: [
            Researcher.fromJson(researcherJson()),
            Researcher.fromJson(
              researcherJson(slug: 'bello-yusuf', position: 'Director', fullName: 'Bello Yusuf'),
            ),
          ],
        ),
      ),
    ]);
    await tester.tap(find.text('People'));
    await tester.pumpAndSettle();
  }

  testWidgets('people list renders researchers', (tester) async {
    await openPeopleTab(tester);

    expect(find.text('Dr Ada Obi'), findsOneWidget);
    expect(find.text('Research Fellow · Macroeconomics'), findsOneWidget);
  });

  testWidgets('division filter narrows the list', (tester) async {
    await openPeopleTab(tester);

    await tester.ensureVisible(find.text('Governance'));
    await tester.tap(find.text('Governance'));
    await tester.pumpAndSettle();

    expect(find.text('Dr Ada Obi'), findsNothing);
    expect(find.text('No researchers found.'), findsOneWidget);
  });

  testWidgets('tapping a researcher opens the profile', (tester) async {
    await openPeopleTab(tester);

    await tester.tap(find.text('Dr Ada Obi'));
    await tester.pumpAndSettle();

    expect(find.text('Economist specialising in monetary policy.'), findsOneWidget);
    expect(find.text('a.obi@niser.gov.ng'), findsOneWidget);
    expect(find.text('Research interests'), findsOneWidget);
  });
}