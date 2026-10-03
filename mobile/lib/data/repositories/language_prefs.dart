import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

import '../../core/storage/hive_boxes.dart';

/// Content-language preference (English, Yorùbá, Hausa, Igbo).
///
/// The selection drives the default target language for the translation
/// tool and marks which translated content variants to prefer. Full UI
/// localisation is planned separately; this is a content-level setting.
class LanguagePrefs {
  static const String boxKey = 'content_language';

  static const Map<String, String> languages = {
    'en': 'English',
    'yo': 'Yorùbá',
    'ha': 'Hausa',
    'ig': 'Igbo',
  };

  Box<String> get _box => Hive.box<String>(HiveBoxes.settings);

  String load() {
    try {
      return _box.get(boxKey) ?? 'en';
    } catch (_) {
      // Hive unavailable (init failed or tests): fall back to English.
      return 'en';
    }
  }

  Future<void> save(String code) async {
    if (!languages.containsKey(code)) return;
    try {
      await _box.put(boxKey, code);
    } catch (_) {
      // Persistence unavailable; in-session selection still applies.
    }
  }
}

final languagePrefsProvider = Provider<LanguagePrefs>((ref) => LanguagePrefs());

final contentLanguageProvider = StateProvider<String>((ref) {
  return ref.watch(languagePrefsProvider).load();
});
