import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/publication.dart';
import 'package:niser_mobile/data/repositories/publication_repository.dart';

import 'helpers/fakes.dart';

void main() {
  Future<void> openPublicationsTab(WidgetTester tester) async {
    await pumpApp(tester, overrides: [
      publicationRepositoryProvider.overrideWithValue(
        FakePublicationRepository(
          items: [
            Publication.fromJson(publicationJson(slug: 'macro-growth')),
            Publication.fromJson(
              publicationJson(
                slug: 'tax-reform',
                title: 'Tax Reform for the Informal Sector',
                year: 2023,
                openAccess: false,
              )..['publicationType'] = 'policy_brief',
            ),
          ],
        ),
      ),
    ]);
    await tester.tap(find.text('Research'));
    await tester.pumpAndSettle();
  }

  testWidgets('publications list renders items with meta', (tester) async {
    await openPublicationsTab(tester);

    expect(find.text('Growth and Inflation in Nigeria'), findsOneWidget);
    expect(find.text('Tax Reform for the Informal Sector'), findsOneWidget);
    expect(find.text('2024 · Working paper'), findsOneWidget);
    expect(find.text('OA'), findsOneWidget);
  });

  testWidgets('type filter narrows the list', (tester) async {
    await openPublicationsTab(tester);

    await tester.tap(find.text('Policy brief'));
    await tester.pumpAndSettle();

    expect(find.text('Tax Reform for the Informal Sector'), findsOneWidget);
    expect(find.text('Growth and Inflation in Nigeria'), findsNothing);
  });

  testWidgets('search box filters the list', (tester) async {
    await openPublicationsTab(tester);

    await tester.enterText(find.byType(TextField), 'tax');
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Tax Reform for the Informal Sector'), findsOneWidget);
    expect(find.text('Growth and Inflation in Nigeria'), findsNothing);
  });

  testWidgets('tapping a publication opens the detail screen', (tester) async {
    await openPublicationsTab(tester);

    await tester.tap(find.text('Growth and Inflation in Nigeria'));
    await tester.pumpAndSettle();

    expect(find.text('An abstract about the Nigerian economy.'), findsOneWidget);
    expect(find.text('DOI'), findsOneWidget);
    expect(find.text('10.1234/example'), findsOneWidget);
    expect(find.text('Download PDF'), findsOneWidget);
  });
}