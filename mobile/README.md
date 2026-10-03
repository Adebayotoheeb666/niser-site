# NISER Mobile (Flutter)

Official Android + iOS client for the NISER digital platform. Consumes the
Next.js `/api/*` routes in this repository. See
[`NISER_Mobile_App_Flutter_Implementation_Plan.md`](../NISER_Mobile_App_Flutter_Implementation_Plan.md)
for the full plan and phase breakdown.

## Current status

- **Phase M0–M4 complete** — app shell, read-only content MVP, interactive features, push, polish (cached images, HTML/Markdown insights, LRU 20, 500 MB PDF queue, search CancelToken).
- Rebuilt for physical testing: `build/app/outputs/flutter-apk/app-debug.apk` (187M, staging) + `app-release.apk` (77M, obfuscated) — see `docs/PHYSICAL_TESTING.md`.

## Physical device rebuild

```sh
cd mobile
./scripts/rebuild-physical.sh staging        # default QA (https://staging.niser.gov.ng)
./scripts/rebuild-physical.sh prod           # prod smoke
./scripts/rebuild-physical.sh local 192.168.1.23:3000  # laptop dev server on same Wi-Fi
adb install -r build/app/outputs/flutter-apk/app-debug.apk
# or without cable:  cd build/app/outputs/flutter-apk && python3 -m http.server 8000
```

Full guide: `docs/PHYSICAL_TESTING.md` (environment table, install methods, M4/M5 checklist, signing).

## Requirements

- Flutter 3.27+ (stable) / Dart 3.6+
- An Android emulator or iOS simulator for `flutter run`

## Setup

```sh
cd mobile
flutter pub get

# dev default (Android emulator → host via 10.0.2.2)
flutter run

# point at a specific environment
flutter run --dart-define=API_BASE_URL=https://staging.niser.gov.ng
flutter run --dart-define=API_BASE_URL=https://www.niser.gov.ng --dart-define=APP_ENV=prod
```

`API_BASE_URL` and `APP_ENV` are build-time (`--dart-define`) values. No
secrets belong in this app — the backend API is public and read-only.

## Structure

```
lib/
├── main.dart                      # bootstrap (Hive init) → ProviderScope
├── app.dart                       # MaterialApp.router + theme
├── core/
│   ├── api/api_client.dart        # Dio wrapper + providers
│   ├── config/app_config.dart     # --dart-define driven
│   ├── network/connectivity.dart  # offline detection stream
│   ├── storage/                   # Hive boxes + secure storage
│   └── logger/sentry.dart         # crash logging stub
├── data/
│   ├── cache/json_cache.dart      # SWR cache primitives
│   ├── models/                    # mirror types/cms.ts
│   ├── repositories/              # one per API resource
│   └── services/chat_sse_client.dart  # SSE chat stream parser
├── presentation/
│   ├── router/app_router.dart     # GoRouter + 5-tab shell
│   ├── screens/                   # Home / Publications / People / Chat / More
│   ├── theme/app_theme.dart       # Material 3, NISER palette
│   └── widgets/offline_banner.dart
└── l10n/app_localizations.dart    # en strings (more locales later)
```

## Quality

```sh
flutter analyze
flutter test
```

CI runs `flutter analyze` + `flutter test` on every PR touching `mobile/`
(`.github/workflows/flutter.yml`).
