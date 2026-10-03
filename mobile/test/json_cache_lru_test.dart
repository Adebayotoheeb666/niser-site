import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:niser_mobile/core/storage/hive_boxes.dart';
import 'package:niser_mobile/data/cache/json_cache.dart';

void main() {
  late Directory dir;

  setUp(() async {
    dir = await Directory.systemTemp.createTemp('hive_lru_');
    Hive.init(dir.path);
    await HiveBoxes.init();
  });

  tearDown(() async {
    await Hive.close();
    await dir.delete(recursive: true);
  });

  test('putWithCap evicts oldest entries to keep maxEntries', () async {
    final box = Hive.box<String>(HiveBoxes.publications);
    final cache = JsonCache(box);
    await box.clear();

    for (var i = 0; i < 25; i++) {
      await cache.putWithCap('key_$i', {'id': '$i'}, maxEntries: 20);
      // Ensure distinct fetchedAt timestamps.
      await Future<void>.delayed(const Duration(milliseconds: 2));
    }

    expect(box.length, 20);
    expect(box.containsKey('key_0'), isFalse);
    expect(box.containsKey('key_4'), isFalse);
    expect(box.containsKey('key_5'), isTrue);
    expect(box.containsKey('key_24'), isTrue);
  });

  test('isFresh respects TTL', () async {
    final box = Hive.box<String>(HiveBoxes.insights);
    final cache = JsonCache(box);
    await box.clear();
    await cache.put('k1', {'x': 1});
    expect(cache.isFresh('k1', const Duration(hours: 6)), isTrue);
    expect(cache.isFresh('k1', Duration.zero), isFalse);
  });

  test('detail LRU keeps last 20 regardless of key pattern', () async {
    final box = Hive.box<String>(HiveBoxes.pubDetail);
    final cache = JsonCache(box);
    await box.clear();
    for (var i = 0; i < 22; i++) {
      await cache.putWithCap('pub:detail:slug-$i', {'id': '$i'}, maxEntries: 20);
      await Future<void>.delayed(const Duration(milliseconds: 1));
    }
    expect(box.length, 20);
    expect(box.containsKey('pub:detail:slug-0'), isFalse);
  });
}
