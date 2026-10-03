import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:niser_mobile/core/storage/hive_boxes.dart';
import 'package:niser_mobile/data/repositories/offline_library_repository.dart';
import 'package:niser_mobile/data/repositories/publication_repository.dart';
import 'package:niser_mobile/presentation/screens/viewer/pdf_viewer_screen.dart';

import 'helpers/fakes.dart';

void main() {
  late Directory tmp;

  setUpAll(() async {
    tmp = await Directory.systemTemp.createTemp('niser_pub_offline_test');
    Hive.init(tmp.path);
    await Hive.openBox<String>(HiveBoxes.settings);
    await Hive.openBox<String>(HiveBoxes.savedContent);
    await Hive.openBox<String>(HiveBoxes.offlineFiles);
  });

  setUp(() async {
    // Registry state must not leak across tests in this isolate.
    await Hive.box<String>(HiveBoxes.offlineFiles).clear();
  });

  Future<void> seedOfflineDoc() async {
    // Seed the registry + backing file directly; no network or async file
    // I/O here — both hang inside testWidgets' FakeAsync zone.
    final file = File('${tmp.path}/macro-growth.pdf');
    file.writeAsBytesSync([37, 37, 80, 68, 70]); // "%PDF" marker bytes
    Hive.box<String>(HiveBoxes.offlineFiles).put(
      'macro-growth',
      jsonEncode(OfflineDoc(
        key: 'macro-growth',
        url: 'https://example.com/pub.pdf',
        title: 'Growth and Inflation in Nigeria',
        filePath: file.path,
        savedAt: DateTime.now(),
      ).toJson()),
    );
  }

  testWidgets('downloaded publication offers Read and opens the in-app viewer',
      (tester) async {
    await seedOfflineDoc();

    await pumpApp(tester, overrides: [
      publicationRepositoryProvider.overrideWithValue(
        FakePublicationRepository(),
      ),
      pdfViewBuilderProvider.overrideWithValue(
        (path) => SizedBox(key: const Key('pdf-stub'), child: Text(path)),
      ),
    ]);

    // Publications list → detail.
    await tester.tap(find.text('Research'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Growth and Inflation in Nigeria'));
    await tester.pumpAndSettle();

    expect(find.text('Download PDF'), findsNothing);
    expect(find.text('Read'), findsOneWidget);

    await tester.tap(find.text('Read'));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('pdf-stub')), findsOneWidget);
  });

  testWidgets('non-downloaded publication still shows Download PDF',
      (tester) async {
    await pumpApp(tester, overrides: [
      publicationRepositoryProvider.overrideWithValue(
        FakePublicationRepository(),
      ),
    ]);

    await tester.tap(find.text('Research'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Growth and Inflation in Nigeria'));
    await tester.pumpAndSettle();

    expect(find.text('Download PDF'), findsOneWidget);
    expect(find.text('Read'), findsNothing);
  });
}
