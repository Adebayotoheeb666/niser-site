# NISER Mobile App — Flutter Implementation Plan

**Version**: 1.0
**Date**: August 15, 2026
**Status**: Draft for review
**Alignment**: NISER_Software_Design_Document_v1.0.md §7 (Mobile Application Detailed Design), adapted to the **actual** stack (Next.js 14 BFF + WordPress headless CMS, not Payload).

---

## 1. Overview

The NISER digital platform currently exists as a Next.js 14 web application (the BFF/API layer) backed by a WordPress headless CMS exposed via a custom REST namespace (`/wp-json/niser/v1`). There is **no mobile application**. The design document calls for a Flutter app for Android + iOS that reuses the same backend, plus push notifications via Firebase Cloud Messaging (FCM) and offline-first content access.

This plan describes a complete, phased implementation of the Flutter mobile app against the **existing** Next.js API layer, including the small set of new API routes the backend must expose for mobile consumption.

### 1.1 Goals

| # | Goal | Acceptance criterion |
|---|------|----------------------|
| G1 | Android + iOS apps published to Google Play and Apple App Store | Store listing live; installable by public users |
| G2 | Consume the existing NISER backend (no duplicated logic in Dart) | Every screen is backed by a Next.js `/api/*` route |
| G3 | Offline-first content experience for publications, events, researchers, insights | Cached content renders with no network |
| G4 | Push notifications (publications, events, insights, policy alerts) | FCM tokens registered; topic + token notifications received on device |
| G5 | AI chatbot ("Ask NISER"), search, translation surfaced in-app | Chat streams tokens via SSE; search returns hybrid results |
| G6 | NDPR-compliant (consent for notifications, minimal data, privacy policy accessible) | Consent flows; no data stored without basis |

### 1.2 Non-goals (v1)

- No in-app CMS editing / admin functions (web only).
- No e-commerce/shop (exists on web only for v1).
- No offline PDF rendering beyond opening shared/external viewers (v1). Full offline PDF download queue is post-MVP.
- No Flutter Web target in v1 (mobile only), though the architecture keeps the door open.

---

## 2. Current State Assessment

### 2.1 What the mobile app can consume today

Existing Next.js API routes (all under `app/api/`):

| Route | Method | Purpose | Notes |
|-------|--------|---------|-------|
| `/api/publications` | GET | Filterable, paginated publications | `q`, `type`, `division`, `year`, `page`, `limit` |
| `/api/search` | GET | Hybrid keyword/semantic search | `mode=keyword\|semantic`; Qdrant optional |
| `/api/chatbot` | POST | SSE-streamed AI chat | Rate-limited (10/min/IP); Turnstile when configured; no Origin header ⇒ allowed for native |
| `/api/chatbot/history`, `/api/chatbot/clear` | GET/POST | Chat session memory (Firestore) | Session cookies — native app must send identity headers/cookies |
| `/api/subscribe` | POST/GET | Newsletter subscribe / unsubscribe | Firestore-backed; confirmation email |
| `/api/contact` | POST | Contact form → email | Brevo |
| `/api/data` | GET | Open data catalogue | Returns all datasets |
| `/api/data/[id]` | GET | Dataset detail | |
| `/api/data/ical?id=` | GET | iCal export per event | |
| `/api/recommendations` | GET | Related content | |
| `/api/translate` | POST | Yoruba/Hausa/Igbo translation | NLLB service |
| `/api/policy-alerts` | GET | Policy alerts | |
| `/api/ai/status` | GET | AI service health | |

Backend configuration facts relevant to mobile:

- CMS base: `NEXT_PUBLIC_CMS_URL` (WordPress REST at `http://localhost:10003/wp-json/niser/v1` locally; production domain TBD).
- Firestore is already initialised (`lib/firebase-admin.ts`) — usable for device-token registration and chat memory.
- Chatbot `requirePublicChatAccess` allows requests with **no Origin header** (native clients), so no CORS changes needed for native. Flutter **Web** would need CORS — out of scope v1.
- `middleware.ts` applies Cloudflare edge caching to public GET APIs — good for mobile egress cost; the app should send standard cache-friendly headers.

### 2.2 Backend gaps the mobile app needs (must be built)

| # | Missing | Reason |
|---|---------|--------|
| B1 | `/api/events` (list, upcoming/past, filter) | Web renders events server-side; no public JSON endpoint |
| B2 | `/api/events/[slug]` | Event detail JSON |
| B3 | `/api/insights` + `/api/insights/[slug]` | Blog/insights JSON |
| B4 | `/api/news` + `/api/news/[slug]` | News JSON |
| B5 | `/api/people` + `/api/people/[slug]` | Researcher directory + profile JSON |
| B6 | `/api/publications/[slug]` | Publication detail JSON (web uses CMS directly) |
| B7 | `/api/fcm-register` | Device token registration (Firestore) |
| B8 | `/api/fcm-unregister` | Token de-registration on logout/opt-out |
| B9 | `/api/notify` (optional) | Admin-triggered broadcast to FCM topics |

**All B1–B9 are thin wrappers over existing `lib/cms/client.ts` getters**, so they are low-risk and quick (see §11 schedule).

### 2.3 Environments

| Env | Next.js base URL | Purpose |
|-----|------------------|---------|
| dev | `http://10.0.2.2:3000` (Android emulator) / `http://localhost:3000` (iOS sim) | Local iteration |
| staging | `https://staging.niser.gov.ng` | UAT |
| prod | `https://www.niser.gov.ng` (TBD final domain) | Store release |

A single `--dart-define=API_BASE_URL=...` / `.env` per environment drives all network calls; never hardcode URLs.

---

## 3. Architecture

### 3.1 Repository layout

The mobile app lives in the **same repository** under a new top-level `mobile/` directory (consistent with the existing `app/`, `lib/`, `components/` Next.js tree). This keeps web + mobile + backend in one repo and lets CI build both.

```
niser/
├── mobile/                       # Flutter app (new)
│   ├── lib/
│   │   ├── main.dart
│   │   ├── app.dart              # MaterialApp.router + theme
│   │   ├── core/
│   │   │   ├── api/api_client.dart        # Dio wrapper + interceptors
│   │   │   ├── config/app_config.dart     # --dart-define driven
│   │   │   ├── network/connectivity.dart
│   │   │   ├── storage/secure_store.dart  # flutter_secure_storage
│   │   │   ├── storage/hive_boxes.dart    # Hive box registration
│   │   │   └── logger/sentry.dart
│   │   ├── data/
│   │   │   ├── models/                    # Publication, Researcher, Insight,
│   │   │   │                              #   CMSEvent, NewsItem, Dataset...
│   │   │   ├── repositories/
│   │   │   │   ├── publication_repository.dart
│   │   │   │   ├── search_repository.dart
│   │   │   │   ├── event_repository.dart
│   │   │   │   ├── researcher_repository.dart
│   │   │   │   ├── insight_repository.dart
│   │   │   │   ├── news_repository.dart
│   │   │   │   ├── dataset_repository.dart
│   │   │   │   ├── chatbot_repository.dart
│   │   │   │   ├── notification_repository.dart
│   │   │   │   └── subscription_repository.dart
│   │   │   └── services/
│   │   │       ├── chat_sse_client.dart   # SSE parser for /api/chatbot
│   │   │       └── push_service.dart      # firebase_messaging orchestration
│   │   ├── domain/                        # (interfaces + use cases — see §3.4)
│   │   ├── presentation/
│   │   │   ├── router/app_router.dart     # GoRouter config
│   │   │   ├── screens/
│   │   │   ├── widgets/
│   │   │   └── state/                     # Riverpod providers
│   │   └── l10n/
│   ├── test/                    # unit + widget tests
│   ├── integration_test/        # device tests
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   ├── .env.dev / .env.staging / .env.prod
│   └── fastlane/                # per-platform fastfiles (see §9)
├── app/                         # existing Next.js
├── lib/                         # existing Next.js
└── ...
```

### 3.2 Technology choices

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Flutter 3.27+ / Dart 3.6+ | Cross-platform, single codebase (per ADR-02 in design doc) |
| UI | Material 3 | Design doc requires Material 3; NISER green/gold palette from web (`#006B3F`, `#FFB81C`) |
| State management | Riverpod 2.x (`flutter_riverpod`) | Design doc mandates Riverpod; testable, no code-gen required |
| Navigation | GoRouter 14+ | Deep links from FCM taps; declarative routes matching web URLs |
| HTTP | Dio + `stream_transform` (SSE) | Interceptors for auth headers, logging, retry; SSE for chat streaming |
| Local storage | Hive (fast, no native deps) + `flutter_secure_storage` (tokens/prefs) | Offline-first cache per design doc §7.2 |
| Push | `firebase_messaging` + `flutter_local_notifications` | FCM with in-app foreground banners |
| Image | `cached_network_image` | Offline image cache with placeholder |
| PDF open | `open_filex` + native share | v1 opens PDFs externally; download queue post-MVP |
| Analytics | Matomo Flutter SDK (optional) / Sentry | Web uses Matomo; Sentry for crash/error telemetry |
| Secrets | `--dart-define-from-file` + `flutter_dotenv` | No secrets in repo; API base URL is public (read-only API) |
| Codegen | `freezed` + `json_serializable` | Strongly typed API models mirroring `types/cms.ts` |

### 3.3 API contract mapping (web types → Dart models)

The Next.js `types/cms.ts` types must be mirrored in Dart. Generate Dart models from these interfaces:

| Web type (`types/cms.ts`) | Dart model | Consumed via |
|---|---|---|
| `Publication` | `Publication` | `/api/publications`, `/api/search`, `/api/publications/[slug]` |
| `AuthorSummary` | `AuthorSummary` | nested in `Publication` |
| `Researcher` | `Researcher` | `/api/people`, `/api/people/[slug]`, `/api/search` |
| `Insight` | `Insight` | `/api/insights`, `/api/insights/[slug]` |
| `CMSEvent` | `CMSEvent` | `/api/events`, `/api/events/[slug]`, `/api/data/ical` |
| `NewsItem` | `NewsItem` | `/api/news`, `/api/news/[slug]` |
| `Dataset` / `DatasetResource` | `Dataset`, `DatasetResource` | `/api/data`, `/api/data/[id]` |
| `SearchHit` (in `/api/search`) | `SearchHit` | `/api/search` |

**Serialisation rule**: field names in Dart mirror the JSON keys the Next.js routes emit. Any date fields are ISO-8601 strings parsed via `DateTime.tryParse`. Nullable fields map to `null` defaults so new CMS fields never break decoding.

### 3.4 Domain layering (lightweight)

To keep velocity high without over-engineering, use a **feature-first structure** with Riverpod providers exposing repositories directly to UI (skip a formal UseCase layer unless it earns its place). Each repository:

1. Checks cache (Hive) → returns immediately if fresh (stale-while-revalidate).
2. Fires network request in background.
3. Writes cache on success; emits update via a Riverpod `AsyncNotifier`.
4. Returns cached-on-error with a `CachedData` flag so the UI can show "offline data" banners.

---

## 4. Offline-First Design

Mirrors design doc §7.2 exactly, adapted to Hive boxes:

| Data type | Hive box | TTL | Strategy |
|---|---|---|---|
| Publication list | `publications_cache` | 6 h | SWR (show cache, refresh in bg) |
| Publication detail | `pub_detail_cache` | infinite (LRU, last 20; pinned if saved) | Manual "Save offline" |
| Researcher profiles | `researcher_cache` | 12 h | SWR, last 15 |
| Insights | `insights_cache` | 12 h | SWR |
| Events | `events_cache` | 1 h | Refresh on foreground if stale |
| News | `news_cache` | 6 h | SWR |
| Search results | in-memory + `recent_searches` (last 20) | n/a | Recent queries persisted |
| Chat sessions | `chat_sessions` | n/a | Session-level; clearable; not synced |
| Dataset catalogue | in-memory only | n/a | Always network (design doc) |
| User prefs / FCM topic prefs | `flutter_secure_storage` | n/a | Language, text scale, notification prefs |

**Connectivity**: `connectivity_plus` to detect offline; a global `ConnectivityProvider` gates network attempts and surfaces an offline banner. When offline, repositories serve cache and the app shows a "You are offline — showing saved content" indicator.

---

## 5. Screen Inventory

Navigation: bottom nav with **5 destinations** (Home, Research, People, Ask NISER, More) per design doc §7.1, plus a full-screen Search modal. GoRouter `ShellRoute` preserves per-tab state.

| Tab / Route | Screen | Backend | Key features |
|---|---|---|---|
| Home `/home` | HomeScreen | `/api/news`, `/api/events`, `/api/insights`, `/api/recommendations` | Hero, latest news, upcoming events, featured insights, quick links |
| Home `/home/insight/:slug` | InsightDetailScreen | `/api/insights/[slug]` | Body rendering, author, social share, "save offline" |
| Home `/home/event/:slug` | EventDetailScreen | `/api/events/[slug]`, `/api/data/ical` | Date/location, iCal export → calendar app, register CTA |
| Research `/publications` | PublicationsScreen | `/api/publications` | Filter (type/division/year), search-in-list, pagination |
| Research `/publications/:slug` | PublicationDetailScreen | `/api/publications/[slug]` | Abstract, authors, keywords, DOI, PDF open, citation (APA/BibTeX/Chicago) copy, save offline |
| People `/people` | ResearcherDirectoryScreen | `/api/people` | Search, division filter, active only |
| People `/people/:slug` | ResearcherProfileScreen | `/api/people/[slug]` | Bio, interests, ORCID, selected publications, contact |
| Ask NISER `/chat` | ChatScreen | `/api/chatbot` (+history/clear) | SSE streaming, markdown-lite rendering, source links, clear session, memory consent |
| More `/more` | MoreScreen | — | Menu hub |
| More `/more/events` | EventsScreen | `/api/events` | Upcoming/past tabs, type filter, calendar add |
| More `/more/data` | DataCatalogueScreen | `/api/data` | Dataset list, tags, formats |
| More `/more/data/:id` | DatasetDetailScreen | `/api/data/[id]` | Metadata, resource download (CSV/PDF/XLSX/JSON) via `open_filex` |
| More `/more/settings` | SettingsScreen | — | Language, text size, notification prefs, clear cache, about |
| More `/more/notifications` | NotificationPrefsScreen | `/api/fcm-register`, topic subs | Topic toggles, permission status |
| More `/more/about` | AboutScreen | static | Contact info, privacy policy link, app version |
| More `/more/news` | NewsScreen | `/api/news` | News list |
| Search (modal) `/search` | SearchScreen | `/api/search` | Keyword/semantic toggle, type filter, recent searches, results grouped by type |
| Onboarding `/onboarding` | OnboardingScreen | — | One-time; requests notification permission |
| Notifications `/notifications` | NotificationInboxScreen | local + `/api/policy-alerts` | Recent push alerts, policy alerts feed |

**Deep-link scheme**: `niser://home`, `niser://publications/<slug>`, `niser://people/<slug>`, `niser://chat`, `niser://more/events/<slug>`, `niser://more/data/<id>`, `niser://home/insight/<slug>`. FCM payload carries `{ type, id, url }` to build the matching route.

---

## 6. Push Notifications

### 6.1 Flow

1. **Permission**: on first launch after onboarding, `FirebaseMessaging.instance.requestPermission()`. Android 13+ and iOS require explicit prompt (design doc §7.3).
2. **Token registration**: on grant or re-launch, fetch token → `POST /api/fcm-register { token, platform, topics: [...] }` → stored in Firestore `device_tokens` collection (anonymous, keyed by token). Handle `onTokenRefresh` → re-register.
3. **Topic subscriptions**: `FirebaseMessaging.subscribeToTopic()` for `niser_publications`, `niser_events`, `niser_insights`, `niser_rapid_response`. Defaults: publications + insights. Managed in NotificationPrefsScreen.
4. **Foreground**: `FirebaseMessaging.onMessage` → show local notification banner via `flutter_local_notifications`; tap → GoRouter deep link.
5. **Background/terminated**: system tray notification; `getInitialMessage()` / `onMessageOpenedApp` → deep link.
6. **Sending**: existing `/api/fcm` (server-side) sends to a token or topic using the Admin SDK. The admin broadcast flow (B9, optional) calls `/api/notify` from the CMS webhook (like the web implementation's pattern).

### 6.2 New backend routes

- `POST /api/fcm-register` — validates token shape, upserts `device_tokens` doc `{ token, platform, topics, lastSeen }` in Firestore, returns `{ ok: true }`.
- `POST /api/fcm-unregister` — deletes token doc.
- (Optional) `POST /api/notify` — admin-authenticated (`WEBHOOK_SECRET`/`INTERNAL_AI_SECRET`) broadcast to a topic.

### 6.3 NDPR

- Consent is explicit (opt-in prompt with explanation).
- Token registration is anonymous (no PII linked; keyed by token).
- Notification prefs are user-editable at any time; de-registration on opt-out.
- Privacy policy link required in Settings → About.

---

## 7. Chatbot Integration (Ask NISER)

The existing `/api/chatbot` POST returns an **SSE stream** of `data: {...}` events (`{ token }`, `{ event: 'mode' }`, `{ event: 'sources' }`, `{ event: 'done' }`, `{ event: 'error' }`).

Implementation notes:

- `chat_sse_client.dart` reads the Dio `ResponseType.stream` and parses the SSE frames with `stream_transform` (accumulate buffer, split on `\n\n`, JSON-decode each `data:` line).
- Identity: `readChatIdentity`/`createChatIdentity` use cookies (`identityCookiePairs`). The Dart HTTP client must enable cookie handling (`http` package with `CookieManager`, or manually persist `sessionId`/`visitorId` from Set-Cookie and send them back). Simplest robust approach: use `http` + `cookiejar` cookie store on the app-level client.
- Rate limit: `/api/chatbot` is limited to **10 requests/min/IP** (public chat). Native users behind carrier NAT share IPs → the team must raise `PUBLIC_CHAT_RATE_LIMIT_MAX` or accept per-IP limits. Plan: keep 10/min for MVP; add device fingerprint header + higher per-fingerprint limit if abuse is measured. Do **not** disable the limit in production.
- Turnstile: when `TURNSTILE_SECRET_KEY` is set, requests without `x-turnstile-token` are rejected. Native apps cannot easily run Turnstile → keep Turnstile **disabled for mobile-origin traffic** (no Origin header ⇒ currently passes `hasAllowedOrigin`, but Turnstile check would still fail). Either (a) leave Turnstile unset for MVP, or (b) add a `x-client: niser-mobile` allow-path. Flag for review (§12, Risk R4).
- Chat memory persists in Firestore keyed by session; `/api/chatbot/history` and `/api/chatbot/clear` map to ChatScreen session persistence.

---

## 8. Search Integration

`/api/search` supports `mode=keyword|semantic`, `type`, `division`, `year`, `page`. In the app:

- Default **keyword** mode (works without Qdrant). Semantic mode enabled only when `/api/ai/status` reports Qdrant available; UI shows a toggle.
- Group results by `type` (publication / researcher / insight / event / news) with section headers.
- Persist last 20 queries in Hive; show as "Recent searches" chips.
- Debounce input (~350 ms) and cancel stale requests (Dio `CancelToken`).

---

## 9. CI/CD & Store Pipeline

Mirror design doc §7.4 but for the actual repo:

### 9.1 GitHub Actions workflow (`mobile/.github/workflows/flutter.yml`)

| Stage | Runner | Steps |
|-------|--------|-------|
| analyze | ubuntu-latest | `flutter pub get`, `flutter analyze` (fails on errors) |
| test | ubuntu-latest | `flutter test`; enforce ≥75% statement coverage (track in coverage badge) |
| integration | ubuntu-latest | `flutter test integration_test` on Android emulator (search flow, publication download/open, chat send, subscribe) |
| build AAB | ubuntu-latest | `flutter build appbundle --release` (signing keystore as GH secret) → `app-release.aab` |
| build IPA | macos-latest | `flutter build ipa --release`; Fastlane Match for certs → `Runner.ipa` |
| beta | per-platform | Fastlane `supply` → Play internal track; Fastlane `pilot` → TestFlight (IT unit as testers) |
| prod | `workflow_dispatch` + env protection | Requires IT Unit head approval; promote internal → production |

### 9.2 Environment & signing

- Android: keystore + passwords as GH encrypted secrets; `key.properties` generated in CI.
- iOS: Fastlane Match against a private certs repo.
- App IDs: `ng.gov.niser.app` (recommend verifying Apple/Play developer accounts early — external dependency).
- Versioning: `pubspec.yaml` version + `--build-name/--build-number` from git tag; changelog auto-generated from commits.

### 9.3 Store readiness checklist (Phase M5)

- Privacy policy URL (reuse web `/privacy-policy`).
- Screenshots (6.5"/5.5"/7" + 10" tablets for Play; 6.7"/6.5"/5.5" for App Store), feature graphic, icon 1024×1024.
- App icon + adaptive icon (Material 3).
- Store listing copy (NISER branding).
- Content rating questionnaire (Play) + App Privacy "Nutrition Labels" (App Store).
- Data Safety form (Android) — no PII collected beyond consent; notification tokens listed.
- Test accounts not required (public read-only app).

---

## 10. Security, Observability & Compliance

| Concern | Approach |
|---------|----------|
| API base URL | Public read-only API; embed via `--dart-define`. No secrets in the app. |
| Minification | `flutter build --obfuscate --split-debug-info` for release builds |
| HTTPS + pinning | All traffic HTTPS; optional cert pinning via `dio` `BadCertificateCallback` guard (default: rely on OS trust store) |
| Error telemetry | Sentry Flutter SDK; user opt-in for diagnostics in Settings |
| Analytics | Matomo SDK (optional v1); NDPR cookie-less, aggregate only |
| NDPR | Consent flows for notifications; token storage anonymous; pref editable; privacy policy in-app |
| Data minimisation | Chat history local to device + Firestore session (clearable); no address book/photo access |
| App store compliance | No runtime permissions beyond notifications (and storage only for "Save offline" PDFs in post-MVP) |

---

## 11. Phased Delivery & Timeline

Estimated **10–12 weeks** for a 2-person Flutter team (1 senior + 1 mid) with backend support (0.2 FTE) for the new routes.

### Phase M0 — Foundation & backend enablers (Week 1–2)

- [x] Create `mobile/` Flutter project (Material 3, Riverpod, GoRouter, Dio, Hive, flutter_dotenv).
- [x] Backend: add `/api/events`, `/api/events/[slug]`, `/api/insights`, `/api/insights/[slug]`, `/api/news`, `/api/news/[slug]`, `/api/people`, `/api/people/[slug]`, `/api/publications/[slug]` (thin wrappers over `lib/cms/client.ts`).
- [x] Backend: add `/api/fcm-register` + `/api/fcm-unregister` (Firestore `device_tokens`).
- [x] Add cache headers for new GET routes in `middleware.ts` (reuse §6.2 patterns).
- [x] Scaffold all Dart models from `types/cms.ts` (manual null-safe `fromJson`, no codegen).
- [x] App shell: bottom nav (5 tabs), GoRouter with ShellRoute, theme from web palette, l10n skeleton (en).
- [x] CI: `flutter analyze` + `flutter test` job on PRs.

> **M0 status (2026-08-17)**: mobile/ scaffold created; `flutter analyze` clean; `flutter test` 19 passing. Note: models are hand-written (no freezed) to avoid a codegen step; the repository/provider/offline-cache layer (`data/repositories/*`, `core/storage/*`) is already in place ahead of M1.

### Phase M1 — Read-only content MVP (Week 3–5)

- [x] HomeScreen (news, events, insights, recommendations) with SWR caching.
- [x] Publications list + detail (filter, pagination, citation copy, DOI, PDF open via `open_filex`).
- [x] Researcher directory + profile (division filter, ORCID, contact via mailto).
- [x] Insights list + detail.
- [x] Events list (upcoming/past) + detail + iCal export to device calendar (`add_2_calendar`).
- [x] News list.
- [x] Search screen (keyword mode, filters, recent searches, grouped results).
- [x] Offline cache layer fully wired for all the above (Hive boxes + connectivity banner).
- [x] Unit + widget tests for repositories and core screens; integration test: search flow + publication open.

> **M1 status (2026-08-17)**: all read-only content flows implemented. 32 tests pass, `flutter analyze` clean. Note: insight/news bodies render as plain text (`bodyPlaintext`); HTML rendering deferred. `open_filex` is used for PDFs with a `url_launcher` browser fallback; iCal export via `add_2_calendar`; citation copy via clipboard. `add_2_calendar` on iOS needs `info_plist` calendar usage description before a device build (see §9.3).

### Phase M2 — Interactive features (Week 6–7)

- [x] Ask NISER chat: SSE client, cookie/identity persistence, streaming UI, sources panel, history + clear.
- [x] Newsletter subscribe (email + consent) via `/api/subscribe`.
- [x] Contact form via `/api/contact`.
- [x] Translation screen (Yoruba/Hausa/Igbo) via `/api/translate`.
- [x] Data catalogue + dataset detail + resource download via `/api/data`.
- [x] Sentry + Matomo instrumentation wired; offline/error banners.

> **M2 status:** All interactive features implemented — streaming Ask NISER chat with
> persisted session/visitor cookies and fingerprint identity, sources panel, history + clear;
> newsletter subscribe, contact form, Yoruba/Hausa/Igbo translation, and the data catalogue
> with detail + resource download. Sentry wired behind a `SENTRY_DSN` dart-define with global
> error handlers; Matomo already active from M1. 39 widget/unit tests passing, analyzer clean.
> (Matomo mobile pixel from M1 home banner remains the in-app analytics; M2 adds crash
> reporting only.)

### Phase M3 — Push notifications (Week 8)

- [x] firebase_messaging + flutter_local_notifications integration; permission flow on onboarding.
- [x] Token registration to `/api/fcm-register`; refresh handler.
- [x] Topic subscriptions + NotificationPrefsScreen (defaults publications+insights).
- [x] Foreground banner + deep-link navigation for background/terminated taps.
- [x] Policy alerts feed screen.
- [ ] Test: send test push via existing `/api/fcm` to a dev token; verify foreground/background/terminated on Android + iOS.

> **M3 status:** All code paths implemented. Firebase is configured entirely via
> `--dart-define` (`FIREBASE_API_KEY`, `FIREBASE_APP_ID`, `FIREBASE_MESSAGING_SENDER_ID`,
> `FIREBASE_PROJECT_ID`, `FIREBASE_IOS_BUNDLE_ID`) so the app builds and runs without
> `google-services.json`/`GoogleService-Info.plist`, and degrades to a no-op when the
> defines are absent. Features: foreground local notifications via `flutter_local_notifications`,
> background/terminated deep-link navigation via `PushNavigator` (payload → route mapping, buffered
> until the router attaches), `onTokenRefresh` re-registration, topic subscribe/unsubscribe + backend
> sync, `NotificationPrefsScreen` (defaults publications + insights), and a local in-app
> notification feed (Hive-backed, mark read / mark all read). The final checklist item is a manual
> device test — requires a build with Firebase credentials and a real FCM token; CI builds do not
> exercise the platform channels.

### Phase M4 — Polish & performance (Week 9)

- [x] Text scale + accessibility audit (WCAG AA per design doc §7.6/§9): contrast, semantics, touch targets ≥48px, screen-reader labels.
- [x] Performance budget: cold start < 2 s, no jank on mid-range devices; profile with Flutter DevTools; pagination & image lazy-loading. (Pagination + theme contrast done in code; DevTools profiling remains a manual device step.)
- [x] Deep-link registration (Android App Links via `assetlinks.json` hosted on niser.gov.ng; iOS Universal Links via `apple-app-site-association`). (Intent-filter + entitlements in app; hosting the association files is manual/ops.)
- [x] Android 13+/iOS notification runtime permission prompts verified. (Prompts wired; verification remains manual device step.)
- [ ] Full end-to-end device test pass (physical Android + iOS).

### Phase M5 — Release (Week 10–12)

- [x] Version bump, changelog, store assets (§9.3). (Version `1.0.0+1`, `CHANGELOG.md`, NISER-branded app icon — iOS icon set + Android adaptive/legacy, store listing copy + privacy/data-safety text in `store/`.)
- [x] Fastlane beta: Play internal track + TestFlight. (Fastlane lanes + Matchfile, release signing via `key.properties`/`build.gradle.kts`, `flutter.yml` CI with analyze/test/integration/AAB/IPA/beta/prod jobs.)
- [ ] UAT by NISER IT unit (2 weeks buffer).
- [ ] Production release after IT Unit head approval.
- [ ] Post-release: crash/analytics review, rate-limit tuning, store feedback loop.

> **M5 status (2026-08-18)**: code/release-automation deliverables done — version, changelog, branded icons, store copy, Fastlane, CI workflow, integration tests. Remaining items are external/manual: Apple & Play developer accounts + signing secrets, screenshots/feature graphic capture, integration tests against staging on an Android emulator, UAT, production promotion. 50 unit tests pass, `flutter analyze` clean.

### Post-MVP (backlog)

- Offline PDF download queue (max 500 MB, download manager per design doc §7.2).
- Flutter Web target (needs CORS work on backend).
- In-app bookmarking / "saved publications".
- Full AI features parity (policy brief generator, literature assistant read-only views).

---

## 12. Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R1 | WordPress CMS is the single source of truth and changes shape | Model decodes fail silently | Strict null-default decoding; contract tests; pin CMS API version; versioned models |
| R2 | Qdrant/Elasticsearch not deployed (backend gap) | Semantic search/chat sources degraded | Keyword-mode default; graceful "semantic unavailable" UI; monitor `/api/ai/status` |
| R3 | Chatbot rate limit (10/min/IP) hit by shared mobile IPs | Poor UX | Keep for MVP; raise + fingerprint-based limits post-launch; monitor 429s |
| R4 | Turnstile would block native clients if enabled | Chat 403 | Keep Turnstile off or add `x-client: niser-mobile` allow-path; decide before M2 |
| R5 | Store accounts/certificates not ready (external dependency) | Release slip | Start Apple/Play developer account setup in Week 1; Fastlane Match early |
| R6 | Offline cache grows unbounded | Disk bloat | Hive TTL + LRU (design doc §7.2); Settings → Clear cache; cap pub details at 20 |
| R7 | Backend `NEXT_PUBLIC_CMS_URL` unreachable from public internet | Blank screens | Verify public domain resolves to the WordPress API before M1; staging test |
| R8 | Cookie-based chat identity on native | Session resets | Use `cookiejar` on the app HTTP client; test history persistence on Android/iOS |
| R9 | NDPR/app-store review data-privacy scrutiny | Store rejection | Consent-first UX; anonymous tokens; privacy policy in-app; nutrition label accuracy |

---

## 13. Team & Resourcing

| Role | FTE | Responsibilities |
|------|-----|------------------|
| Flutter engineer (senior) | 1.0 | Architecture, screens, offline layer, push, release |
| Flutter engineer (mid) | 1.0 | Models, repositories, tests, store assets |
| Backend engineer | 0.2 | B1–B9 routes, middleware cache headers, FCM webhook |
| QA (IT unit) | part-time | UAT on physical devices, store checklist |

---

## 14. Definition of Done (per milestone)

- All screens render from live APIs (staging) with correct data.
- `flutter analyze` clean; unit tests ≥75% statement coverage; integration tests pass on Android emulator.
- Offline behaviour verified: cached content renders with airplane mode on.
- Push notifications verified on Android 13+ and iOS (foreground, background, terminated).
- NDPR consent flows visible and editable.
- CI green on `main`; beta builds installable by IT unit.

---

**Next step**: Approve this plan, then begin Phase M0 (scaffold + backend B1–B9 routes). The backend routes are the only hard dependency that must land before M1 screens can be wired to real JSON.