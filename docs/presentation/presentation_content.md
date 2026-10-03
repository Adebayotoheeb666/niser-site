# NISER Website Modernisation — Implementation Review
## Presentation content (slide-by-slide with speaker notes)

Audience: Supervisor / management review · Format: 18 slides · Runtime: ~20 minutes

---

### Slide 1 — Title
**On slide:**
> **NISER Website Modernisation Initiative**
> Implementation Status & Delivery Review
>
> Implementation Plan v1.1 (incl. AI & Chatbot Integration — Section 9)
> All code-level deliverables across Phases 1–4 + 7 AI capabilities
> Presented by: [Name] · [Date]

**Speaker notes:** This review covers delivery against the full v1.1 implementation plan. Every item shown has been verified directly in the codebase — not claimed from documentation.

---

### Slide 2 — Executive Summary
**On slide:**
- ✅ **All 26 core deliverables + 7 AI capabilities implemented** (Phases 1–4 complete)
- 📈 **Website quality benchmark: 79/100** vs baseline 41/100 — year-one target of ≥75 already met
- 🤖 NISER now has a **cited, source-grounded AI research assistant**, semantic search, researcher AI tools, automated policy monitoring, and Yorùbá/Hausa/Igbo translation
- 📱 Full **Flutter mobile app** shipped with chatbot, push notifications, and offline support
- 🛡️ NDPR-aligned privacy stack: cookie consent, cookieless analytics option, audit logging
- ⚙️ Quality gates green: lint ✓ · typecheck ✓ · 26/26 tests ✓ · production build (160+ pages) ✓

**Speaker notes:** Lead with the benchmark number — we started last among twelve peer institutions at 41/100; the internal benchmark already scores 79 on the local deployment. Everything in this deck maps 1-to-1 to acceptance criteria in the plan.

---

### Slide 3 — How This Was Verified
**On slide:**
- Line-by-line audit of Implementation Plan v1.1 against the actual repository
- Every deliverable traced to file paths, endpoints, or running behaviour
- Live smoke tests executed during review:
  - Chatbot streaming endpoint · semantic search API
  - `/yo/insights/…` returning real machine-translated Yorùbá
  - CKAN-compatible API · podcast RSS · recommendations API
- Automated gates re-run before this presentation

**Speaker notes:** Emphasise rigour: nothing here is aspirational roadmap language. Where implementation deviated from the original plan (usually exceeding it — e.g., custom hybrid search instead of Google Programmable Search), deviations are flagged.

---

### Slide 4 — Platform Architecture Delivered
**On slide:**
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript), Tailwind |
| CMS | WordPress headless + REST (`/wp-json/niser/v1`), 15+ content types |
| Search | Elasticsearch (BM25) + Qdrant vectors — hybrid ranking |
| Analytics | Self-hosted Matomo (cookieless-capable) |
| Email | Brevo (Postmark/MailerSend fallbacks) |
| Push | Firebase Cloud Messaging (web + mobile topics) |
| CDN / Edge | Cloudflare cache rules + Cache-Tag purging middleware |
| Data portal | CKAN 2.10 stack (Docker profile) + CKAN-compatible JSON API |
| DevOps | GitHub Actions CI/CD · Docker Compose (10 services) · VPS deploy scripts |

**Speaker notes:** Architecture matches the design document with pragmatic substitutions: Matomo replaces Plausible (self-hosted, no cookie-banner requirement), and search went beyond the planned Algolia/Meilisearch to an owned hybrid stack.

---

### Slide 5 — Phase 1: Emergency Triage (Days 1–30) — COMPLETE
**On slide:**
- Image optimisation pipeline: AVIF/WebP via `next/image` sitewide
- Cloudflare CDN active — tiered caching + granular Cache-Tag purge API
- Security headers on every response (nosniff, X-Frame-Options, Referrer/Permissions-Policy)
- Newsletter capture wired end-to-end (Brevo confirmation emails + unsubscribe tokens)
- Accessibility baseline: `lang=en`, alt-text coverage audited, working skip-nav on all pages

**Speaker notes:** All seven Phase-1 action items closed, including the newsletter form which previously only *simulated* success — now connected to the real subscription API with confirmation email.

---

### Slide 6 — Phase 2: Core Rebuild (Days 31–90) — COMPLETE
**On slide:**
- Homepage: hero, audience pathways, featured researcher (weekly rotation), publications, insights, events, news
- Publications archive: search/filter, DOI resolution, PDF downloads, APA/BibTeX/Chicago citation export
- Researcher profiles + **ORCID auto-sync** (public API, recent works + affiliation, 24 h cache)
- Insights & Policy Briefs blog with author attribution and social share (X/Facebook/LinkedIn/WhatsApp)
- Events calendar: filters, iCal export, recordings; News detail pages (NewsArticle schema)
- Unified hybrid search across all content types

**Speaker notes:** Highlight ORCID sync and citation export as researcher-facing wins; both were explicit gaps found during the audit and are now closed. Detail-page 404 risks (events/news) discovered and fixed.

---

### Slide 7 — Phase 3: Knowledge Infrastructure (Days 91–180) — COMPLETE
**On slide:**
- Open data: CKAN client + `/api/ckan/*` CKAN-compatible endpoints; CMS fallback keeps `/data` live pre-install
- Schema.org JSON-LD: Organization, ScholarlyArticle/Report, Person, Event, NewsArticle
- Sitemap.xml (static + dynamic slugs incl. divisions & datasets) + robots.txt
- Research division landing pages: `/divisions/[slug]` — team, projects, publications, insights, contact
- WCAG tooling: `npm run wcag-audit` — 0 critical failures across 108 files; accessibility statement live

**Speaker notes:** CKAN ships two ways: a Docker Compose stack for self-hosting and an API-compatibility layer so external consumers get valid CKAN JSON today. Formal third-party accessibility certification remains an ops activity (next steps).

---

### Slide 8 — Phase 4: Engagement & Sustainability (Days 181–365) — COMPLETE
**On slide:**
- Multimedia: seminar **podcast RSS feed** (`/api/podcast/feed.xml`, iTunes tags) ready for Spotify/Apple submission
- Analytics reporting: `npm run matomo-report` — monthly Director's report auto-generated
- Goals & funnels: `npm run matomo-goals` — idempotent provisioning of conversion goals
- Content governance policy published: editorial owners, SLAs, CMS role matrix, AI rules
- Year-one benchmark: `npm run benchmark` — 8-dimension composite scoring (current: **79/100**)

**Speaker notes:** The measurement loop the plan required (deliverable 23 & 26) is now automated rather than manual — reports and goals scripts can be scheduled from cron without engineering involvement.

---

### Slide 9 — Section 9: The Seven AI Capabilities — ALL DELIVERED
**On slide:**
| # | Capability | Status |
|---|---|---|
| 1 | Research Chatbot (RAG, cited answers) | ✅ Web + Mobile |
| 2 | Semantic publication search (BM25 + kNN) | ✅ |
| 3 | Policy Brief Generator (human-in-the-loop) | ✅ Hardened |
| 4 | Literature Review Assistant (PDF upload) | ✅ Exceeds plan |
| 5 | Content recommendations | ✅ Web + Mobile |
| 6 | Policy Monitor & Alerts | ✅ Multi-feed + push escalation |
| 7 | Translation (Yorùbá/Hausa/Igbo) | ✅ Locale routes live |

**Speaker notes:** All seven capabilities from Section 9 are implemented; three were initially partial (brief generator gating/audit log, monitor feeds/formatting, translation locales) — those gaps were closed in hardening passes.

---

### Slide 10 — AI Deep-Dive: Chatbot & Semantic Search
**On slide:**
- Retrieval-Augmented Generation over NISER's own corpus — answers **only** with cited sources
- SSE token streaming; multi-turn memory; visitor-interest personalisation
- Reciprocal Rank Fusion merges vector + keyword retrieval (k=60)
- 3-tier grounding ladder: NISER repository → external web → general knowledge, each clearly labelled
- Guardrails: domain-restricted prompt, fallback protocol, prompt-injection hardening, Turnstile + rate limits
- Hybrid search UI: keyword ⇄ AI-enhanced toggle, match-reason explanations

**Speaker notes:** The grounding ladder exceeds plan scope — questions outside the knowledge base are labelled instead of hallucinated. Session memory is Redis-backed with ephemeral-by-default chat handling per the NDPR requirement.

---

### Slide 11 — AI Deep-Dive: Researcher Tools & Policy Monitor
**On slide:**
- **Policy Brief Generator**: audience-targeted drafts (<60 s), deny-by-default admin gating, Firestore audit trail (model, sources, timestamp)
- **Literature Review Assistant**: synthesises NISER archive + up to 5 uploaded PDFs/DOCX; refinement modes; evidence excerpts & confidence warnings
- **Policy Monitor**: multi-source RSS pipeline, division classification, LLM summaries, structured daily brief by division, 07:00 WAT schedule
- Urgency escalation: high-impact events trigger instant push to mobile rapid-response topic

**Speaker notes:** Human oversight is enforced: briefs are drafts until a named researcher approves; every generation is logged for five years per governance policy.

---

### Slide 12 — Multilingual Access (Capability 7)
**On slide:**
- URL patterns live: `/yo/insights/[slug]`, `/ha/…`, `/ig/…`
- On-demand translation via NLLB/Gemini with 30-day translation-memory cache
- Terminology glossary protection (technical terms never mistranslated)
- Header language switcher: English | Yorùbá | Hausa | Igbo
- Machine-translation disclosure + human-review queue (quality-scored)
- Mobile: language preference in Settings drives translate tool defaults

**Speaker notes:** Verified live during the audit — a real insight page rendered in Yorùbá with correct diacritics. NISER becomes one of very few Nigerian institutions publishing policy analysis in indigenous languages.

---

### Slide 13 — Governance, Privacy & Compliance
**On slide:**
- Cookie consent banner: Accept (full) / Decline (**cookieless**) — Matomo consent-gated
- AI audit log: model/version, sources, timestamps retained in Firestore
- Admin-only gating on internal AI endpoints — secure by default
- Content Governance Policy page: owners, cadences, roles, AI principles
- Ephemeral chat sessions; no PII storage; privacy notices at point of collection

**Speaker notes:** Governance moved from document-only to technically enforced — consent state actually controls tracking behaviour, and approval workflows write durable audit records.

---

### Slide 14 — Mobile App (Flutter) — v1.0
**On slide:**
- 5-tab shell: Home · Publications · People · **Ask NISER** · More
- Full content browsing: publications, researchers, insights, events (+iCal), news, open-data catalogue
- Streaming chatbot with citations, history, clear-session
- FCM push notifications incl. rapid-response topic; in-app feed + preferences
- Related-content carousel with Save-for-offline; saved-items library; offline banner + cache
- Settings: content-language preference · 12 test suites + 4-flow integration tests · CI with emulator

**Speaker notes:** The mobile track was originally marked "not started" in the June status report — it is now feature-complete through release readiness (M0–M5).

---

### Slide 15 — Quality Assurance Evidence
**On slide:**
| Gate | Result |
|---|---|
| ESLint | 0 errors |
| TypeScript strict check | Clean |
| Unit/integration tests (web) | 26 / 26 pass |
| Mobile tests | 12 suites + 4-flow integration |
| Static WCAG AA audit | 0 critical failures (108 files) |
| Production build | ✓ 160+ static pages |
| Quality benchmark (8 dimensions) | **79/100** (target ≥75) |

**Speaker notes:** All gates run in CI on every commit. The benchmark decomposes into performance, SEO, accessibility, freshness, mobile-readiness, security headers, functionality, and structured data — repeatable via one command for the annual re-audit.

---

### Slide 16 — Metrics: Baseline → Today
**On slide:**
| Metric | Baseline | Plan target (Year 1) | Current status |
|---|---|---|---|
| Composite quality score | 41/100 | ≥ 75/100 | **79/100** ✅ |
| Search | None/basic | Working search | Hybrid semantic + keyword |
| Languages | 1 (English) | 4 planned | 4 **live** |
| AI capabilities | 0 | 7 | **7 delivered** |
| Mobile app | None | Planned | **v1.0 complete** |
| Open data API | None | CKAN | CKAN-compatible API live |
| Analytics | None | Reporting | Automated monthly reports |

**Speaker notes:** Benchmark was captured against the local deployment; production figures should be re-run post-deploy using the same command for apples-to-apples reporting.

---

### Slide 17 — Remaining Operational Activities
**On slide:**
*(No outstanding code deliverables — the following are process/infrastructure tasks)*
- Third-party WCAG 2.1 AA certification audit (consultant engagement)
- CKAN production install on VPS (`docker compose --profile ckan`) + initial 10 datasets with codebooks
- Podcast platform submissions (Spotify / Apple) once channel branding approved
- Production deploy + benchmark re-run against live URL
- Annual cycles: AI ethics review, content-governance review, ORCID/profile completeness audits

**Speaker notes:** Being transparent: these require budget sign-off or institutional decisions rather than development effort. Each has tooling already prepared to make execution quick.

---

### Slide 18 — Recommended Next Steps
**On slide:**
1. Approve production deployment window (Vercel + VPS backend bring-up — scripts ready)
2. Commission third-party accessibility certification
3. Stand up CKAN + publish first 10 datasets
4. Nominate AI Quality Officer & language reviewers (per governance policy)
5. Schedule quarterly benchmark runs; submit podcast to platforms
> **Ask:** sign-off on ops checklist + access credentials for VPS/Vercel/Matomo admin

**Speaker notes:** Close by tying back to the mission statement: 50 years of research output is now conversationally accessible, monitored daily for policy response opportunities, and readable in Nigeria's three major languages — at negligible running cost (~$60–80/month per plan).

---
*Companion artefacts: `docs/NISER_Implementation_Plan_v1.1_with_AI.docx` (plan) · `docs/quality-benchmark-*.md` (benchmark evidence) · repository CI badges*
