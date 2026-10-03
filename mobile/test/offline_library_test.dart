import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:niser_mobile/core/storage/hive_boxes.dart';
import 'package:niser_mobile/data/repositories/offline_library_repository.dart';

void main() {
  late Directory tmp;
  late Directory libraryDir;
  late HttpServer server;
  late OfflineLibrary library;

  setUpAll(() async {
    tmp = await Directory.systemTemp.createTemp('niser_offline_test');
    Hive.init(tmp.path);
    await Hive.openBox<String>(HiveBoxes.offlineFiles);
  });

  setUp(() async {
    libraryDir = await tmp.createTemp('lib');
    server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    library = OfflineLibrary(
      dio: Dio(),
      resolveDir: () async => libraryDir,
    );
  });

  tearDown(() async {
    await server.close(force: true);
  });

  test('keyFor prefers slug and falls back to URL hash', () {
    expect(OfflineLibrary.keyFor(slug: 'abc', url: 'https://x/y.pdf'), 'abc');
    final k = OfflineLibrary.keyFor(slug: '', url: 'https://x/y.pdf');
    expect(k, startsWith('u'));
  });

  test('download stores file, registers doc, reports progress', () async {
    final payload = Uint8List.fromList(List.filled(2048, 42));
    server.listen((req) async {
      req.response.contentLength = payload.length;
      req.response.add(payload);
      await req.response.close();
    });
    final url = 'http://${server.address.host}:${server.port}/pub.pdf';

    final progresses = <double>[];
    final doc = await library.download(
      key: 'macro-growth',
      url: url,
      title: 'Growth and Inflation',
      onProgress: progresses.add,
    );

    expect(File(doc.filePath).existsSync(), isTrue);
    expect(File(doc.filePath).lengthSync(), payload.length);
    expect(doc.title, 'Growth and Inflation');
    expect(progresses.last, 1.0);
    expect(library.isOffline('macro-growth'), isTrue);
    expect(library.get('macro-growth')!.url, url);
    expect(library.list().map((d) => d.key), contains('macro-growth'));
  });

  test('remove deletes file and registry entry', () async {
    final file = File('${libraryDir.path}/seed.pdf');
    await file.writeAsBytes([1, 2, 3]);
    await Hive.box<String>(HiveBoxes.offlineFiles).put(
      'seed',
      jsonEncode(OfflineDoc(
        key: 'seed',
        url: 'https://example.com/seed.pdf',
        title: 'Seed',
        filePath: file.path,
        savedAt: DateTime.now(),
      ).toJson()),
    );

    expect(library.isOffline('seed'), isTrue);
    await library.remove('seed');
    expect(file.existsSync(), isFalse);
    expect(library.isOffline('seed'), isFalse);
  });

  test('missing backing file is reported as not offline', () async {
    await Hive.box<String>(HiveBoxes.offlineFiles).put(
      'ghost',
      jsonEncode(OfflineDoc(
        key: 'ghost',
        url: 'https://example.com/g.pdf',
        title: 'Ghost',
        filePath: '${tmp.path}/does-not-exist.pdf',
        savedAt: DateTime.now(),
      ).toJson()),
    );
    expect(library.isOffline('ghost'), isFalse);
    expect(library.get('ghost'), isNull);
  });
}
