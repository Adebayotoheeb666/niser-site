import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

/// Emits `true` when the device has any network connectivity.
///
/// Gates network attempts in repositories and drives the offline banner.
final connectivityProvider = StreamProvider<bool>((ref) {
  final controller = StreamController<bool>();

  bool lastEmitted = true;

  void add(bool value) {
    if (value == lastEmitted) return;
    lastEmitted = value;
    controller.add(value);
  }

  Future<void> emit() async {
    try {
      final results = await Connectivity().checkConnectivity();
      add(results.any((r) => r != ConnectivityResult.none));
    } catch (_) {
      // platform channel unavailable (e.g. widget tests) — assume online
      add(true);
    }
  }

  unawaited(emit());

  late StreamSubscription<List<ConnectivityResult>> sub;
  try {
    sub = Connectivity().onConnectivityChanged.listen(
      (results) => add(results.any((r) => r != ConnectivityResult.none)),
      onError: (Object _) {
        // ignore platform-channel errors; keep last known state
      },
      cancelOnError: true,
    );
  } catch (_) {
    sub = const Stream<List<ConnectivityResult>>.empty().listen((_) {});
  }

  ref.onDispose(() {
    sub.cancel();
    controller.close();
  });

  return controller.stream;
});
