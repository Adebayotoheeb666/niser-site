# Physical Phone Testing — NISER Mobile

Builds in this guide are **sideload APKs** (no Play Store). Release AAB is for Play internal track after UAT.

## 1. Pick the environment

| Env | Command | When to use |
|-----|---------|-------------|
| `staging` | `./scripts/rebuild-physical.sh staging` | Default for QA — hits `https://staging.niser.gov.ng` |
| `prod` | `./scripts/rebuild-physical.sh prod` | Final smoke before store |
| `local` | `./scripts/rebuild-physical.sh local 192.168.1.23:3000` | Phone + laptop same Wi-Fi, Next.js running on `npm run dev` at that IP. `10.0.2.2` **does not work** on physical devices |

`API_BASE_URL` is baked at compile time (`lib/core/config/app_config.dart:22`). The app is read-only, no secrets in the binary.

## 2. Build

```sh
cd mobile
./scripts/rebuild-physical.sh staging   # or prod / local <ip>
```

Artifacts:

```
build/app/outputs/flutter-apk/app-debug.apk    # 180MB, fast, for dev sideload
build/app/outputs/flutter-apk/app-release.apk  # ~45MB, obfuscated + split-debug-info
build/app/outputs/bundle/release/app-release.aab  # Play bundle
build/symbols/                                  # obfuscation maps — keep for crash deobfuscation
```

The script runs `flutter clean` → `pub get` → `analyze` → `apk debug` → `apk release` → `appbundle`. First build ~90–150s (Gradle downloads).

Already-built APK from this machine:

```
mobile/build/app/outputs/flutter-apk/app-debug.apk  (187M, staging, 2026-08-28)
  sha1: b86b7b436c7436f819ba531b49e9861fdfc63046
```

## 3. Connect a phone

Enable **Developer options > USB debugging**. Then:

```sh
adb devices               # should list your device
# Wireless (Android 11+):
#   On phone: Developer options > Wireless debugging > Pair with pairing code
#   adb pair <ip>:<port> <code>
#   adb connect <ip>:<port>
```

If `adb devices` is empty, the build step still succeeds — just sideload via file transfer instead.

## 4. Install

### Cable (`adb`)
```sh
adb install -r build/app/outputs/flutter-apk/app-debug.apk
# release variant:
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

### Without cable — HTTP sideload
```sh
cd build/app/outputs/flutter-apk
python3 -m http.server 8000
# On phone browser: http://<laptop-ip>:8000/app-debug.apk
# Allow "Install unknown apps" when prompted.
```

### Flutter helper (device must be `adb devices` visible)
```sh
flutter install --dart-define=API_BASE_URL=https://staging.niser.gov.ng --dart-define=APP_ENV=staging
flutter run --release --dart-define=API_BASE_URL=https://staging.niser.gov.ng  # hot-restart with logs
```

## 5. Device testing checklist (M4/M5)

Run through on **one mid-range Android + one iOS device** before UAT sign-off (`NISER_Mobile_App_Flutter_Implementation_Plan.md:414`):

- [ ] **Cold start < 2s**, no jank on scroll (profile with DevTools). Release build has `CachedNetworkImage` + pagination lazy-load (`insights/events/news`).
- [ ] **5 tabs** render from live staging API: Home (news/events/insights), Research (publications filter/pagination/citation), People (division filter, ORCID), Ask NISER (SSE stream), More (events/data/settings).
- [ ] **Images** load via disk cache, placeholders show offline (`lib/presentation/widgets/cached_image.dart`).
- [ ] **Insight body** renders HTML/Markdown via `flutter_html`/`flutter_markdown` (`lib/presentation/widgets/insight_body.dart`). Verify rich tables/callouts.
- [ ] **Search** — type “research”, debounce 400ms, `CancelToken` cancels stale requests, scroll to trigger pagination `limit 20` (plan §8).
- [ ] **Publications** — citation sheet shows APA/Chicago/BibTeX + Share via `share_plus` (`lib/core/utils/citation.dart`). DOI tap → browser. PDF Download → offline queue (500 MB cap, LRU 20), Read offline via `pdfrx`.
- [ ] **Offline**: airplane mode on — cached lists show immediately (Hive TTL: pubs 6h, insights 12h, events 1h, news 6h, researchers 12h, pub detail LRU 20). Banner “You are offline” (`app.dart:68`).
- [ ] **Push**: onboarding permission prompt (Android 13+/iOS). Foreground `flutter_local_notifications` banner, background/terminated deep link via `PushNavigator`.
- [ ] **Deep links**: `niser://home`, `niser://publications/<slug>` etc. App Links `https://niser.gov.ng/*` require hosting `/.well-known/assetlinks.json` (ops step).
- [ ] **A11y**: text-scale, 48px touch targets, semantics labels (M4 polish).

## 6. Local-network testing (no staging)

When staging is not yet deployed, run the BFF on your laptop and expose its LAN IP:

```sh
# Terminal 1 — Next.js
npm run dev -- -H 0.0.0.0 -p 3000

# Terminal 2 — build APK pointing at your laptop
cd mobile
./scripts/rebuild-physical.sh local 192.168.1.23:3000
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

Phone and laptop must share Wi-Fi, firewall must allow 3000. `10.0.2.2` only works on the Android emulator.

## 7. Signing

Current `android/app/build.gradle.kts:39` falls back to **debug keystore** for `release` when `android/key.properties` is absent, so `app-release.apk` installs like a debug build. For Play uploads, create the upload keystore once:

```sh
keytool -genkey -v -keystore android/app/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
# then create android/key.properties with storeFile/storePassword/keyAlias/keyPassword
# CI restores it from GH secrets (see .github/workflows/flutter.yml:74)
```

iOS needs a Mac + `fastlane match` (see `fastlane/Matchfile`).

## 8. Known release-build behavior

- `flutter build apk --release --obfuscate` shrinks + renames Dart symbols; keep `build/symbols/` for Sentry deobfuscation.
- Firebase is via `--dart-define` (`FIREBASE_*`); without defines the app runs in **no-op** mode (push disabled, no crash on missing `google-services.json`).
- Clearing app storage resets Hive boxes + download queue (Settings → Clear cache also clears `offline_files`).
