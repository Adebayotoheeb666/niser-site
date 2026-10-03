import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/storage/hive_boxes.dart';

/// Appearance preference: follow the system, or force light/dark.
///
/// Stored in the Hive [HiveBoxes.settings] box so the choice survives
/// restarts. Access is guarded — if Hive is unavailable (e.g. tests or a
/// failed init in main) the app still boots with [ThemeMode.system].
class ThemePrefs {
  static const String boxKey = 'theme_mode';

  Box<String> get _box => Hive.box<String>(HiveBoxes.settings);

  ThemeMode load() {
    try {
      return _fromCode(_box.get(boxKey));
    } catch (_) {
      return ThemeMode.system;
    }
  }

  Future<void> save(ThemeMode mode) async {
    try {
      await _box.put(boxKey, _codeOf(mode));
    } catch (_) {
      // Persistence unavailable; in-session selection still applies.
    }
  }

  static ThemeMode _fromCode(String? code) {
    switch (code) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  static String _codeOf(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'light';
      case ThemeMode.dark:
        return 'dark';
      case ThemeMode.system:
        return 'system';
    }
  }
}

final themePrefsProvider = Provider<ThemePrefs>((ref) => ThemePrefs());

final themeModeProvider = StateProvider<ThemeMode>((ref) {
  return ref.watch(themePrefsProvider).load();
});
