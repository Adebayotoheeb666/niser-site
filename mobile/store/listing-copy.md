# NISER Mobile — Store listing assets & copy

Prepared for Play Store and App Store submission (Phase M5 / §9.3 of the implementation plan).
All copy below is NISER-branded and ready to paste. Manual steps (screenshots, feature
graphic, account setup) are listed at the end.

## App identity

- **Name**: NISER
- **Package ID (Android)**: `ng.gov.niser.app`
- **Bundle ID (iOS)**: `ng.gov.niser.app`
- **Version**: 1.0.0 (build 1)
- **Category**: Education / Government services
- **App icon**: `store_assets/app_icon_1024.png` (1024×1024, no alpha)
  - Android adaptive icon already configured in `android/app/src/main/res`
  - iOS icon set already configured in `ios/Runner/Assets.xcassets/AppIcon.appiconset`

## Short description (Play Store)

Official app for the Nigerian Institute of Social and Economic Research (NISER) — research,
publications, events and news on demand.

## Full description (Play Store / App Store)

The Nigerian Institute of Social and Economic Research (NISER) is Nigeria’s leading institute
for social and economic research. The official NISER app brings the institute to your pocket:

- **Publications** — browse and open the institute’s working papers and research outputs,
  copy citations, and view DOIs.
- **Researchers** — explore the NISER researcher directory, divisions and ORCID profiles.
- **Insights & News** — the latest policy briefs, insights and institute announcements.
- **Events** — upcoming and past seminars, conferences and workshops, with one-tap
  calendar export.
- **Ask NISER** — an in-app assistant that answers with references to institute research.
- **Open data** — explore NISER datasets and metadata.
- **Notifications** — opt-in alerts for new publications and research highlights.

**Translate** key sections into Yoruba, Igbo and Hausa. Works offline for previously
viewed content.

## Keywords (App Store)

NISER, Nigeria, research, economics, social science, policy, publications, events, news,
institute, Ibadan.

## Privacy policy URL

https://niser.gov.ng/privacy-policy

## Data safety / privacy disclosures

- No account required; the app is public read-only.
- Notifications: consent-based; device tokens are stored anonymously for alert delivery.
- Chat history stays on the device unless the user consents to session storage; clearable
  from Settings.
- No PII collected beyond the consent flows (newsletter email, contact form) already
  covered by the web privacy policy.

## Content rating

- Play Store questionnaire: Education; no violence, mature content or user-generated content.
- App Store privacy "nutrition labels": Data Not Collected / Data Used to Track You: none.

## Manual checklist (needs accounts + hardware)

- [ ] Apple & Play developer accounts (App IDs verified: `ng.gov.niser.app`).
- [ ] Screenshots:
  - Play: 6.5"/5.5"/7" phone + 10" tablet (min 3200px short edge).
  - App Store: 6.7"/6.5"/5.5" (1290×2796 / 1179×2556 / 1242×2688).
- [ ] Feature graphic (Play, 1024×500) + promotional text.
- [ ] Signing: Fastlane Match certs (iOS) + Play upload key (Android) as GH secrets.
- [ ] Submit to Play internal track + TestFlight; then production after IT Unit head approval.