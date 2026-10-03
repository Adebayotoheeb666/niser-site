# Changelog

All notable changes to the **NISER Mobile App** (`niser_mobile`).

## [1.0.0] — 2026-08-18

### Added
- **Phase M0 — Foundation**: Material 3 app shell (5-tab bottom navigation), GoRouter navigation with `ShellRoute`, Riverpod providers, Dio HTTP client, Hive offline cache, l10n skeleton (en), theme derived from the NISER web palette, Sentry crash reporting.
- **Phase M1 — Read-only content MVP**: home dashboard (news, events, insights, recommendations); publications list + detail (filter, pagination, citation copy, DOI, PDF open via `open_filex`); researcher directory + profile (division filter, ORCID, mailto); insights list + detail; events list (upcoming/past) + detail + iCal export (`add_2_calendar`); news list.
- **Phase M2 — Interactive features**: streaming chat assistant with citations/sources; newsletter subscribe; contact form; Yoruba/Igbo/Hausa translation; open-data datasets + detail; Sentry diagnostics.
- **Phase M3 — Push notifications**: Firebase Cloud Messaging + topic preferences; in-app notification feed (Hive-backed); deep-link navigation from notification taps; Android 13+ + iOS permission prompts.
- **Phase M4 — Polish & performance**: infinite-scroll pagination on insights/events/news; WCAG AA contrast fixes; screen-reader tooltips, touch targets and semantics; App Links (Android) + Universal Links (iOS) deep linking.

### Changed
- App icon: custom NISER-branded icon (green `#006B3F` / gold `#FFB81C`) replacing the default Flutter template icon on Android (adaptive + legacy) and iOS.
- Version bumped from `0.1.0+1` to `1.0.0+1`.

### Build & release
- Fastlane lanes for Android (`beta`) and iOS (`beta`) with Match-managed signing.
- GitHub Actions workflow (`mobile/.github/workflows/flutter.yml`): analyze, unit tests, integration tests on Android emulator, release AAB + IPA, beta upload (Play internal track / TestFlight).
- Integration test suite (`integration_test/app_test.dart`): search flow, publication open, chat send, subscribe.
