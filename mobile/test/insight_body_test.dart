import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/enums.dart';
import 'package:niser_mobile/data/models/insight.dart';
import 'package:niser_mobile/presentation/widgets/insight_body.dart';

Insight _insight({String? body, String? plaintext, String? featured}) {
  return Insight(
    id: 'i1',
    title: 'Test insight',
    slug: 'test-insight',
    contentType: InsightContentType.analysis,
    status: ContentStatus.published,
    body: body,
    bodyPlaintext: plaintext,
    featuredImage: featured,
  );
}

void main() {
  testWidgets('renders HTML body via flutter_html', (tester) async {
    final insight = _insight(body: '<h1>Hello</h1><p>Paragraph with <a href="https://example.com">link</a>.</p>');
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: SingleChildScrollView(child: InsightBody(insight: insight)))));
    await tester.pump();
    expect(find.textContaining('Hello'), findsOneWidget);
    expect(find.textContaining('Paragraph'), findsOneWidget);
  });

  testWidgets('renders markdown plaintext as markdown', (tester) async {
    final insight = _insight(plaintext: '# Heading\n\nSome **bold** and [link](https://example.com)');
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: SingleChildScrollView(child: InsightBody(insight: insight)))));
    await tester.pump();
    expect(find.textContaining('Heading'), findsOneWidget);
  });

  testWidgets('renders plain text fallback', (tester) async {
    final insight = _insight(plaintext: 'Just a plain paragraph without markup.');
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: SingleChildScrollView(child: InsightBody(insight: insight)))));
    await tester.pump();
    expect(find.textContaining('plain paragraph'), findsOneWidget);
  });

  testWidgets('empty body renders empty box', (tester) async {
    final insight = _insight();
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: InsightBody(insight: insight))));
    await tester.pump();
    expect(find.byType(SizedBox), findsWidgets);
  });
}
