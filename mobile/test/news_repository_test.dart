import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:niser_mobile/data/cache/json_cache.dart';
import 'package:niser_mobile/data/repositories/swr.dart';

void main() {
  late Box<String> box;

  setUp(() async {
    final tmp = Directory.systemTemp.createTempSync('niser_hive_test');
    Hive.init(tmp.path);
    box = await Hive.openBox<String>('test_box');
  });

  tearDown(() async {
    await box.clear();
    await box.close();
    await Hive.deleteFromDisk();
  });

  group('JsonCache', () {
    test('stores and returns JSON payloads', () async {
      final cache = JsonCache(box);
      await cache.put('k1', {'a': 1});
      expect(cache.getRaw('k1'), {'a': 1});
    });

    test('isFresh honours TTL', () async {
      final cache = JsonCache(box);
      await cache.put('k2', {'a': 1});
      expect(cache.isFresh('k2', const Duration(hours: 1)), isTrue);
      expect(cache.isFresh('k2', Duration.zero), isFalse);
    });
  });

  group('swrList', () {
    test('returns network data when cache is empty', () async {
      final cache = JsonCache(box);
      final result = await swrList<String>(
        cacheKey: 'list:1',
        ttl: const Duration(hours: 1),
        cache: cache,
        parse: (raw) => (raw as List).cast<String>(),
        network: () async => ['a', 'b'],
      );

      expect(result.value, ['a', 'b']);
      expect(result.fromCache, isFalse);
    });

    test('serves fresh cache without hitting network', () async {
      final cache = JsonCache(box);
      await cache.put('list:2', <String>['cached']);

      var networkCalls = 0;
      final result = await swrList<String>(
        cacheKey: 'list:2',
        ttl: const Duration(hours: 1),
        cache: cache,
        parse: (raw) => (raw as List).cast<String>(),
        network: () async {
          networkCalls++;
          return ['fresh'];
        },
      );

      expect(result.value, ['cached']);
      expect(result.fromCache, isTrue);
      expect(networkCalls, 0);
    });

    test('falls back to stale cache when network throws', () async {
      final cache = JsonCache(box);
      await cache.put('list:3', <String>['stale']);

      final result = await swrList<String>(
        cacheKey: 'list:3',
        ttl: Duration.zero,
        cache: cache,
        parse: (raw) => (raw as List).cast<String>(),
        network: () async => throw Exception('offline'),
      );

      expect(result.value, ['stale']);
      expect(result.fromCache, isTrue);
      expect(result.stale, isTrue);
    });
  });
}
