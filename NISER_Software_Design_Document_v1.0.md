**SOFTWARE DESIGN DOCUMENT**

**NISER Digital Platform**

Web · Mobile · AI Integration

Nigeria Institute of Social and Economic Research (NISER)

niser.gov.ng · Ibadan, Oyo State, Nigeria

+-----------------+-----------------+-----------------+-----------------+
| Document type   | Version         | Date            | Classification  |
|                 |                 |                 |                 |
| **Software      | **1.0**         | **June 2026**   | **Internal**    |
| Design          |                 |                 |                 |
| Document**      |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

+-----------+----------+-----------+-----------+----------+-----------+
| Platform  | Frontend | Mobile    | AI        | CMS      | Hosting   |
|           |          |           | Features  |          |           |
| **Web +   | *        | **        |           | *        | **In      |
| Mobile**  | *Next.js | Flutter** | **7**     | *Payload | terServer |
|           | 14**     |           |           | CMS**    | +Vercel** |
+-----------+----------+-----------+-----------+----------+-----------+

# **1. Introduction**

## **1.1 Purpose of this Document**

This Software Design Document (SDD) specifies the complete technical
architecture, data models, API contracts, component designs, integration
specifications, and deployment topology for the NISER Digital Platform
--- the modernised website, mobile application, and AI-powered knowledge
tools of the Nigeria Institute of Social and Economic Research (NISER),
Ibadan, Nigeria.

The document is intended for: software developers building the platform;
the NISER IT Unit responsible for hosting and operations; third-party
contractors engaged via the procurement RFP; and NISER leadership
reviewing the technical approach for institutional approval.

## **1.2 Scope**

The NISER Digital Platform comprises four interconnected systems:

  --------------- ------------------ ---------------------------------------
  **System**      **Technology**     **Scope**

  **Web           Next.js 14 (App    Public-facing website at niser.gov.ng
  Platform**      Router)            --- publications, researcher profiles,
                                     events, policy briefs, open data
                                     browser, AI chatbot

  **Mobile        Flutter (Dart)     iOS and Android apps on respective app
  Application**                      stores --- full feature parity with web
                                     plus push notifications and offline
                                     access

  **Content       Payload CMS        Headless CMS providing structured
  Management      (Wordpress)        content via REST and GraphQL APIs
  System**                           consumed by both web and mobile

  **AI Services   RAG, LLMs,         Seven AI-powered capabilities including
  Layer**         Elasticsearch      research chatbot, semantic search,
                                     policy brief generator, and
                                     multilingual translation
  --------------- ------------------ ---------------------------------------

## **1.3 Definitions and Abbreviations**

  --------------- -------------------------------------------------------
  **Term**        **Definition**

  SDD             Software Design Document --- this document

  CMS             Content Management System --- Payload CMS in this
                  platform

  RAG             Retrieval-Augmented Generation --- AI pattern that
                  grounds LLM responses in retrieved source documents

  LLM             Large Language Model --- AI model that generates text
                  (Claude, Llama 3, GPT-4o)

  SSG             Static Site Generation --- Next.js renders pages to
                  static HTML at build time

  ISR             Incremental Static Regeneration --- Next.js rebuilds
                  individual pages on demand via webhook

  SSE             Server-Sent Events --- HTTP streaming protocol used for
                  chatbot token-by-token response

  FCM             Firebase Cloud Messaging --- push notification delivery
                  for Android and iOS

  ORCID           Open Researcher and Contributor ID --- persistent
                  digital identifier for researchers

  CKAN            Comprehensive Knowledge Archive Network --- open-source
                  data portal platform

  NLLB            No Language Left Behind --- Meta open-source
                  multilingual translation model

  NDPR            Nigeria Data Protection Regulation 2023

  WCAG            Web Content Accessibility Guidelines --- international
                  accessibility standard

  DOI             Digital Object Identifier --- persistent identifier for
                  academic publications

  VPS             Virtual Private Server --- InterServer Linux server
                  running CMS and AI services

  CDN             Content Delivery Network --- Cloudflare edge caching
                  layer

  BM25            Best Match 25 --- traditional keyword relevance scoring
                  algorithm

  kNN             k-Nearest Neighbours --- vector similarity search
                  algorithm used in semantic search
  --------------- -------------------------------------------------------

## **1.4 Document Conventions**

**Blue heading text**

-   Section or subsection heading (architectural context)

```{=html}
<!-- -->
```
-   Teal monospace text --- file paths, code identifiers, API routes,
    environment variable names

-   Tables with green header rows --- data schemas, API contracts

-   Tables with navy header rows --- design specifications, comparisons

-   Amber headings --- sub-component or implementation detail level

# **2. System Overview**

## **2.1 High-Level Architecture**

The NISER platform uses a **decoupled (headless) architecture** in which
the content management system, the public web frontend, the mobile
application, and the AI services layer are independent systems that
communicate via well-defined APIs. This separation enables each layer to
be deployed, scaled, and updated independently.

  -------------------- -------------------- ------------------------ -------------------
  **Layer**            **System**           **Technology**           **Hosting**

  **Client --- Web**   **Next.js 14 Public  React 19, Tailwind CSS   Vercel global edge
                       Website**            v4, shadcn/ui            network

  **Client ---         **Flutter            Dart 3, Material 3,      Google Play Store +
  Mobile**             Application**        Riverpod                 Apple App Store

  **API --- Content**  **Payload CMS**      Wordpress, TypeScript,   InterServer VPS
                                            PostgreSQL               (Nginx + PM2)

  **API --- Search**   **Elasticsearch 8**  Lucene BM25 + kNN vector InterServer VPS
                                            search                   

  **API --- AI         **RAG Pipeline + LLM Qdrant,                  InterServer VPS
  Services**           Gateway**            sentence-transformers,   (+GPU add-on)
                                            Ollama                   

  **API --- Open       **CKAN 2.10**        Python, PostgreSQL, Solr InterServer
  Data**                                                             subdomain VPS

  **Infrastructure**   **Cloudflare CDN**   Edge caching, DDoS       Cloudflare free
                                            protection, HTTPS        tier

  **Infrastructure**   **Firebase**         Cloud Messaging (push    Google Cloud (free
                                            notifications)           tier)

  **Monitoring**       **Matomo Analytics** PHP, MySQL               InterServer VPS

  **Monitoring**       **Sentry**           Error tracking for web + Sentry cloud free
                                            mobile                   tier
  -------------------- -------------------- ------------------------ -------------------

## **2.2 Architecture Decision Records (ADR)**

The following table records the key architectural decisions, their
rationale, and the alternatives that were considered.

  ------------ ------------------ ---------------------- ---------------------------
  **ADR**      **Decision**       **Rationale**          **Alternative considered**

  **ADR-01**   **Next.js 14 for   SSG/ISR provides       Flutter Web --- rejected
               web frontend**     best-in-class SEO for  due to canvas rendering
                                  academic publication   that degrades SEO and large
                                  discovery. Server      initial bundle size (\~2MB)
                                  Components reduce JS   
                                  bundle. Vercel         
                                  deployment is          
                                  zero-config.           

  **ADR-02**   **Flutter for      Single Dart codebase   React Native --- comparable
               mobile app**       for Android and iOS.   but inferior offline
                                  Native performance     storage; Kotlin/Swift
                                  (60/120fps Impeller    native --- too expensive
                                  engine). Offline-first for two separate codebases
                                  with Hive cache. Best  
                                  Flutter ecosystem      
                                  support.               

  **ADR-03**   **Payload CMS as   TypeScript-native,     WordPress headless ---
               headless backend** REST+GraphQL with no   heavier PHP dependency,
                                  plugins, role-based    plugin maintenance
                                  access, runs on same   overhead; Contentful ---
                                  Node.js VPS as AI      vendor lock-in, high cost
                                  services. Modern admin at scale
                                  UI.                    

  **ADR-04**   **Elasticsearch    Supports hybrid BM25 + Algolia --- per-query cost
               for search**       kNN vector search in   at scale; Meilisearch ---
                                  one engine. Scales to  insufficient vector search
                                  100k+ documents. Rich  capability for RAG
                                  aggregations for       integration
                                  faceted filtering.     
                                  Kibana analytics.      

  **ADR-05**   **Qdrant for       Purpose-built for      Pinecone --- vendor
               vector database**  dense vector search.   lock-in, cost; pgvector on
                                  Self-hosted.           PostgreSQL --- adequate but
                                  Payload-efficient      slower for high-frequency
                                  (supports named        chatbot queries
                                  vectors). Fast at      
                                  NISER\'s document      
                                  scale.                 

  **ADR-06**   **InterServer VPS  Price-lock guarantee.  Render.com --- limited root
               for backend**      Full root access for   access; AWS EC2 --- more
                                  AI model hosting,      expensive, no price-lock
                                  CKAN, Matomo,          
                                  Elasticsearch. No      
                                  per-request pricing    
                                  surprises.             

  **ADR-07**   **Matomo for       100% data sovereignty  Google Analytics 4 --- data
               analytics**        on NISER\'s server.    leaves Nigeria; Plausible
                                  NDPR compliant without --- insufficient feature
                                  cookie banner.         depth for AI interaction
                                  Heatmaps and goals     analytics
                                  included free.         

  **ADR-08**   **RAG over         RAG is updatable in    Fine-tuned BERT/GPT --- too
               fine-tuning for    real-time as CMS       costly to maintain; keyword
               chatbot**          content changes.       FAQ bot --- insufficient
                                  Fine-tuning requires   for complex research
                                  expensive retraining   queries
                                  on every publication   
                                  update. RAG citations  
                                  are traceable.         
  ------------ ------------------ ---------------------- ---------------------------

# **3. Component Architecture**

## **3.1 Next.js Web Application**

### **3.1.1 Project Directory Structure**

  --------------------------------------------- -------------------------------------------
  **Path**                                      **Contents and responsibility**

  app/                                          Next.js App Router root --- all pages,
                                                layouts, and API routes

  app/(public)/                                 Route group for all publicly accessible
                                                pages (no auth required)

  app/(public)/page.tsx                         Homepage --- server component fetching
                                                hero, latest publications, events

  app/(public)/publications/page.tsx            Publications archive with SSG +
                                                Elasticsearch-powered client-side filter

  app/(public)/publications/\[slug\]/page.tsx   Individual publication detail page --- SSG
                                                with ISR webhook revalidation

  app/(public)/people/page.tsx                  Researcher directory --- SSG, division
                                                filter, expertise search

  app/(public)/people/\[slug\]/page.tsx         Researcher profile --- SSG with ORCID
                                                auto-pull, publications list

  app/(public)/insights/page.tsx                NISER Perspectives blog index --- ISR 6hr

  app/(public)/insights/\[slug\]/page.tsx       Individual blog/policy brief post --- ISR
                                                6hr

  app/(public)/data/page.tsx                    Open data catalogue --- CKAN API, ISR 24hr

  app/(public)/data/\[id\]/page.tsx             Dataset detail page --- CKAN metadata,
                                                preview, download links

  app/(public)/events/page.tsx                  Events calendar --- ISR 1hr, upcoming/past
                                                tabs

  app/(public)/search/page.tsx                  Unified search --- client-side
                                                Elasticsearch query with semantic toggle

  app/api/chatbot/route.ts                      Streaming SSE endpoint --- RAG pipeline →
                                                LLM → token stream to client

  app/api/embed/route.ts                        Webhook from Payload CMS --- generates
                                                embeddings, upserts to Qdrant

  app/api/revalidate/route.ts                   Payload CMS publish webhook --- triggers
                                                ISR for affected page

  app/api/subscribe/route.ts                    Newsletter subscribe --- validates email,
                                                calls Brevo/MailerSend API

  app/api/policy-brief/route.ts                 Internal (auth-gated) --- Claude API policy
                                                brief draft generator

  app/api/translate/route.ts                    Internal --- NLLB translation API proxy

  app/api/policy-monitor/route.ts               Cron-triggered daily --- RSS fetch,
                                                classify, summarise, email

  components/ui/                                shadcn/ui primitives --- Button, Card,
                                                Badge, Input, Dialog, Sheet, etc.

  components/layout/                            Header, Footer, MobileNav, Breadcrumb,
                                                SearchModal, ThemeProvider

  components/publications/                      PublicationCard, PublicationFilter,
                                                CitationExport, DOIBadge

  components/researchers/                       ResearcherCard, ProfileHeader, ORCIDSync,
                                                PublicationsList

  components/chatbot/                           ChatWidget, ChatMessage, SourceCitations,
                                                ChatTypingIndicator

  components/search/                            SearchBar, SearchResults, FacetFilter,
                                                SemanticToggle

  components/recommendations/                   RelatedContent, ContentCarousel

  components/insights/                          PostCard, PostBody, AuthorBio, ShareButtons

  lib/cms/                                      Payload CMS REST/GraphQL API client and
                                                content type fetchers

  lib/search/                                   Elasticsearch client, index config, query
                                                builders, facet helpers

  lib/ai/rag.ts                                 RAG pipeline orchestrator --- query embed →
                                                Qdrant retrieve → LLM prompt

  lib/ai/qdrant.ts                              Qdrant client --- upsert, query, delete
                                                vector operations

  lib/ai/embeddings.ts                          sentence-transformers API wrapper ---
                                                document and query embedding

  lib/ai/llm.ts                                 LLM provider adapter --- swappable
                                                Claude/GPT-4o/Llama3 endpoint

  lib/ai/policy-monitor.ts                      RSS parser, relevance classifier, brief
                                                formatter

  lib/ai/translate.ts                           NLLB model API client for Yoruba, Hausa,
                                                Igbo

  lib/ckan.ts                                   CKAN REST API client --- dataset catalogue
                                                and download links

  lib/orcid.ts                                  ORCID Public API client --- researcher
                                                publication auto-sync

  lib/brevo.ts                                  Brevo email API --- newsletter subscribe,
                                                digest trigger

  lib/matomo.ts                                 Matomo server-side event tracking
                                                (pageviews, chatbot interactions)

  lib/schema.ts                                 Schema.org JSON-LD builders for all content
                                                types

  types/                                        TypeScript interfaces for all Payload CMS
                                                content types + API responses

  public/                                       Static assets --- logos, favicons,
                                                og-default.png, robots.txt, sitemap.xml

  styles/                                       Tailwind globals + CSS custom properties
                                                for NISER brand tokens

  .github/workflows/                            CI: lint, type-check, Lighthouse CI budget,
                                                test, deploy
  --------------------------------------------- -------------------------------------------

### **3.1.2 Page Routing and Render Strategy**

  ------------------------ ------------- ---------------- --------------------
  **Route**                **Render      **Revalidate**   **Data source**
                           mode**                         

  /                        **ISR**       3600s (1hr)      Payload CMS ---
                                                          latest 5
                                                          publications, 3
                                                          events, 3 insights

  /publications            **SSG +       On publish       Payload CMS full
                           client**      webhook          index; Elasticsearch
                                                          for filter/search

  /publications/\[slug\]   **SSG**       On publish       Payload CMS single
                                         webhook          publication

  /people                  **SSG**       On publish       Payload CMS all
                                         webhook          researchers

  /people/\[slug\]         **SSG**       On publish       Payload CMS + ORCID
                                         webhook          API

  /insights                **ISR**       21600s (6hr)     Payload CMS latest
                                                          insights

  /insights/\[slug\]       **ISR**       21600s (6hr)     Payload CMS single
                                                          insight

  /data                    **ISR**       86400s (24hr)    CKAN API
                                                          package_search

  /data/\[id\]             **ISR**       86400s (24hr)    CKAN API
                                                          package_show

  /events                  **ISR**       3600s (1hr)      Payload CMS events
                                                          ordered by date

  /events/\[slug\]         **SSG**       On publish       Payload CMS single
                                         webhook          event

  /news                    **ISR**       7200s (2hr)      Payload CMS news
                                                          items

  /search                  **Static      ---              Client-side
                           shell**                        Elasticsearch query
                                                          via /api/search

  /about                   **SSG**       On publish       Payload CMS static
                                         webhook          page

  /about/tenders           **ISR**       86400s (24hr)    Payload CMS
                                                          procurement notices

  /about/accessibility     **SSG**       On publish       Payload CMS static
                                         webhook          page
  ------------------------ ------------- ---------------- --------------------

## **3.2 Flutter Mobile Application**

### **3.2.1 Project Directory Structure**

  ---------------------------------------- -------------------------------------------
  **Path**                                 **Contents and responsibility**

  lib/main.dart                            App entry point --- ProviderScope, GoRouter
                                           config, Firebase init, theme

  lib/app/router.dart                      GoRouter configuration --- all named
                                           routes, deep link handling, auth guards

  lib/app/theme.dart                       Material 3 ColorScheme from NISER brand
                                           tokens, typography scale, dark mode

  lib/features/home/                       HomeScreen, NewsFeedWidget,
                                           FeaturedPublicationCard, EventsPreview

  lib/features/publications/               PublicationsScreen,
                                           PublicationDetailScreen,
                                           CitationExportSheet, PDFViewer

  lib/features/researchers/                ResearcherDirectoryScreen,
                                           ResearcherProfileScreen, ORCIDLinksWidget

  lib/features/insights/                   InsightsScreen, PostDetailScreen,
                                           AuthorCard, ShareBottomSheet

  lib/features/search/                     SearchScreen, ResultsList,
                                           FacetFilterSheet, SemanticModeToggle

  lib/features/events/                     EventsScreen, EventDetailScreen,
                                           CalendarExportButton, RegistrationWebView

  lib/features/data/                       DataCatalogueScreen, DatasetDetailScreen,
                                           TablePreview, DownloadSheet

  lib/features/chatbot/                    ChatScreen, MessageBubble,
                                           SourceCitationCard, ChatInputBar

  lib/features/notifications/              NotificationInbox, NotificationPrefsScreen

  lib/features/settings/                   SettingsScreen, LanguageSelector,
                                           TextSizeSlider, OfflineDownloads

  lib/features/about/                      AboutScreen, DivisionCard, ContactScreen

  lib/domain/models/                       Dart data classes for Publication,
                                           Researcher, Insight, Event, Dataset,
                                           Message

  lib/domain/repositories/                 Abstract repository interfaces ---
                                           PublicationRepo, SearchRepo, ChatbotRepo

  lib/domain/usecases/                     Business logic --- FetchPublications,
                                           SearchContent, SendMessage, DownloadPDF

  lib/data/remote/                         API clients --- PayloadApiClient,
                                           ElasticsearchClient, CKANClient,
                                           ChatbotClient

  lib/data/local/                          Hive boxes for offline cache, Drift
                                           database for structured local data

  lib/data/repositories/                   Concrete implementations of domain
                                           repository interfaces

  lib/services/fcm_service.dart            Firebase Cloud Messaging setup,
                                           notification routing, permission request

  lib/services/matomo_service.dart         Matomo analytics event tracking --- screen
                                           views, chatbot queries, downloads

  lib/services/connectivity_service.dart   Network status monitoring ---
                                           online/offline mode switching

  lib/providers/                           Riverpod providers for all features ---
                                           state, async data, theme, locale

  test/unit/                               Unit tests for use cases and repositories

  test/widget/                             Widget tests for all screens and key
                                           components

  test/integration/                        Integration tests covering critical user
                                           flows
  ---------------------------------------- -------------------------------------------

### **3.2.2 State Management Architecture (Riverpod)**

All state in the Flutter app is managed via **Riverpod 2.x** using the
code generation pattern (@riverpod annotation). The following provider
categories are used:

  ------------------ ------------------------------ ----------------------------------
  **Provider type**  **Riverpod class**             **Used for**

  **Async data**     AsyncNotifierProvider          Publications list, researcher
                                                    profiles, search results, events
                                                    --- data fetched from API

  **Stream**         StreamProvider                 Chat message stream from SSE
                                                    endpoint --- token-by-token
                                                    chatbot response

  **Sync state**     NotifierProvider               Selected filters, current
                                                    language, offline mode flag, theme
                                                    mode

  **Simple value**   Provider                       App router, Payload API client,
                                                    Elasticsearch client (singleton
                                                    services)

  **Family**         AsyncNotifierProvider.family   Single publication by slug, single
                                                    researcher by slug, single dataset
                                                    by ID

  **Auto-dispose**   \@riverpod (autoDispose)       Search results, form state ---
                                                    disposed when screen is popped
                                                    from router
  ------------------ ------------------------------ ----------------------------------

## **3.3 Payload CMS**

### **3.3.1 CMS Architecture**

Payload CMS runs as a Node.js 20 + TypeScript application on the
InterServer VPS. It serves two functions: (1) a visual admin panel at
https://cms.niser.gov.ng/admin for content editors, and (2) a headless
REST and GraphQL API consumed by the Next.js web app and the Flutter
mobile app. PostgreSQL 15 (via Neon or local Postgres) is the primary
data store.

  -------------------- ----------------------------------------------------
  **Component**        **Detail**

  **REST API base      \[object Object\] --- all content types
  URL**                auto-generate CRUD endpoints

  **GraphQL endpoint** \[object Object\] --- flexible query for nested data
                       (publications with authors, researchers with
                       projects)

  **Webhook outgoing** On publish, Payload fires POST webhooks to: (1)
                       Next.js /api/revalidate (ISR), (2) /api/embed
                       (vector indexing), (3) Next.js /api/policy-monitor
                       if flagged as breaking

  **Authentication**   JWT-based. CMS admin uses local strategy. API access
                       uses API keys stored as environment variables on
                       Vercel and the Flutter app build config.

  **Media storage**    Cloudinary (free tier) for images. PDF files stored
                       on InterServer VPS in /var/www/niser-files/ served
                       via Nginx. File URLs stored as strings in Payload.

  **Roles**            Administrator (IT Unit), Editor (Communications
                       Officer), Author (Researchers --- own content only),
                       Contributor (draft only, no media upload)

  **Background jobs**  Payload tasks API --- used for ORCID sync (weekly),
                       newsletter digest prep, and search index rebuild if
                       needed
  -------------------- ----------------------------------------------------

# **4. Data Model**

All content types are defined as Payload CMS Collections. Each
collection auto-generates REST endpoints, GraphQL types, admin UI, and
TypeScript interfaces. The following tables define the complete field
schema for each collection.

## **4.1 Collection: Publication**

  --------------------- ------------------ -------------- --------------------------------------
  **Field name**        **Type**           **Required**   **Notes**

  id                    UUID               **Auto**       Auto-generated by Payload CMS

  title                 Text               **Yes**        Full publication title. Max 500 chars.
                                                          Indexed in Elasticsearch.

  slug                  Text               **Auto**       URL-safe kebab-case from title.
                                                          Unique. e.g.
                                                          niser-wp-2024-03-poverty-measurement

  publicationType       Select             **Yes**        working_paper \| policy_brief \|
                                                          journal_article \| book_chapter \|
                                                          annual_report \| conference_paper

  authors               Relationship\[\]   **Yes**        One or more relationships to
                                                          Researcher collection. Used in
                                                          profiles and search.

  researchDivision      Select             **Yes**        macroeconomics \| poverty_social \|
                                                          agriculture \| governance \| industry

  abstract              Textarea           **Yes**        300--600 words. Indexed in
                                                          Elasticsearch and vectorised for RAG.

  keywords              Array\[Text\]      **No**         Free-form tags. Max 10. Used as
                                                          Elasticsearch keyword filter facet.

  publishedYear         Number             **Yes**        4-digit year of original publication
                                                          (not upload date). Used in sort and
                                                          filter.

  doi                   Text               **No**         Digital Object Identifier string.
                                                          Validated against pattern. Linked to
                                                          https://doi.org/{doi}.

  pdfFile               Upload             **Yes**        PDF stored on InterServer. URL
                                                          referenced here. Max 50MB.

  featuredImage         Upload             **No**         1200×630px for OG meta and publication
                                                          card. WebP preferred.

  isOpenAccess          Checkbox           **Yes**        Boolean. Controls open access badge
                                                          display. Default: true.

  citationCount         Number             **No**         Updated quarterly by admin. Displayed
                                                          on publication card.

  relatedPublications   Relationship\[\]   **No**         Up to 5 manually curated related
                                                          publications. Used in recommendations
                                                          before AI.

  relatedContent        JSON               **Auto**       Pre-computed by /api/embed webhook.
                                                          Stores top-10 Qdrant nearest neighbour
                                                          IDs.

  orcidDerivedId        Text               **No**         If imported via ORCID sync --- stores
                                                          original ORCID work ID to prevent
                                                          duplicate import.

  notifySubscribers     Checkbox           **No**         If checked, webhook fires newsletter
                                                          notification on publish. Default:
                                                          false.

  status                Select             **Yes**        draft \| review \| published. Only
                                                          published items appear on public site.

  publishedAt           Date               **Auto**       Timestamp of first publish action.

  updatedAt             Date               **Auto**       Last update timestamp.
  --------------------- ------------------ -------------- --------------------------------------

## **4.2 Collection: Researcher**

  ---------------------- ------------------ -------------- ------------------------------------
  **Field**              **Type**           **Required**   **Notes**

  id                     UUID               **Auto**       

  fullName               Text               **Yes**        Display name. Indexed in
                                                           Elasticsearch.

  slug                   Text               **Auto**       URL-safe from fullName. Unique.

  titlePrefix            Select             **No**         Prof \| Dr \| Mr \| Mrs \| Ms

  position               Text               **Yes**        e.g., Research Fellow, Senior
                                                           Researcher, Director of Research

  division               Select             **Yes**        Maps to researchDivision enum on
                                                           Publication.

  photo                  Upload             **No**         400×400px minimum. WebP. Stored on
                                                           InterServer.

  biography              RichText           **Yes**        300--500 words. Stored as Lexical
                                                           JSON. Rendered via
                                                           \@payloadcms/richtext-lexical.

  researchInterests      Array\[Text\]      **No**         Free-form keywords. Max 15.
                                                           Displayed as chips on profile page.

  orcid                  Text               **No**         ORCID iD --- validated format
                                                           0000-0000-0000-0000. Triggers weekly
                                                           sync via Payload task.

  googleScholar          Text               **No**         Full URL to Google Scholar profile.

  researchGate           Text               **No**         Full URL to ResearchGate profile.

  email                  Email              **No**         Stored in Payload but rendered
                                                           obfuscated (rot13 + JS decode) to
                                                           reduce spam harvesting.

  phone                  Text               **No**         Optional. Not displayed publicly
                                                           unless Researcher explicitly opts in
                                                           via boolean field.

  activeProjects         Relationship\[\]   **No**         Up to 5 relationships to Project
                                                           collection (future feature).

  selectedPublications   Relationship\[\]   **No**         Manually curated. Up to 5
                                                           publications shown prominently on
                                                           profile.

  orcidPublications      JSON               **Auto**       Array of publication metadata
                                                           auto-fetched from ORCID Public API
                                                           weekly.

  isActive               Checkbox           **Yes**        True if current staff. False if
                                                           former researcher --- profile hidden
                                                           from directory but not deleted.

  status                 Select             **Yes**        draft \| published
  ---------------------- ------------------ -------------- ------------------------------------

## **4.3 Collection: Insight (Policy Brief / Commentary)**

  --------------------- ------------------ -------------- ------------------------------------
  **Field**             **Type**           **Required**   **Notes**

  id                    UUID               **Auto**       

  title                 Text               **Yes**        Headline. Max 200 chars. Indexed in
                                                          Elasticsearch.

  slug                  Text               **Auto**       

  contentType           Select             **Yes**        policy_brief \| commentary \|
                                                          analysis \| opinion \|
                                                          rapid_response

  author                Relationship       **Yes**        Single Researcher. Displayed with
                                                          photo and bio snippet.

  publishedDate         Date               **Yes**        Date of first publication --- may
                                                          differ from upload date.

  body                  RichText           **Yes**        MDX-compatible Lexical rich text ---
                                                          supports inline charts, callouts,
                                                          footnotes, code blocks.

  bodyPlaintext         Text               **Auto**       Stripped plaintext of body for
                                                          Elasticsearch indexing and vector
                                                          embedding.

  pdfVersion            Upload             **No**         Optional PDF rendition for download.
                                                          Stored on InterServer.

  relatedPublications   Relationship\[\]   **No**         Up to 3 supporting working papers.

  socialSummary         Text               **No**         160 chars max. Used for newsletter
                                                          excerpt, Twitter/X meta card.

  featuredImage         Upload             **No**         1200×630px for OG meta.

  tags                  Array\[Text\]      **No**         Topic tags for filtering. Max 8.

  isBreaking            Checkbox           **No**         If true --- triggers push
                                                          notification via FCM and urgent
                                                          policy monitor email.

  aiGenerated           Checkbox           **Auto**       Set to true if created via Policy
                                                          Brief Generator tool. Shown as
                                                          disclosure on published post.

  aiApprovedBy          Relationship       **Auto**       Researcher who approved AI-generated
                                                          draft. Required if aiGenerated is
                                                          true.

  status                Select             **Yes**        draft \| ai_draft \| review \|
                                                          published
  --------------------- ------------------ -------------- ------------------------------------

## **4.4 Collections: Event, News, Division, Dataset Reference**

  ----------------------- ------------------------------------------------- ---------------------------------------------
  **Collection**          **Key fields**                                    **Notes**

  **Event**               id, title, slug, eventType                        recordingUrl populated post-event. iCal
                          (seminar\|workshop\|conference\|webinar),         generated from startDate/endDate via server
                          startDate, endDate, location, registrationUrl,    component.
                          isOnline, recordingUrl, slidesFile,               
                          speakers\[Relationship→Researcher\], division,    
                          status                                            

  **News**                id, title, slug, body, summary, publishedDate,    Short-form. External news items use
                          category (institutional\|media\|external),        externalUrl and open in new tab. Body is
                          externalUrl, featuredImage, status                plain text only --- no rich text editor
                                                                            overhead.

  **Division**            id, name, slug, shortName, description(RichText), One entry per NISER research division.
                          headOfDivision(Relationship→Researcher),          Manually maintained by Administrator.
                          researchers\[Relationship→Researcher\],           
                          activeProjectsCount(Number),                      
                          recentPublications\[Relationship→Publication\],   
                          email, status                                     

  **ProcurementNotice**   id, title, slug, noticeType                       Published within 5 working days of issue per
                          (tender\|award\|expression_of_interest),          NISER procurement policy. Visible only when
                          issueDate, closingDate, budget, description,      status=published.
                          documentFile, awardedTo(Text), awardValue, status 

  **Page**                id, title, slug, body(RichText), metaDescription, Used for About, Contact, Accessibility
                          status                                            Statement, Privacy Policy static pages.
                                                                            Managed by Editor.
  ----------------------- ------------------------------------------------- ---------------------------------------------

# **5. API Specifications**

## **5.1 Payload CMS REST API --- Key Endpoints**

  ------------ ---------------------------------------------------------------------------------------------- ----------- ---------------------------------
  **Method**   **Endpoint**                                                                                   **Auth**    **Response**

  **GET**      /api/publications?limit=20&page=1&where\[status\]\[equals\]=published&sort=-publishedYear      API key     Array of Publication objects with
                                                                                                                          authors (populated)

  **GET**      /api/publications/\[slug\]                                                                     API key     Single Publication with nested
                                                                                                                          author profiles

  **GET**      /api/researchers?where\[isActive\]\[equals\]=true&where\[division\]\[equals\]=macroeconomics   API key     Array of Researcher objects

  **GET**      /api/researchers/\[slug\]                                                                      API key     Single Researcher with
                                                                                                                          orcidPublications,
                                                                                                                          selectedPublications populated

  **GET**      /api/insights?where\[status\]\[equals\]=published&sort=-publishedDate                          API key     Array of Insight with author
                                                                                                                          populated

  **GET**      /api/events?where\[startDate\]\[greater_than\]=\[today\]&sort=startDate                        API key     Upcoming events ordered by start
                                                                                                                          date

  **GET**      /api/divisions                                                                                 API key     All divisions with headOfDivision
                                                                                                                          and recentPublications populated

  **POST**     /api/publications                                                                              JWT         Create publication. Returns new
                                                                                                              (Editor+)   object with id.

  **PATCH**    /api/publications/\[id\]                                                                       JWT (Author Update publication fields.
                                                                                                              owns or     Returns updated object.
                                                                                                              Editor+)    

  **POST**     /api/insights/policy-brief-draft                                                               JWT         Internal --- triggers Policy
                                                                                                              (Author+)   Brief Generator AI. Returns draft
                                                                                                                          Insight ID.

  **POST**     /api/revalidate                                                                                Webhook     Triggers Next.js ISR for the
                                                                                                              secret      affected page slug.

  **POST**     /api/embed                                                                                     Webhook     Triggers Qdrant embedding upsert
                                                                                                              secret      for published content.
  ------------ ---------------------------------------------------------------------------------------------- ----------- ---------------------------------

## **5.2 Next.js Internal API Routes**

  ------------ ------------------- ---------------------------------------------
  **Method**   **Route**           **Specification**

  **POST**     /api/chatbot        Request: { message: string, history:
                                   ChatMessage\[\] }. Auth: none (public). Rate
                                   limit: 20 req/min per IP via Cloudflare.
                                   Streams SSE tokens. On completion, appends
                                   sources array: \[{ title, url, excerpt }\].
                                   Max 5 sources. Fallback if confidence \< 0.6:
                                   standard \"no info\" response.

  **POST**     /api/subscribe      Request: { email: string, interests:
                                   string\[\] }. Validates email format. Calls
                                   Brevo API to add/update contact. Returns {
                                   success: boolean, message: string }. Rate
                                   limit: 5 req/min per IP.

  **POST**     /api/revalidate     Request: { secret: string, slug: string,
                                   type: string }. Validates REVALIDATION_SECRET
                                   env var. Calls revalidatePath() for the
                                   affected route. Returns { revalidated: true
                                   }.

  **POST**     /api/embed          Request: { id: string, type: string, content:
                                   string, metadata: object }. Validates
                                   WEBHOOK_SECRET. Calls embeddings.ts → Qdrant
                                   upsert. Returns { success: boolean }.

  **POST**     /api/policy-brief   Auth: JWT (Editor+). Request: {
                                   publicationIds: string\[\], audience: string
                                   }. Assembles context from publication
                                   abstracts → Claude API → returns {
                                   draftInsightId: string }. Saved as ai_draft
                                   status in Payload.

  **POST**     /api/translate      Auth: JWT (Editor+). Request: { text: string,
                                   targetLang: yo\|ha\|ig }. Calls NLLB endpoint
                                   on InterServer. Returns { translatedText:
                                   string, detectedSourceLang: string }.

  **GET**      /api/search         Query: q, type, division, year, page. Calls
                                   Elasticsearch hybrid query (BM25 + kNN).
                                   Returns { hits: SearchResult\[\], total:
                                   number, facets: Facets }.

  **GET**      /feed.xml           Generates RSS 2.0 feed of latest publications
                                   and insights. Used by Brevo newsletter
                                   automation and Podcast clients.
  ------------ ------------------- ---------------------------------------------

## **5.3 Elasticsearch Index Schemas**

Two primary Elasticsearch indices are maintained. Both use a single
index with sub-type filtering rather than separate indices to allow
cross-content-type search in a single query.

  ------------------ ------------------- ----------------- ------------------------------------------
  **Index:           **Field type**      **Searchable**    **Notes**
  niser_content**                                          

  id                 keyword             **No**            Payload CMS document ID

  type               keyword             **Filter**        publication \| researcher \| insight \|
                                                           event \| news

  title              text (en analyser)  **Yes**           Full-text. Boosted ×3 in query.

  abstract           text (en analyser)  **Yes**           Full-text. Boosted ×2.

  body_plaintext     text (en analyser)  **Yes**           Full-text. For insights.

  authors            text                **Yes**           Researcher full names, space-separated.

  division           keyword             **Filter**        Maps to researchDivision enum.

  year               integer             **Sort/Filter**   publishedYear for publications.

  publication_type   keyword             **Filter**        working_paper, policy_brief, etc.

  keywords           keyword\[\]         **Filter**        Exact-match tag filter.

  slug               keyword             **No**            Used to build canonical URL.

  url                keyword             **No**            Computed path for link in search results.

  embedding          dense_vector(768)   **kNN**           sentence-transformers/all-mpnet-base-v2.
                                                           Used in hybrid search.

  published_at       date                **Sort**          ISO 8601 timestamp.
  ------------------ ------------------- ----------------- ------------------------------------------

## **5.4 ORCID API Integration**

NISER uses the ORCID Public API v3.0 to sync researcher publications
automatically. A Payload CMS task runs weekly (Sunday 03:00 WAT) for all
researchers with a configured orcid field.

  ------------------- ----------------------------------------------------
  **Step**            **Implementation**

  **Fetch works**     GET https://pub.orcid.org/v3.0/{orcid}/works ---
                      returns list of work summaries. Auth: public token
                      (no user consent required for public profiles).

  **Fetch work        GET
  detail**            https://pub.orcid.org/v3.0/{orcid}/work/{put-code}
                      --- returns full work metadata including title,
                      journal, year, DOI, contributors.

  **Deduplication**   Cross-reference by DOI and orcidDerivedId against
                      existing Payload publications. Skip if already
                      present.

  **Store**           Serialise as JSON array in
                      researcher.orcidPublications field. Displayed as a
                      separate section on researcher profile --- not added
                      to the main publications collection automatically.

  **Rate limit**      ORCID Public API allows 10 requests/second. Task
                      processes researchers sequentially with 100ms delay
                      between requests.
  ------------------- ----------------------------------------------------

# **6. AI Services Layer**

The AI services layer is a collection of independent services deployed
on the InterServer VPS alongside Payload CMS and Elasticsearch. All
services communicate with the Next.js web app and Flutter mobile app via
HTTP endpoints. The core shared infrastructure is a **Qdrant vector
database** and a **sentence-transformers embedding service**, shared
across all seven AI capabilities.

## **6.1 Shared AI Infrastructure**

  --------------- ----------------------------------------- ----------------------------------------
  **Component**   **Technology**                            **Specification**

  **Vector        Qdrant 1.9 (self-hosted)                  Collections: niser_documents (768-dim,
  database**                                                cosine similarity),
                                                            niser_translations_cache (multilingual).
                                                            Persistent storage at
                                                            /var/qdrant/storage on InterServer VPS.
                                                            REST API on port 6333. Memory usage:
                                                            \~512MB for 10,000 vectors. gRPC on port
                                                            6334 for high-throughput embedding
                                                            upsert.

  **Embedding     sentence-transformers/all-mpnet-base-v2   768-dimensional embeddings. Self-hosted
  model**                                                   via sentence-transformers Python server
                                                            on port 8001. Model weights: \~420MB.
                                                            Average encoding: 50ms/doc on CPU. Batch
                                                            size: 32 for bulk ingest. Shared by
                                                            chatbot, semantic search,
                                                            recommendations, and literature review.

  **LLM ---       Ollama + Llama 3.1 8B (self-hosted)       Deployed on InterServer with GPU add-on
  primary**                                                 (NVIDIA T4). Ollama REST API on port
                                                            11434. Context window: 128K tokens.
                                                            4-bit quantised (4.5GB VRAM). Average
                                                            response: 40--80 tokens/second. Used for
                                                            chatbot, policy monitor summaries, and
                                                            literature review.

  **LLM ---       Claude 3.5 Sonnet (Anthropic API)         Used exclusively for Policy Brief
  premium (API)**                                           Generator and Literature Review
                                                            Assistant where output quality is
                                                            critical and usage is
                                                            researcher-initiated (low volume). API
                                                            key stored as environment variable
                                                            CLAUDE_API_KEY. Never used for public
                                                            chatbot (cost risk from abuse).

  **AI service    Node.js Express (port 3001)               Internal reverse proxy aggregating all
  gateway**                                                 AI endpoints. Validates shared
                                                            INTERNAL_AI_SECRET header. Rate limits
                                                            per endpoint. Logs all requests to
                                                            Matomo custom events dimension.

  **Environment   InterServer VPS .env file                 QDRANT_URL, QDRANT_API_KEY,
  variables**                                               EMBEDDING_SERVICE_URL, OLLAMA_URL,
                                                            CLAUDE_API_KEY, INTERNAL_AI_SECRET,
                                                            NLLB_SERVICE_URL. Never committed to
                                                            Git. Injected via pm2 ecosystem config.
  --------------- ----------------------------------------- ----------------------------------------

## **6.2 AI Capability 1 --- NISER Research Chatbot (RAG)**

### **6.2.1 RAG Pipeline Architecture**

  ------------------ ----------------------------------------------------
  **Pipeline step**  **Implementation detail**

  **1. Document      Triggered by /api/embed webhook. Input: Payload
  ingestion**        document (Publication abstract, Insight body,
                     Researcher bio, Division description, News summary).
                     Processing: (1) Split into 400-token chunks with
                     80-token overlap using langchain/text-splitter. (2)
                     Generate 768-dim embedding per chunk via
                     sentence-transformers service. (3) Upsert to Qdrant
                     niser_documents collection with payload: { docId,
                     docType, title, url, chunkIndex, text }. Batch
                     upsert for bulk re-index.

  **2. Query         User message received at /api/chatbot. Generate
  embedding**        768-dim embedding for user query using same
                     sentence-transformers model. Ensures semantic
                     alignment between query and document embeddings.

  **3. Hybrid        Qdrant search: kNN cosine similarity (k=10) +
  retrieval**        keyword filter on docType if user query implies a
                     type (e.g., \"publication about poverty\"). Return
                     top-10 chunks ordered by score. Score threshold:
                     0.65 --- chunks below threshold excluded. Ensures
                     response relevance even if all matches are weak.

  **4. Context       Concatenate top-5 chunks (to fit context window).
  assembly**         Prepend each with source citation: \"\[Source:
                     {title}, {year}\]\". Trim total context to 3,000
                     tokens.

  **5. System prompt System prompt (see 6.2.2) + context chunks +
  injection**        conversation history (last 4 turns, max 2,000
                     tokens) assembled into messages array for Llama 3 /
                     Claude API.

  **6. LLM call +    POST to Ollama (http://localhost:11434/api/chat)
  streaming**        with stream: true. Stream SSE tokens to client via
                     Node.js Response.write(). Each token forwarded
                     immediately --- average time to first token: 800ms.

  **7. Source        After LLM completes, extract source titles and URLs
  attachment**       from context chunks used. Append as structured JSON
                     in SSE stream: event: sources, data: \[{title, url,
                     excerpt}\]. Frontend renders as clickable citation
                     list below response.

  **8. Fallback      If Qdrant returns 0 chunks above threshold, skip LLM
  logic**            call. Return standard fallback: \"I cannot find
                     relevant information in NISER\'s knowledge base for
                     this query. Please contact NISER at \[email\] or
                     search the publications archive.\"
  ------------------ ----------------------------------------------------

### **6.2.2 Chatbot System Prompt**

+-----------------------------------------------------------------------+
| You are the NISER Research Assistant, an AI tool for the National     |
| Institute of Social                                                   |
|                                                                       |
| and Economic Research (NISER), Ibadan, Nigeria.                       |
|                                                                       |
| Your role is to help users find and understand NISER\'s research      |
| publications, policy                                                  |
|                                                                       |
| analysis, and expert knowledge. You answer ONLY using the context     |
| provided below.                                                       |
|                                                                       |
| Rules you MUST follow:                                                |
|                                                                       |
| 1\. Only answer using information from the provided context. Do not   |
| use training knowledge.                                               |
|                                                                       |
| 2\. Always cite your sources. Format: \"According to \[Title,         |
| Year\]\...\"                                                          |
|                                                                       |
| 3\. If the context does not contain sufficient information, respond   |
| with the fallback                                                     |
|                                                                       |
| message exactly: \"I cannot find relevant information in NISER\'s     |
| publications for                                                      |
|                                                                       |
| this question. Please search the Publications archive or contact      |
| NISER directly.\"                                                     |
|                                                                       |
| 4\. Never express political opinions, make forecasts, or provide      |
| legal/financial advice.                                               |
|                                                                       |
| 5\. Keep responses concise: 150--300 words unless user requests       |
| elaboration.                                                          |
|                                                                       |
| 6\. You are an AI assistant. If asked, confirm this clearly.          |
|                                                                       |
| Context from NISER\'s knowledge base:                                 |
|                                                                       |
| {context}                                                             |
|                                                                       |
| Conversation history:                                                 |
|                                                                       |
| {history}                                                             |
|                                                                       |
| User question: {question}                                             |
+-----------------------------------------------------------------------+

## **6.3 AI Capability 2 --- Semantic Publication Search**

  ------------------ ----------------------------------------------------
  **Aspect**         **Specification**

  **Query type**     Hybrid: Elasticsearch BM25 (keyword relevance) +
                     Qdrant kNN (semantic similarity). Results merged via
                     Reciprocal Rank Fusion (RRF): final_score = 1/(k +
                     rank_bm25) + 1/(k + rank_knn) where k=60.

  **Search flow**    User types query → debounce 300ms → POST /api/search
                     → (parallel) Elasticsearch BM25 query + Qdrant kNN
                     query → RRF merge → return top-20 results → client
                     renders with filter chips applied.

  **Semantic         UI toggle (SemanticToggle component) switches
  toggle**           between keyword-only (Elasticsearch only) and
                     AI-enhanced (hybrid). Preference stored in
                     localStorage. Default: AI-enhanced.

  **Re-ranking       Cohere Rerank API free tier (1,000 req/month) can
  (optional)**       re-rank top-20 candidates. Enabled via
                     COHERE_API_KEY env var. Falls back to RRF if API key
                     absent or limit reached.

  **Facets**         Elasticsearch aggregations on division, year,
                     publication_type, keywords. Returned alongside
                     search hits. Applied as post-filters to avoid query
                     rebuild on each filter change.

  **Performance      \< 300ms for hybrid query at NISER\'s document scale
  target**           (\< 5,000 documents). Tested via k6 load test at 50
                     concurrent users.
  ------------------ ----------------------------------------------------

## **6.4 AI Capability 3 --- Policy Brief Generator**

  ------------------ ----------------------------------------------------
  **Aspect**         **Specification**

  **Access**         Payload CMS admin panel only. Authenticated
                     researchers (Author role or above). URL:
                     /admin/collections/insights/create --- \"Generate
                     with AI\" button.

  **Input**          Researcher selects 1--3 publications from Payload
                     collection. Selects audience: federal_ministry \|
                     state_government \| development_partners \| media \|
                     academic. Optionally provides a focus angle (200
                     chars max).

  **Context          Fetch full abstract + first 2,000 chars of PDF text
  assembly**         (via pdfjs-dist extraction, cached on first
                     publication upload) for each selected publication.
                     Total context: max 12,000 tokens.

  **LLM call**       Claude 3.5 Sonnet API. Temperature: 0.3 (factual,
                     low creativity). Max tokens: 1,200. Structured
                     output prompt requesting JSON with keys:
                     introduction, keyFindings (array),
                     policyImplications, recommendations (array),
                     dataSources.

  **Output           JSON parsed → Payload Insight document created with
  handling**         status: ai_draft, aiGenerated: true, aiApprovedBy:
                     null. Researcher redirected to draft editor.
                     aiApprovedBy required before status can be changed
                     to review or published.

  **Audit log**      Payload afterChange hook records:
                     claudeModelVersion, publicationIds\[\], audience,
                     generatedAt, approvedBy, approvedAt in a separate
                     AuditLog global collection.
  ------------------ ----------------------------------------------------

## **6.5 AI Capability 4 --- Literature Review Assistant**

The Literature Review Assistant is an internal tool accessible only to
authenticated NISER researchers within the Payload CMS editor. It
synthesises NISER\'s internal publication corpus plus
researcher-uploaded external PDFs into a structured literature review
draft.

  ------------------ ----------------------------------------------------
  **Aspect**         **Specification**

  **Input**          Research question (free text, 500 chars max). Up to
                     5 external PDFs uploaded via drag-drop (max 10MB
                     each). Topic keywords for Qdrant pre-filter
                     (optional).

  **Internal         Qdrant search: top-20 chunks most relevant to
  retrieval**        research question from niser_documents collection.
                     Provides NISER\'s internal literature perspective.

  **External PDF     Uploaded PDFs processed via pdfjs-dist (Node.js).
  processing**       Text extracted per page. Chunked at 400 tokens.
                     Embeddings generated. Stored in ephemeral Qdrant
                     collection (TTL: 1 hour) for this session only. Not
                     persisted.

  **LLM call**       Claude 3.5 Sonnet (200K context window). Full
                     context: internal chunks (6,000 tokens) + external
                     PDF chunks (6,000 tokens) + system prompt (500
                     tokens). Output: structured Markdown with sections:
                     Research Question, NISER Literature Summary (with
                     inline citations), External Literature Summary,
                     Identified Gaps, Methodological Notes, Recommended
                     Next Steps.

  **Output**         Markdown rendered in a Payload rich text field.
                     Researcher edits in place. Saved as working_note
                     draft (new content type --- internal only, never
                     published to public site).

  **Privacy**        Uploaded external PDFs deleted from server after
                     processing. Ephemeral Qdrant collection deleted
                     after TTL. No external document content persisted
                     beyond the session.
  ------------------ ----------------------------------------------------

## **6.6 AI Capability 5 --- Content Recommendations**

Content recommendations are computed at publication time and stored in
the Payload CMS document. Zero runtime AI cost --- all recommendations
are pre-computed.

-   Trigger: Payload afterChange hook fires when a document is published
    or updated.

-   Process: Fetch the document\'s embedding from Qdrant. Run Qdrant
    search for top-10 nearest neighbours (excluding self) filtered to
    published documents only.

-   Store: Write IDs as JSON array to the document\'s relatedContent
    field in Payload.

-   Serve: Next.js SSG page reads relatedContent field and fetches
    title/url/type for each ID. Rendered as RelatedContent carousel
    component.

-   Mobile: Flutter RelatedContentCarousel widget fetches the same
    Payload field.

-   Refresh: Every time a document is re-published, its neighbours are
    re-computed. Weekly background task re-computes all recommendations
    to account for new additions to the corpus.

## **6.7 AI Capability 6 --- Policy Monitor & Research Alerts**

  ------------------- ----------------------------------------------------
  **Aspect**          **Specification**

  **Schedule**        Linux cron on InterServer: 0 5 \* \* \* (05:00 WAT
                      daily). Trigger via POST to internal AI gateway
                      /ai/policy-monitor.

  **RSS sources**     CBN (www.cbn.gov.ng/rss), NBS
                      (nigerianstat.gov.ng/rss), Federal Ministry of
                      Finance, IMF Nigeria
                      (www.imf.org/en/Countries/NGA/rss), World Bank
                      Nigeria, BusinessDay, The Cable --- all RSS/Atom
                      feeds. No scraping of paywalled or
                      anti-scrape-protected sites.

  **Relevance         facebook/bart-large-mnli (MNLI zero-shot
  classification**    classification, self-hosted on InterServer CPU).
                      Candidate labels: macroeconomics,
                      poverty_social_development, agriculture, governance,
                      industry_manufacturing, monetary_policy,
                      fiscal_policy. Item included if max label score \>
                      0.45.

  **Summarisation**   Claude Haiku API (lowest cost, adequate quality for
                      brief summaries). Each relevant item summarised in 2
                      sentences. Batch call: all items in a single API
                      request to minimise cost.

  **Email assembly**  Items grouped by research division. HTML email
                      template rendered via Brevo transactional template.
                      Subject: \"NISER Policy Monitor --- {date} --- {N}
                      items across {divisions}\". Sent to division heads
                      and Director via Brevo API.

  **Urgency           If item classified as monetary_policy or
  escalation**        fiscal_policy with score \> 0.80 AND published
                      within last 2 hours --- trigger Firebase Cloud
                      Messaging push notification to mobile app
                      subscribers who opted into Rapid Response category.

  **Error handling**  If RSS fetch fails for a source, that source is
                      skipped with a warning logged to Sentry. If Brevo
                      email fails, retry 3 times with exponential backoff.
                      Job failure alert sent to IT Unit email.
  ------------------- ----------------------------------------------------

## **6.8 AI Capability 7 --- AI Translation Layer (Yoruba, Hausa, Igbo)**

  ------------------ ----------------------------------------------------
  **Aspect**         **Specification**

  **Model**          facebook/nllb-200-distilled-600M. Self-hosted via
                     CTranslate2 Python server on port 8003 (InterServer
                     VPS). Language codes: Yoruba (yor_Latn), Hausa
                     (hau_Latn), Igbo (ibo_Latn). Average translation
                     speed: 45 seconds per 600-word article on CPU. GPU
                     instance: 8 seconds.

  **Workflow**       Editor selects insight/policy brief → clicks
                     \"Translate\" → selects target language → POST
                     /api/translate → NLLB service → returns translated
                     text → creates linked Insight document with same
                     slug + language suffix (e.g.,
                     /yo/insights/poverty-analysis-2024) → status set to
                     translation_review → language reviewer is notified
                     via email.

  **Human review**   Each language has a designated reviewer (NISER
                     associate or volunteer with language proficiency).
                     Reviewer accesses draft translation in Payload CMS
                     editor. Required to approve before status changes to
                     published.

  **URL structure**  English: /insights/\[slug\]. Yoruba:
                     /yo/insights/\[slug\]. Hausa: /ha/insights/\[slug\].
                     Igbo: /ig/insights/\[slug\]. hreflang meta tags
                     added for SEO cross-referencing between language
                     versions.

  **Mobile**         Flutter LanguageSelector widget (bottom sheet)
                     allows users to switch language. Preference stored
                     in flutter_secure_storage. App fetches content from
                     Payload in selected language.

  **Translation      Completed translations stored in Payload as linked
  cache**            documents. Re-translation only triggered if original
                     English content is updated after translation was
                     published.
  ------------------ ----------------------------------------------------

# **7. Mobile Application Detailed Design**

## **7.1 Screen Flow and Navigation**

The Flutter app uses **GoRouter** for declarative navigation with deep
link support. Navigation is organised as a bottom navigation bar with
five primary destinations, each backed by a ShellRoute for persistent
navigation state.

  --------------- ---------------- ------------------------------------------
  **Nav           **Named route**  **Screens reachable**
  destination**                    

  **Home**        /home            HomeScreen → InsightDetailScreen,
                                   EventDetailScreen, PublicationDetailScreen

  **Research**    /publications    PublicationsScreen →
                                   PublicationDetailScreen →
                                   ResearcherProfileScreen

  **People**      /people          ResearcherDirectoryScreen →
                                   ResearcherProfileScreen →
                                   PublicationDetailScreen

  **Ask NISER**   /chatbot         ChatScreen (full-screen, persists within
                                   tab)

  **More**        /more            EventsScreen, DataCatalogueScreen,
                                   DatasetDetailScreen, SettingsScreen,
                                   AboutScreen, NotificationInbox

  **Search        /search          SearchScreen launched as full-screen modal
  (modal)**                        from search icon in app bar
  --------------- ---------------- ------------------------------------------

## **7.2 Offline-First Data Architecture**

  ------------------ ------------------------ -------------------------------
  **Data type**      **Storage**              **Cache strategy**

  **Publications     Hive Box                 Cache on first load. TTL: 6
  list**             (publications_cache)     hours. Stale-while-revalidate:
                                              show cache immediately, fetch
                                              fresh in background.

  **Publication      Hive Box                 Cache last 20 viewed. LRU
  detail**           (pub_detail_cache)       eviction. Infinite TTL for
                                              explicitly saved items.

  **PDF files**      File system              Manual download only. User taps
                     (path_provider app docs  \"Save for offline\". Max 500MB
                     dir)                     total. Download manager tracks
                                              progress.

  **Researcher       Hive Box                 Cache last 15 viewed. TTL: 12
  profiles**         (researcher_cache)       hours.

  **Search results** In-memory (Riverpod      Not persisted. Recent searches
                     state)                   list stored in Hive (last 20
                                              queries).

  **Chat history**   Hive Box (chat_sessions) Session-level persistence. User
                                              can clear. Not synced to
                                              server.

  **Events**         Hive Box (events_cache)  TTL: 1 hour. Force refresh on
                                              app foreground if stale.

  **User             flutter_secure_storage   Language, text size,
  preferences**                               notification preferences. No
                                              TTL.

  **CKAN datasets**  In-memory only           Dataset catalogue not cached
                                              --- always requires network.
  ------------------ ------------------------ -------------------------------

## **7.3 Push Notification Implementation**

  --------------------------- -----------------------------------------------------
  **Component**               **Specification**

  **FCM setup**               firebase_messaging Flutter package.
                              FirebaseMessaging.instance.requestPermission() called
                              on first app launch after onboarding screen.
                              Permission required for iOS; Android 13+ requires
                              explicit permission.

  **Token registration**      On permission grant or app re-launch, getFCMToken()
                              retrieves current token. Token POSTed to
                              /api/fcm-register on Payload CMS --- stored against
                              user device record (anonymous, keyed by token only).
                              Tokens refreshed automatically by FCM; onTokenRefresh
                              handler updates Payload.

  **Topic subscriptions**     User subscribes to FCM topics via
                              FirebaseMessaging.subscribeToTopic(). Topics:
                              niser_publications, niser_events, niser_insights,
                              niser_rapid_response. Default subscriptions:
                              niser_publications + niser_insights. User manages in
                              SettingsScreen → NotificationPrefsScreen.

  **Foreground handling**     firebase_messaging onMessage stream. Shows Flutter
                              local notification banner via
                              flutter_local_notifications. Tapping banner navigates
                              to relevant deep link route via GoRouter.

  **Background/terminated**   FCM delivers to system notification tray. Tapping
                              launches app and GoRouter handles deep link from
                              getInitialMessage() or onMessageOpenedApp stream.

  **Notification payload      { title, body, data: { type:
  schema**                    \"publication\"\|\"event\"\|\"insight\"\|\"alert\",
                              id: string, url: string } }. id and type used to
                              build GoRouter deep link.

  **Server-side sending**     Next.js serverless function POST /api/notify called
                              by Payload webhook on isBreaking flag. Uses Firebase
                              Admin SDK with service account key stored as
                              environment variable.
  --------------------------- -----------------------------------------------------

## **7.4 Flutter CI/CD Pipeline**

  ------------------ ----------------------------------------------------
  **Stage**          **GitHub Actions step**

  **Trigger**        On push to feature/\* branches: run analysis and
                     tests. On merge to main: run full pipeline including
                     build and beta deploy.

  **flutter          Runs Dart static analysis. Fails PR if any errors
  analyze**          (warnings allowed). Config: analysis_options.yaml
                     with strict-mode: true.

  **flutter test**   Runs all unit + widget tests in test/. Coverage
                     report uploaded to Codecov. Minimum 75% coverage
                     enforced on PR.

  **Integration      flutter test integration_test/ on Android emulator
  tests**            (ubuntu-latest runner). Tests: search flow,
                     publication download, chatbot send message,
                     newsletter subscribe.

  **Build Android**  flutter build appbundle \--release. Signing keystore
                     stored as GitHub Actions encrypted secret. Output:
                     build/app/outputs/bundle/release/app-release.aab.

  **Build iOS**      flutter build ipa \--release. Runs on macos-latest
                     runner. Fastlane Match retrieves certificates from
                     private GitHub repo. Output: Runner.ipa.

  **Beta deploy**    Fastlane supply uploads .aab to Play Store internal
                     track. Fastlane pilot uploads .ipa to TestFlight.
                     NISER IT team listed as TestFlight internal testers.

  **Production       Manual workflow_dispatch trigger. Requires approval
  release**          from IT Unit head via GitHub Environments protection
                     rule. Fastlane promotes internal track to
                     production.
  ------------------ ----------------------------------------------------

# **8. Security Design**

## **8.1 Authentication and Authorisation**

  ---------------- ------------------------------------------------------
  **Context**      **Mechanism**

  **Payload CMS    JWT issued on login. Short-lived access token (15
  admin**          min) + long-lived refresh token (7 days) stored in
                   httpOnly cookies. CSRF protection enabled. Admin URL
                   changed from /admin to /niser-cms (obscurity measure
                   --- not security by itself).

  **Payload API    API keys for server-to-server calls (Next.js,
  (external)**     Flutter). Keys generated per client with minimum
                   required permissions. Rotated quarterly. Stored in
                   environment variables only --- never in client-side
                   code.

  **Internal AI    Shared secret header (X-Internal-AI-Secret) validated
  endpoints**      by AI gateway. Secret rotated monthly. Never exposed
                   to public internet --- AI gateway listens on localhost
                   only; tunnelled via Nginx.

  **Flutter app**  API key embedded in app at build time using
                   flutter_dotenv and \--dart-define-from-file.
                   Obfuscated via flutter build \--obfuscate. API key has
                   read-only permissions on public collections only.

  **Researcher CMS Role-based access control in Payload. Author role can
  access**         only create/edit own documents. Cannot delete or
                   publish without Editor approval. Cannot access other
                   collections (users, API keys, audit log).

  **Webhook        All incoming webhooks (Payload→Next.js, FCM,
  validation**     Cloudflare) validated via HMAC-SHA256 signature using
                   shared secrets stored as environment variables.
  ---------------- ------------------------------------------------------

## **8.2 NDPR Compliance Design**

  ------------------ ----------------------------------------------------
  **Requirement**    **Implementation**

  **Lawful basis**   NISER relies on legitimate interest (public benefit
                     research mandate) as lawful basis for processing
                     analytics data. Explicit consent obtained for
                     newsletter subscription and push notification
                     registration.

  **Data             Analytics (Matomo) configured in cookie-less mode
  minimisation**     --- no personal identifiers stored. Chatbot queries
                     ephemeral --- not logged to any database. Newsletter
                     stores email + interest preferences only.

  **Data subject     Unsubscribe link in every newsletter email (Brevo
  rights**           one-click). App notification preferences editable at
                     any time. Contact form at /about/contact for data
                     erasure requests.

  **Privacy policy** Published at /privacy-policy. Required sections:
                     data categories collected, legal basis, retention
                     periods, user rights, DPO contact, third-party
                     processors (Brevo, Firebase, Sentry, Cloudflare).

  **Data transfers** All primary data stored on InterServer VPS (New
                     Jersey, USA). Brevo EU-hosted. Firebase USA. Users
                     informed of international transfer in privacy
                     policy. Standard Contractual Clauses apply for EU
                     transfers.

  **AI data          Chatbot query text not persisted. External PDFs for
  handling**         literature review deleted after processing. ORCID
                     data fetched from public API --- no consent required
                     for public profiles.

  **Third-party      Sentry (error tracking) collects stack traces --- no
  scripts**          PII in Sentry config (scrubBreadcrumbs: true,
                     sendDefaultPii: false). No advertising or social
                     tracking scripts on the site.
  ------------------ ----------------------------------------------------

## **8.3 HTTP Security Headers**

All HTTP security headers are configured at the Nginx level on
InterServer VPS (for Payload CMS) and in next.config.ts (for Next.js on
Vercel):

  --------------------------- ------------------------------------------------
  **Header**                  **Value**

  Content-Security-Policy     default-src \'self\'; script-src \'self\'
                              \'unsafe-inline\' \'unsafe-eval\'
                              cdn.jsdelivr.net; style-src \'self\'
                              \'unsafe-inline\'; img-src \'self\' data:
                              res.cloudinary.com; connect-src \'self\'
                              cms.niser.gov.ng api.brevo.com; frame-ancestors
                              \'none\'

  X-Frame-Options             DENY

  X-Content-Type-Options      nosniff

  Referrer-Policy             strict-origin-when-cross-origin

  Permissions-Policy          camera=(), microphone=(), geolocation=()

  Strict-Transport-Security   max-age=31536000; includeSubDomains; preload

  X-XSS-Protection            0 (deprecated --- CSP handles this)
  --------------------------- ------------------------------------------------

# **9. Deployment Topology**

## **9.1 Infrastructure Overview**

  ------------------ ------------------ ----------------------------------
  **Service**        **Host**           **Configuration**

  **Next.js web      Vercel Pro         Auto-deploys from GitHub main
  app**              (\$20/mo)          branch. Edge functions for API
                                        routes. Global CDN for static
                                        assets. Preview deployments for
                                        PRs. Environment variables set in
                                        Vercel dashboard.

  **Payload CMS**    InterServer VPS    Node.js 20 process managed by PM2
                     --- 4 vCPU, 8GB    (pm2 start ecosystem.config.js).
                     RAM (\$24/mo)      Nginx reverse proxy on port 443
                                        with Let\'s Encrypt SSL. Restart
                                        policy: always. Logs:
                                        /var/log/pm2/.

  **Elasticsearch    InterServer VPS    Single-node for NISER\'s scale.
  8**                (same)             elasticsearch.yml: heap.size=2g,
                                        network.host=localhost. Accessible
                                        only via localhost --- Next.js
                                        calls via Vercel→Nginx tunnel are
                                        rate-limited.

  **Qdrant 1.9**     InterServer VPS    Docker container:
                     (same)             qdrant/qdrant:v1.9.0. Port 6333
                                        (REST) and 6334 (gRPC) bound to
                                        localhost only. Volume:
                                        /var/qdrant/storage for
                                        persistence across restarts.

  **Embedding        InterServer VPS    Python FastAPI app serving
  service**          (same)             sentence-transformers model. Port
                                        8001. 2 worker processes. Warm-up
                                        on start. Exposed only to
                                        localhost.

  **Ollama + Llama   InterServer VPS    Ollama service on port 11434.
  3**                GPU add-on         Model:
                                        llama3.1:8b-instruct-q4_K_M.
                                        Loaded into VRAM on service start.
                                        Response time: 40--80 tok/s on T4
                                        GPU.

  **NLLB             InterServer VPS    CTranslate2 FastAPI service on
  translation**      (same)             port 8003. Model:
                                        nllb-200-distilled-600M. CPU
                                        inference: \~45s/600 words. Can be
                                        run on GPU for 8s.

  **CKAN**           InterServer VPS    Docker Compose: CKAN, PostgreSQL,
                     --- separate       Redis, Solr. Nginx subdomain:
                     \$6/mo plan        data.niser.gov.ng. File storage:
                                        /var/ckan/storage.

  **Matomo**         InterServer VPS    PHP-FPM + Nginx. Port 8080
                     (shared with       (internal). MySQL database.
                     Payload)           Accessible at
                                        analytics.niser.gov.ng
                                        (IP-restricted to NISER staff).

  **Cloudflare CDN** Cloudflare free    DNS proxied for niser.gov.ng,
                     tier               cms.niser.gov.ng,
                                        data.niser.gov.ng. Auto-minify
                                        CSS/JS/HTML. Polish for image
                                        compression. DDoS protection. Rate
                                        limiting: 100 req/min per IP on
                                        /api/chatbot.

  **Firebase (FCM)** Google Cloud (free Firebase Admin SDK used by Next.js
                     tier)              /api/notify. Service account JSON
                                        stored as FIREBASE_SERVICE_ACCOUNT
                                        environment variable on Vercel.
  ------------------ ------------------ ----------------------------------

## **9.2 Environment Configuration**

  -------------------------- --------------- -------------------------------------------------
  **Environment variable**   **Used by**     **Description**

  PAYLOAD_SECRET             Payload CMS     JWT signing secret. 64-char random hex. Never
                                             rotated without migrating existing sessions.

  DATABASE_URI               Payload CMS     PostgreSQL connection string:
                                             postgresql://user:pass@localhost:5432/niser_cms

  NEXT_PUBLIC_CMS_URL        Next.js         Public CMS API URL: https://cms.niser.gov.ng/api
                             (client)        --- safe to expose

  CMS_API_KEY                Next.js         Server-side API key for Payload --- read-only on
                             (server)        public collections

  REVALIDATION_SECRET        Next.js +       Shared secret for ISR webhook signature
                             Payload         validation

  WEBHOOK_SECRET             Next.js +       Shared secret for embed webhook signature
                             Payload         validation

  ELASTICSEARCH_URL          Next.js +       http://localhost:9200 (VPS) or tunnelled URL from
                             Payload         Vercel

  ELASTICSEARCH_API_KEY      Next.js +       Elasticsearch API key with index read/write
                             Payload         permissions

  QDRANT_URL                 AI gateway      http://localhost:6333

  QDRANT_API_KEY             AI gateway      Qdrant collection API key

  EMBEDDING_SERVICE_URL      AI gateway      http://localhost:8001

  OLLAMA_URL                 AI gateway      http://localhost:11434

  CLAUDE_API_KEY             AI gateway      Anthropic API key. Used for Policy Brief
                                             Generator + Literature Review only.

  INTERNAL_AI_SECRET         AI gateway +    Shared secret for Next.js→AI gateway calls
                             Next.js         

  BREVO_API_KEY              Next.js         Brevo transactional and marketing email API key

  FIREBASE_SERVICE_ACCOUNT   Next.js         Firebase Admin SDK service account JSON (base64
                                             encoded)

  MATOMO_URL                 Next.js +       https://analytics.niser.gov.ng
                             Payload         

  MATOMO_SITE_ID             Next.js +       Matomo site ID (integer)
                             Payload         

  NLLB_SERVICE_URL           AI gateway      http://localhost:8003

  COHERE_API_KEY             Next.js         Cohere Rerank API key --- optional, falls back to
                             (optional)      RRF if absent

  SENTRY_DSN                 Next.js +       Sentry error tracking DSN
                             Flutter         
  -------------------------- --------------- -------------------------------------------------

# **10. Performance Budgets and Accessibility Standards**

## **10.1 Web Performance Budget (Lighthouse CI Enforced)**

  ------------------------ ------------ ------------ ----------------------
  **Metric**               **Mobile     **Desktop    **Enforcement**
                           target**     target**     

  Lighthouse Performance   **≥ 85**     **≥ 95**     CI blocks PR merge if
  score                                              below

  Lighthouse Accessibility **≥ 95**     **≥ 95**     CI blocks PR merge if
  score                                              below

  Lighthouse SEO score     **≥ 95**     **≥ 95**     CI blocks PR merge if
                                                     below

  Largest Contentful Paint **\< 3.0s**  **\< 1.5s**  CI blocks if exceeded
  (LCP)                                              

  Cumulative Layout Shift  **\< 0.1**   **\< 0.1**   CI blocks if exceeded
  (CLS)                                              

  Total Blocking Time      **\< 200ms** **\< 50ms**  CI warning
  (TBT)                                              

  First Contentful Paint   **\< 2.0s**  **\< 1.0s**  CI warning
  (FCP)                                              

  Total page weight        **\< 400KB** **\< 600KB** CI warning
  (homepage)                                         

  JavaScript bundle        **\< 150KB** **\< 200KB** CI blocks if exceeded
  (initial)                                          

  All images in WebP/AVIF  **100%**     **100%**     CI blocks if any
                                                     JPEG/PNG in output

  Chatbot first token      **\<         **\<         Monitored via Sentry
  (SSE)                    1,500ms**    1,000ms**    performance

  Search results latency   **\< 300ms** **\< 300ms** Monitored via Elastic
                                                     APM
  ------------------------ ------------ ------------ ----------------------

## **10.2 WCAG 2.1 AA Implementation Checklist**

  ---------- ---------------------- ---------- ----------------------------------
  **Done**   **Criterion**          **WCAG     **Implementation**
                                    ref**      

  **☑**      Non-text content ---   **Level    alt prop on all Next.js \<Image\>
             all images have alt    A**        components. Decorative images:
             text                              alt=\"\". Flutter: semanticLabel
                                               on Image widgets.

  **☑**      Info and relationships **Level    Next.js: proper heading hierarchy
             --- semantic HTML      A**        (h1→h6), landmark regions (main,
                                               nav, aside, footer). Flutter:
                                               Semantics() wrappers.

  **☑**      Input purpose ---      **Level    All form inputs have autocomplete
             autocomplete           AA**       attribute (email, name, etc.).
             attributes                        Flutter: autofillHints on
                                               TextField.

  **☑**      Contrast minimum ---   **Level    NISER brand token colours
             4.5:1 for normal text  AA**       validated in Figma Contrast
                                               plugin. All text/background
                                               combinations documented in design
                                               tokens file.

  **☑**      Keyboard --- all       **Level    Next.js: focus-visible utilities.
             functionality keyboard A**        Flutter: focusable widgets,
             accessible                        FocusTraversalGroup for tab order.

  **☑**      Bypass blocks --- skip **Level    Next.js: \<a
             navigation             A**        href=\"#main-content\"
                                               className=\"sr-only
                                               focus:not-sr-only\"\> as first
                                               focusable element. Flutter: N/A
                                               (no repeated navigation).

  **☑**      Focus visible ---      **Level    Next.js: Tailwind
             focus indicator        AA**       focus-visible:ring-2 on all
                                               interactive elements. Flutter:
                                               focusColor and focusedBorder on
                                               all interactive widgets.

  **☑**      Language of page ---   **Level    Next.js: \<html lang=\"en-NG\"\>
             lang attribute         A**        in root layout. Translated pages:
                                               \<html lang=\"yo\"\>, etc.

  **☑**      Error identification   **Level    Next.js: React Hook Form + Zod
             --- form errors        A**        validation with accessible error
             described                         messages. Flutter: InputDecoration
                                               errorText on invalid fields.
  ---------- ---------------------- ---------- ----------------------------------

# **11. Testing Strategy**

  ------------------- ------------------- ------------------ --------------------
  **Test type**       **Tools**           **Coverage         **What is tested**
                                          target**           

  **Unit --- Web**    Jest + React        80% statements     Utility functions,
                      Testing Library                        API route handlers,
                                                             lib/ai/\* pipeline
                                                             functions,
                                                             lib/cms/\* fetchers,
                                                             data transformations

  **Unit --- Mobile** flutter_test        80% statements     Use cases,
                      (dart:test)                            repository
                                                             implementations,
                                                             provider state
                                                             logic, data model
                                                             serialisation

  **Integration ---   Playwright (E2E)    Critical paths     Homepage load,
  Web**                                                      publication search
                                                             flow, chatbot
                                                             send+receive,
                                                             newsletter
                                                             subscribe,
                                                             researcher profile
                                                             render

  **Integration ---   flutter_test        Critical flows     Search publications,
  Mobile**            integration_test/                      open PDF viewer,
                                                             send chat message,
                                                             change language,
                                                             save publication
                                                             offline

  **Performance ---   Lighthouse CI       Per budget table   Automated on every
  Web**               (GitHub Actions)                       PR. Blocks merge if
                                                             Performance \< 85 or
                                                             Accessibility \< 95.

  **Performance ---   Flutter DevTools    Cold start \< 2s   Startup trace, frame
  Mobile**                                                   render time (target:
                                                             0 jank frames on
                                                             flagship Android)

  **API contract**    Supertest (Node.js) All endpoints      Payload CMS API
                                                             response shapes,
                                                             Next.js API route
                                                             input validation and
                                                             error codes

  **Search quality**  Custom              P95 \< 300ms       Search latency at 50
                      Elasticsearch k6                       concurrent users.
                      script                                 Precision@5 manual
                                                             evaluation
                                                             quarterly.

  **AI chatbot        Manual evaluation   Fallback rate \<   50 representative
  quality**           (monthly)           20%                queries evaluated by
                                                             Communications
                                                             Officer. Sources
                                                             cited correctly. No
                                                             hallucinations.

  **Accessibility**   axe-core            0 critical         Automated WCAG audit
                      (Playwright         violations         on every page in
                      integration)                           Playwright test
                                                             suite.

  **Security**        OWASP ZAP           No high/critical   Automated DAST scan
                      (quarterly)         findings           on staging
                                                             environment.
                                                             Findings triaged and
                                                             resolved before
                                                             production release.

  **Load test**       k6 (InterServer     Sustain 200        Test simulates 200
                      VPS + Vercel)       concurrent         concurrent users for
                                                             5 minutes. Payload
                                                             CMS + Elasticsearch
                                                             must sustain without
                                                             degradation.
  ------------------- ------------------- ------------------ --------------------

# **12. Appendix --- Technology Version Manifest**

  ----------------------- --------------- ---------------------------------
  **Technology**          **Version**     **Notes**

  Next.js                 **14.x (App     React 19 compatible. Server
                          Router)**       Components. Partial Prerendering
                                          (experimental).

  TypeScript              **5.x**         strict mode. No any. Payload CMS
                                          types auto-generated.

  Tailwind CSS            **4.x**         New engine --- no config file
                                          required. CSS-first config.

  shadcn/ui               **Latest**      Components copied into
                                          components/ui/ --- not a
                                          dependency.

  Payload CMS             **3.x           TypeScript-native. Lexical rich
                          (stable)**      text. PostgreSQL adapter.

  Flutter                 **3.24+**       Dart 3.4. Material 3. Impeller
                                          renderer enabled on Android.

  Riverpod                **2.x**         Code generation with \@riverpod
                                          annotation.

  Elasticsearch           **8.14**        Single-node. Dense vector search
                                          (kNN) built-in. No ML node
                                          required.

  Qdrant                  **1.9**         Docker image. Named vectors.
                                          Payload filter on published
                                          status.

  sentence-transformers   **3.x**         all-mpnet-base-v2 model. FastAPI
                                          wrapper.

  Ollama                  **0.3+**        Llama 3.1 8B instruct 4-bit
                                          quantised.

  CKAN                    **2.10**        Docker Compose. Python 3.11. Solr
                                          9.

  Matomo                  **5.x**         PHP 8.2. MySQL 8. Cookie-less
                                          mode.

  Node.js                 **20 LTS**      Payload CMS runtime. PM2 process
                                          manager.

  PostgreSQL              **15**          Payload CMS primary data store.
                                          Local on InterServer VPS.

  Nginx                   **1.24**        Reverse proxy on InterServer VPS.
                                          SSL termination.

  PM2                     **Latest**      Process manager for Node.js
                                          services on InterServer.

  Firebase                **Firebase      FCM push notifications only.
                          Admin SDK 12.x  
                          (Node.js)**     

  Sentry SDK              **8.x           Error tracking. Performance
                          (Next.js +      monitoring.
                          Flutter)**      
  ----------------------- --------------- ---------------------------------

NISER Digital Platform --- Software Design Document v1.0 · June 2026

National Institute of Social and Economic Research (NISER) · Ibadan,
Nigeria · niser.gov.ng
