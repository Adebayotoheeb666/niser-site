import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/core/storage/secure_store.dart';
import 'package:niser_mobile/data/repositories/chatbot_repository.dart';
import 'package:niser_mobile/data/repositories/contact_repository.dart';
import 'package:niser_mobile/data/repositories/dataset_repository.dart';
import 'package:niser_mobile/data/repositories/subscription_repository.dart';
import 'package:niser_mobile/data/repositories/translate_repository.dart';
import 'package:niser_mobile/presentation/screens/data/data_screen.dart';
import 'package:niser_mobile/presentation/screens/more/more_screen.dart';

import 'helpers/fakes.dart';

Future<void> _pumpMore(WidgetTester tester, List<Override> overrides) async {
  await pumpApp(tester, overrides: overrides);
  await tester.tap(find.text('More'));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('more screen lists M2 entries', (tester) async {
    await _pumpMore(tester, const []);

    expect(find.byType(MoreScreen), findsOneWidget);
    expect(find.text('Newsletter'), findsOneWidget);
    expect(find.text('Contact us'), findsOneWidget);
    expect(find.text('Translate'), findsOneWidget);
    expect(find.text('Open data'), findsOneWidget);
  });

  testWidgets('subscribe validates consent and submits', (tester) async {
    final repo = FakeSubscriptionRepository();
    await _pumpMore(tester, [
      subscriptionRepositoryProvider.overrideWithValue(repo),
    ]);

    await tester.tap(find.text('Newsletter'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).first, 'reader@example.com');
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();
    expect(find.text('I consent to receiving email updates from NISER. I can unsubscribe at any time.'), findsWidgets);
    await tester.pump(const Duration(seconds: 5));

    await tester.tap(find.byType(CheckboxListTile));
    await tester.pump();
    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();

    expect(repo.subscribedEmail, 'reader@example.com');
    expect(find.textContaining('You are subscribed'), findsOneWidget);
  });

  testWidgets('contact form requires complete input and sends', (tester) async {
    final repo = FakeContactRepository();
    await _pumpMore(tester, [
      contactRepositoryProvider.overrideWithValue(repo),
    ]);

    await tester.tap(find.text('Contact us'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Send message'));
    await tester.pumpAndSettle();
    expect(repo.submitCount, 0);
    await tester.pump(const Duration(seconds: 5));

    await tester.enterText(find.widgetWithText(TextField, 'First name'), 'Ada');
    await tester.enterText(
        find.widgetWithText(TextField, 'Last name'), 'Obi');
    await tester.enterText(
        find.widgetWithText(TextField, 'Email'), 'ada@niser.gov.ng');
    await tester.enterText(
        find.widgetWithText(TextField, 'Your message'),
        'This is a message that is at least twenty characters long.');
    await tester.pump();

    await tester.tap(find.text('Send message'));
    await tester.pumpAndSettle();
    expect(repo.submitCount, 1);
    expect(find.textContaining('your message has been sent'), findsOneWidget);
  });

  testWidgets('translate screen renders translated text', (tester) async {
    final repo = FakeTranslateRepository();
    await _pumpMore(tester, [
      translateRepositoryProvider.overrideWithValue(repo),
    ]);

    await tester.tap(find.text('Translate'));
    await tester.pumpAndSettle();

    await tester.enterText(
        find.byType(TextField), 'Economic growth is important.');
    await tester.tap(find.text('Yorùbá'));
    await tester.pump();

    await tester.tap(find.byType(FilledButton));
    await tester.pumpAndSettle();

    expect(repo.lastTargetLang, 'yo');
    expect(find.textContaining('Eto iṣẹ'), findsWidgets);
  });

  testWidgets('data screen lists datasets and opens detail', (tester) async {
    final repo = FakeDatasetRepository();
    await _pumpMore(tester, [
      datasetRepositoryProvider.overrideWithValue(repo),
    ]);

    await tester.tap(find.text('Open data'));
    await tester.pumpAndSettle();

    expect(find.byType(DataScreen), findsOneWidget);
    expect(find.text('National Accounts 2023'), findsOneWidget);

    await tester.tap(find.text('National Accounts 2023'));
    await tester.pumpAndSettle();

    expect(find.text('Quarterly national accounts.'), findsOneWidget);
    expect(find.text('Metadata'), findsOneWidget);
    expect(find.text('accounts.csv'), findsOneWidget);
    expect(find.text('1200'), findsOneWidget);
  });

  testWidgets('chat streams tokens and shows sources', (tester) async {
    final repo = FakeChatbotRepository(
      historyEntries: [
        {'role': 'user', 'content': 'Previous question'},
        {'role': 'assistant', 'content': 'Previous answer'},
      ],
    );
    await pumpApp(tester, overrides: [
      chatbotRepositoryProvider.overrideWithValue(repo),
      secureStoreProvider.overrideWithValue(FakeSecureStore()),
    ]);

    await tester.tap(find.text('Ask NISER'));
    await tester.pumpAndSettle();

    expect(find.text('Previous question'), findsOneWidget);
    expect(find.text('Previous answer'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'Tell me about GDP');
    await tester.tap(find.byIcon(Icons.send));
    await tester.pump();
    await tester.pump();

    expect(repo.lastMessage, 'Tell me about GDP');
    expect(find.textContaining('Here is your answer.'), findsOneWidget);
    expect(find.textContaining('NISER Working Paper 1'), findsOneWidget);
  });

  testWidgets('chat can clear session history', (tester) async {
    final repo = FakeChatbotRepository(
      historyEntries: [
        {'role': 'user', 'content': 'Previous question'},
      ],
    );
    await pumpApp(tester, overrides: [
      chatbotRepositoryProvider.overrideWithValue(repo),
      secureStoreProvider.overrideWithValue(FakeSecureStore()),
    ]);

    await tester.tap(find.text('Ask NISER'));
    await tester.pumpAndSettle();
    expect(find.text('Previous question'), findsOneWidget);

    await tester.tap(find.byTooltip('Clear session'));
    await tester.pumpAndSettle();

    expect(repo.cleared, isTrue);
    expect(find.text('Previous question'), findsNothing);
  });
}