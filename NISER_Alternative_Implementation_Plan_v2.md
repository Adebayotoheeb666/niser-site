**NISER NIGERIA · DIGITAL MODERNISATION PROGRAMME v2.0**

**Alternative Technology**

**Implementation Plan**

Including Mobile Application Development Implementation Plan

National Institute of Social and Economic Research (NISER) ---
niser.gov.ng

+-----------------+-----------------+-----------------+-----------------+
| Version         | Base plan       | New stacks      | New section     |
|                 |                 | covered         |                 |
| **2.0 ---       | *               |                 | **Mobile app    |
| Alternative     | *Implementation | **5             | plan**          |
| Stack**         | Plan v1.0**     | alternatives**  |                 |
+-----------------+-----------------+-----------------+-----------------+

+-----------------------------------+-----------------------------------+
| **Plan A (v1.0 )**                | **Plan B (v2.0 --- this           |
|                                   | document)**                       |
| -   Next.js 14 + Headless         |                                   |
|     WordPress / Payload CMS       | -   Flutter Web + Flutter Mobile  |
|                                   |     (single codebase)             |
| ```{=html}                        |                                   |
| <!-- -->                          | -   Elasticsearch for search      |
| ```                               |                                   |
| -   Algolia DocSearch or          | -   Mailersend or Postmark (Brevo |
|     Meilisearch                   |     alternative)                  |
|                                   |                                   |
| -   Brevo email / newsletter      | -   InterServer hosting           |
|                                   |                                   |
| -   Vercel hosting + Cloudflare   | -   Matomo Analytics              |
|     CDN                           |     (self-hosted)                 |
|                                   |                                   |
| -   Plausible Analytics           |                                   |
+-----------------------------------+-----------------------------------+

# **Executive Summary**

This document is Version 2.0 of the NISER Website Modernisation
Implementation Plan. It presents a **full alternative technology stack**
to the Next.js + Headless CMS architecture proposed in Plan A (v1.0),
and adds a **complete mobile application development implementation
plan** covering both Android and iOS. It is designed to be read
alongside Plan A: every section of this document maps directly to its
counterpart in the original plan, with clear side-by-side advantages and
disadvantages.

Plan B\'s distinguishing feature is its use of **Flutter** as the
unified development framework --- the same codebase produces the public
website, the Android app, and the iOS app. This is a strategic choice:
NISER\'s mobile audience in Nigeria represents over 70% of internet
users, and building a native-quality mobile application alongside the
website at minimal additional cost is a compelling proposition for an
institution with a public service mandate.

The five alternative technology choices in Plan B --- Flutter Web,
Elasticsearch, a Brevo alternative email platform, InterServer hosting,
and Matomo analytics --- each have genuine advantages over their Plan A
counterparts in specific contexts. This document provides an honest,
evidence-based comparison to help NISER\'s IT Unit and leadership make
an informed procurement decision.

## **Plan A vs Plan B --- Quick Decision Guide**

  ------------------ -------------------------- --------------------------
  **Factor**         **Choose Plan A            **Choose Plan B
                     (Next.js)**                (Flutter)**

  **Mobile app       Web only --- no mobile app Mobile app is a priority
  required?**        planned                    alongside the website

  **SEO priority**   Next.js SSG gives          Flutter Web has SEO
                     best-in-class SEO          limitations (canvas
                                                rendering)

  **Long-term        Separate web and mobile    Single Dart codebase for
  codebase**         codebases                  web, Android, iOS

  **Time to first    8 weeks --- faster         12--14 weeks --- web +
  launch**           web-only delivery          mobile delivered together

  **Analytics data   Plausible --- 3rd party    Matomo --- fully
  ownership**        hosted option              self-hosted, zero data
                                                sharing

  **Search           Algolia/Meilisearch ---    Elasticsearch ---
  sophistication**   fast, simple               powerful, complex,
                                                scalable

  **Hosting          Vercel edge network        InterServer VPS --- full
  flexibility**      (vendor lock-in risk)      control,
                                                Nigerian-compatible

  **Team             More developers available  Smaller talent pool;
  maintenance**      for maintenance            higher maintenance
                                                dependency
  ------------------ -------------------------- --------------------------

# **1. Technology Stack --- Plan B Alternatives**

## **1.1 Flutter Web (Alternative to Next.js)**

**What Flutter is:** Flutter is Google\'s open-source UI toolkit written
in the Dart programming language. Originally designed for mobile apps,
Flutter now compiles to native Android, native iOS, web (via WebAssembly
or CanvasKit renderer), Windows, macOS, and Linux --- all from a single
codebase.

**How it works for NISER:** A single Flutter project would produce: (1)
the niser.gov.ng website, (2) the NISER Android app on Google Play, and
(3) the NISER iOS app on the App Store. All three share 95%+ of the same
Dart code, the same design system, the same API integrations, and the
same content model.

  ------------------ ------------------------------------------------------------
  **Type**           **Flutter Web vs Next.js --- Detailed Comparison**

  **Advantage**      Single codebase for web, Android, and iOS. NISER builds one
                     app and deploys to three platforms. A Next.js web app
                     requires a separate React Native or Flutter mobile project
                     --- additional cost and developer overhead.

  **Advantage**      Pixel-perfect UI consistency. Flutter renders its own widget
                     engine rather than relying on browser HTML/CSS rendering.
                     The site looks identical on Chrome, Safari, Firefox, and
                     mobile browsers without cross-browser CSS bugs.

  **Advantage**      Hot reload development speed. Flutter\'s hot reload makes UI
                     iteration extremely fast --- developers see changes in under
                     a second without page refresh.

  **Advantage**      Strong Google-backed ecosystem. Flutter has Google\'s full
                     support, a large open-source package repository (pub.dev),
                     and guaranteed long-term maintenance.

  **Advantage**      Native mobile performance. When deployed as a mobile app,
                     Flutter renders at 60/120fps using the Skia/Impeller engine
                     --- noticeably smoother than React Native or web-based
                     hybrid apps.

  **Disadvantage**   SEO limitations. Flutter Web uses a canvas-based rendering
                     model (CanvasKit) or HTML renderer. Search engine crawlers
                     struggle with canvas-rendered content. This is a significant
                     limitation for a research institution whose publications
                     must be discoverable by Google Scholar.

  **Disadvantage**   Larger initial page weight. Flutter Web bundles the Flutter
                     engine with every page load --- initial bundle size is
                     1.5--3MB versus Next.js\'s 50--200KB. This is a material
                     disadvantage on Nigerian 3G connections.

  **Disadvantage**   Not ideal for content-heavy sites. Flutter excels at
                     app-like interfaces. Publication archives, long-form
                     research documents, and text-heavy content are better served
                     by Next.js\'s HTML-native rendering.

  **Disadvantage**   SEO mitigation is possible but complex. flutter_seo and
                     server-side rendering via Flutter\'s dart:html APIs can
                     mitigate SEO issues, but require additional engineering
                     effort not needed in Next.js.
  ------------------ ------------------------------------------------------------

**Verdict:** Choose Flutter if the mobile app is a primary strategic
objective and NISER is willing to invest in the longer initial build.
Choose Next.js if SEO and publications discoverability are the primary
digital goals --- which, for a research institution, they typically are.

## **1.2 Elasticsearch (Alternative to Algolia/Meilisearch)**

**What Elasticsearch is:** Elasticsearch is an open-source distributed
search and analytics engine built on Apache Lucene. It is the industry
standard for large-scale, complex search requirements --- powering
search at Wikipedia, GitHub, Stack Overflow, and hundreds of government
data portals worldwide.

**How it works for NISER:** Elasticsearch would replace Algolia or
Meilisearch as NISER\'s search backend. All publications, researchers,
news items, datasets, and insights would be indexed in Elasticsearch.
The Flutter or Next.js frontend queries the Elasticsearch REST API for
near-instant search results.

  ------------------ ------------------------------------------------------------
  **Type**           **Elasticsearch vs Algolia/Meilisearch --- Detailed
                     Comparison**

  **Advantage**      Unmatched search power. Elasticsearch supports Boolean
                     queries, fuzzy matching, phrase matching, field boosting,
                     geo-spatial queries, aggregations, and faceted search ---
                     all within a single query. This is far beyond Meilisearch\'s
                     capabilities.

  **Advantage**      Full analytics on search queries. Elasticsearch\'s Kibana
                     dashboard (or the open-source Kibana alternative) can show
                     NISER which search terms are most used, which return zero
                     results, and which publications get clicked. This is
                     invaluable for editorial strategy.

  **Advantage**      Scales without cost increases. Algolia charges per search
                     query above the free tier. Elasticsearch is self-hosted ---
                     no per-query cost regardless of search volume.

  **Advantage**      Cross-language and multilingual support. If NISER ever
                     publishes in Yoruba, Hausa, or Igbo, Elasticsearch has
                     built-in language analysers for multiple languages.
                     Meilisearch has limited multilingual support.

  **Advantage**      Unified data and log analytics. Elasticsearch can
                     simultaneously power search, error monitoring, uptime
                     logging, and CKAN dataset indexing --- replacing multiple
                     tools.

  **Disadvantage**   Significantly more complex to operate. Elasticsearch
                     requires a dedicated cluster (minimum 3 nodes for production
                     reliability), regular index management, mapping
                     configuration, and memory tuning. It is not a tool for a
                     small IT team without dedicated DevOps capability.

  **Disadvantage**   Higher resource requirements. A production Elasticsearch
                     cluster requires 4--8GB RAM per node. Minimum viable
                     deployment: \$60--120/month on InterServer or equivalent.
                     Meilisearch runs on 512MB RAM.

  **Disadvantage**   Slower initial setup. Configuring Elasticsearch indices,
                     mappings, and analyser pipelines takes 2--4 weeks of
                     developer time versus 2--3 days for Meilisearch.

  **Disadvantage**   Licensing change risk. Elasticsearch\'s parent company
                     (Elastic) changed its licence from Apache 2.0 to a
                     proprietary licence in 2021. OpenSearch (AWS\'s fork)
                     maintains the open-source version but introduces an
                     ecosystem split.
  ------------------ ------------------------------------------------------------

**Verdict:** Elasticsearch is the right choice if NISER\'s content
library grows beyond 10,000 documents and complex search analytics are
required. For NISER\'s current and near-term scale (hundreds to low
thousands of publications), Meilisearch (Plan A) delivers 90% of the
capability at 10% of the operational complexity. Revisit Elasticsearch
at scale.

## **1.3 Brevo Alternative --- MailerSend and Postmark**

**Plan A (Brevo):** Brevo (formerly Sendinblue) is a general-purpose
email marketing and transactional email platform with a free tier (300
emails/day), a graphical drag-and-drop builder, automation workflows,
and CRM features. It is the recommended newsletter platform in Plan A.

**Plan B alternatives: MailerSend** (transactional email focus, 3,000
emails/month free) and **Postmark** (industry-leading deliverability for
transactional email, paid-only at \$15/month for 10,000 emails).

  -------------------- ------------------ ------------------ -------------------
  **Feature**          **Brevo (Plan A)** **MailerSend**     **Postmark**

  **Free tier**        300 emails/day,    3,000              None --- \$15/month
                       unlimited contacts emails/month, 1    minimum
                                          domain             

  **Deliverability**   Good --- 94--96%   Good --- 95--97%   Excellent --- 98%+
                       inbox rate         inbox rate         inbox rate

  **Newsletter         Full drag-and-drop Drag-and-drop      Basic ---
  builder**            editor             editor             developer-focused

  **Automation         Yes --- visual     Yes --- limited    No ---
  workflows**          builder                               transactional only

  **Transactional      Yes --- API + SMTP Yes --- API +      Yes --- primary use
  email**                                 SMTP, primary use  case, best class
                                          case               

  **GDPR/NDPR          Full compliance    Full compliance    Full compliance
  compliance**         tools              tools              tools

  **API quality**      REST API --- good  REST API ---       REST API ---
                                          excellent          excellent

  **Nigerian           Credit card +      Credit card        Credit card
  payments**           PayPal                                

  **Pricing at         \$25/month         \$30/month         \$15/month
  10k/mo**                                                   

  **Best for NISER**   Newsletter         Mixed              Transactional
                       marketing +        transactional +    (password reset,
                       automation         newsletter         alerts)
  -------------------- ------------------ ------------------ -------------------

**Recommendation:** For NISER\'s use case --- primarily newsletter
dissemination with some transactional email (event confirmations,
subscribe verifications) --- **Brevo remains the best single-tool
choice**. However, if NISER experiences deliverability problems with
Brevo (newsletter going to spam), switch the transactional emails to
Postmark (better deliverability) while keeping Brevo for marketing
newsletters. MailerSend is a viable alternative if Brevo\'s pricing
increases significantly.

## **1.4 InterServer (Alternative to Vercel + Render)**

**What InterServer is:** InterServer is a US-based web hosting provider
offering VPS (Virtual Private Server) hosting, dedicated servers, shared
hosting, and colocation. It is known for its price-lock guarantee ---
the monthly price never increases for the lifetime of the account. It
offers both Linux and Windows VPS starting at \$6/month.

**How it applies to NISER:** Plan A uses Vercel (frontend, \$20/month) +
Render or Railway (CMS backend, \$7--25/month) + Cloudflare CDN (free).
Plan B uses a single InterServer VPS (\$6--24/month) running both the
application server and CMS, with Cloudflare still handling CDN.

  ------------------ ------------------------------------------------------------
  **Type**           **InterServer VPS vs Vercel + Render --- Detailed
                     Comparison**

  **Advantage**      Price-lock guarantee. InterServer\'s standard VPS price is
                     permanently locked at the signup rate --- no annual price
                     increases. Vercel and Render have historically increased
                     pricing as usage scales.

  **Advantage**      Full server control. A VPS gives NISER root access to
                     configure Nginx, Node.js, PostgreSQL, Elasticsearch, CKAN,
                     and Matomo exactly as required --- no platform constraints.

  **Advantage**      No vendor lock-in. NISER owns the server configuration.
                     Migration to any other provider is straightforward.
                     Vercel\'s edge network uses proprietary features that create
                     migration friction.

  **Advantage**      Nigerian payment compatibility. InterServer accepts Nigerian
                     Naira-equivalent international card payments more reliably
                     than Vercel, which sometimes has issues with Nigerian-issued
                     cards.

  **Advantage**      Predictable cost structure. A \$24/month InterServer VPS (4
                     vCPU, 4GB RAM) replaces Vercel Pro (\$20) + Render Starter
                     (\$7) + potential overage costs.

  **Disadvantage**   No global edge network. InterServer\'s VPS is hosted in a
                     single US data centre. Without Cloudflare CDN (still
                     required), users in Nigeria experience higher latency than
                     Vercel\'s global edge. With Cloudflare, static assets are
                     served from edge --- but server-side rendering still
                     originates from the US.

  **Disadvantage**   Requires DevOps capability. Managing an Ubuntu VPS ---
                     security patches, SSL renewal, Nginx configuration, database
                     backups, log rotation --- requires more technical knowledge
                     than a managed platform like Vercel.

  **Disadvantage**   No automatic scaling. If niser.gov.ng is cited in major
                     international news (e.g., an IMF report references NISER
                     data), traffic could spike beyond the VPS capacity. Vercel
                     scales automatically.

  **Disadvantage**   Slower deployment pipeline. Deploying updates to a VPS
                     requires SSH, git pull, and process restart --- versus
                     Vercel\'s one-click GitHub deployment with automatic preview
                     environments.
  ------------------ ------------------------------------------------------------

**Verdict:** InterServer is the better choice if NISER has or will hire
a DevOps-capable IT staff member and wants full infrastructure control.
Vercel (Plan A) is better if the development team is small and
deployment simplicity is a priority. Both work well with Cloudflare CDN
in front.

## **1.5 Matomo Analytics (Alternative to Plausible)**

**What Matomo is:** Matomo (formerly Piwik) is an open-source web
analytics platform that is deployed on NISER\'s own server. It is the
most widely used self-hosted alternative to Google Analytics, used by
over 1.4 million websites including multiple African government
institutions. All data remains on NISER\'s infrastructure --- no third
party ever receives analytics data.

  ------------------------- ------------------ ------------------ ------------------
  **Feature**               **Matomo (Plan     **Plausible (Plan  **Google Analytics
                            B)**               A)**               4**

  **Data ownership**        100% self-hosted,  3rd party hosted   Google owns and
                            NISER owns all     (option to         processes your
                            data               self-host)         data

  **NDPR compliance**       Full --- no data   Full ---           Requires cookie
                            leaves NISER       EU-hosted,         consent banner
                            servers            privacy-first      

  **Feature depth**         Full analytics     Minimal ---        Full suite ---
                            suite ---          traffic, pages,    complex interface
                            heatmaps, session  referrers only     
                            recordings,                           
                            funnels, goals,                       
                            A/B testing                           

  **Cookie consent**        Optional           No cookies ---     Required ---
                            (cookie-less mode  consent not        GDPR/NDPR risk
                            available)         required           

  **Cost**                  Free self-hosted;  \$9/month cloud or Free (but data is
                            \$23/month cloud   free self-hosted   the product)

  **Server resource**       \~512MB RAM +      Zero               Zero
                            MySQL on VPS       (cloud-hosted)     (cloud-hosted)

  **Import from GA**        Yes --- Google     Yes --- basic      Native
                            Analytics importer importer           

  **Dashboard for           Good ---           Excellent --- very Complex
  non-technical**           accessible         simple             

  **Heatmaps/recordings**   Yes --- built-in   Paid add-on        Requires
                            (self-hosted)                         Hotjar/Microsoft
                                                                  Clarity

  **Real-time reporting**   Yes                Yes                Yes
  ------------------------- ------------------ ------------------ ------------------

  ------------------ ------------------------------------------------------------
  **Type**           **Matomo vs Plausible --- Additional Considerations**

  **Advantage**      Complete data sovereignty. For a Nigerian
                     government-affiliated institution, having full control over
                     analytics data --- knowing it never leaves NISER\'s server
                     --- is significant from a governance and NDPR compliance
                     perspective.

  **Advantage**      Heatmaps and session recordings included free. Matomo\'s
                     self-hosted version includes heatmaps, session recordings,
                     and form analytics --- tools that would cost \$50--100/month
                     from Hotjar or FullStory.

  **Advantage**      Goal and funnel tracking. Matomo supports conversion goals
                     (e.g., newsletter subscribe, publication download) and
                     multi-step funnel analysis --- critical for measuring the
                     effectiveness of NISER\'s new content strategy.

  **Advantage**      WordPress plugin available. If NISER uses WordPress as the
                     CMS backend, the official Matomo WordPress plugin installs
                     tracking in minutes with no developer required.

  **Disadvantage**   More complex setup and maintenance. Matomo requires a MySQL
                     database, PHP server, and regular updates. Plausible
                     requires zero server administration --- it just works.

  **Disadvantage**   Higher resource usage. Matomo on the same VPS as the
                     application server will consume 512MB--1GB RAM. This is
                     significant if using a smaller InterServer plan.

  **Disadvantage**   Interface less clean than Plausible. Matomo\'s dashboard,
                     while comprehensive, is denser and less immediately legible
                     than Plausible\'s minimalist design. Non-technical staff may
                     find it harder to use.
  ------------------ ------------------------------------------------------------

**Verdict:** Matomo is the superior choice for NISER on grounds of data
sovereignty and feature depth, particularly if InterServer VPS hosting
is selected (both run on the same server at no additional infrastructure
cost). Plausible is better if simplicity and low maintenance are
priorities and the \$9/month cost is acceptable.

# **2. Plan B Implementation Phases**

Plan B follows the same four-phase structure as Plan A but uses the
alternative technology stack throughout. Phase 1 is identical (emergency
triage --- stack-agnostic). Phases 2--4 differ in tooling, timeline, and
required skills.

## **Phase 1 --- Emergency Triage (Days 1--30, \$0)**

Phase 1 is identical in both Plan A and Plan B. All seven actions are
stack-agnostic: they fix performance, security, and content issues on
the existing site before any rebuild begins.

  -------- -------------------- ------------ -------------- ---------- ---------------------
  **\#**   **Action**           **Owner**    **Duration**   **Cost**   **Acceptance
                                                                       criterion**

  **1**    **Compress all       IT Unit      2 days         **\$0**    Page weight reduced
           images to WebP; add                                         ≥50%; WebPageTest
           lazy loading**                                              confirms

  **2**    **Deploy Cloudflare  IT Unit      Half day       **\$0**    CF-Ray header
           free CDN --- point                                          present; Lighthouse
           DNS, enable                                                 perf +15pts
           caching**                                                   

  **3**    **Integrate Google   IT Unit      3 hours        **\$0**    Search returns
           Programmable Search                                         relevant results
           sitewide**                                                  within 3 seconds

  **4**    **Launch             Comms        1--2 days      **\$0**    Form live on
           Brevo/MailerSend     Officer                                homepage; first
           newsletter +                                                digest sent within 30
           subscribe form**                                            days

  **5**    **Add alt text to    IT Unit      2--4 days      **\$0**    Zero WCAG Level A
           all images; set                                             failures on Axe
           lang=en; skip-nav                                           automated scan
           link**                                                      

  **6**    **Archive stale      Comms        1 day          **\$0**    No content older than
           homepage news;       Officer                                3 months on homepage
           assign editorial                                            
           schedule**                                                  

  **7**    **Add HTTP security  IT Unit      30 mins        **\$0**    securityheaders.com
           headers via                                                 grade B or above
           .htaccess**                                                 
  -------- -------------------- ------------ -------------- ---------- ---------------------

## **Phase 2 --- Core Rebuild (Days 31--120, Est. \$0)**

Phase 2 in Plan B is longer than Plan A (90 days vs 60 days) because the
Flutter development covers **web and mobile simultaneously**. The
extended timeline reflects the larger engineering scope --- building a
mobile app alongside the website --- not additional complexity per
deliverable.

  -------- ----------------------- ------------- -------------- ---------- ---------------
  **\#**   **Deliverable**         **Owner**     **Duration**   **Cost**   **Acceptance
                                                                           criterion**

  **8**    **Flutter project       Developer     1 week         **\$0**    Flutter web
           scaffold --- Dart,                                              deploys to
           Material 3 design,                                              Firebase;
           shared component                                                Android APK
           library, CI/CD to                                               builds
           Firebase Hosting                                                successfully
           (web) + App Stores                                              
           (mobile)**                                                      

  **9**    **CMS setup --- Payload Developer     2 weeks        **\$0**    CMS API returns
           CMS (Node.js) on                                                valid JSON for
           InterServer VPS; all 13                                         all content
           content types; content                                          types; existing
           migration; editorial                                            content
           roles**                                                         migrated

  **10**   **Matomo self-hosted    IT Unit       2 days         **\$0**    Matomo
           install on InterServer                                          dashboard
           VPS --- tracking code                                           showing
           on all Flutter web                                              real-time
           pages; WordPress plugin                                         visitor data
           if using WP CMS**                                               

  **11**   **Elasticsearch cluster Developer     2 weeks        **\$0**    Search results
           setup on InterServer                                            in \<300ms;
           --- index all content                                           publications,
           types; Flutter search                                           researchers,
           UI with facets**                                                news all
                                                                           indexed

  **12**   **Flutter responsive    Developer +   1 week         **\$0**    Renders
           homepage --- hero,      Design                                  correctly at
           pathways, news feed,                                            320px, 768px,
           events, newsletter CTA,                                         1440px; LCP
           featured researcher**                                           \<3s on 3G

  **13**   **Publications archive  Developer     2 weeks        **\$0**    500ms search;
           (Flutter) ---                                                   all filters
           filterable, DOI links,                                          functional; DOI
           PDF download, citation                                          links resolve
           export,                                                         
           Elasticsearch-powered                                           
           search**                                                        

  **14**   **Researcher profiles   Developer     1 week         **\$0**    100%
           --- directory,                                                  researchers
           individual pages, ORCID                                         with complete
           API sync, division                                              profiles; ORCID
           filter**                                                        pull functional

  **15**   **NISER Perspectives    Developer     1 week         **\$0**    First 4 posts
           blog --- post index,                                            published; OG
           MDX-style rich text,                                            cards render
           author attribution,                                             correctly on
           social share cards**                                            share

  **16**   **Events calendar ---   Developer     3 days         **\$0**    All upcoming
           upcoming/past split,                                            events listed;
           iCal export, post-event                                         iCal download
           archive**                                                       works

  **17**   **MailerSend/Postmark   Developer     2 days         **\$0**    Subscribe
           API integration ---                                             confirmation
           transactional email for                                         email delivered
           subscribe confirmation,                                         in \<60s; spam
           event registration**                                            rate \<0.1%
  -------- ----------------------- ------------- -------------- ---------- ---------------

## **Phase 3 --- Knowledge Infrastructure (Days 121--210, Est. \$0)**

  -------- -------------------- ------------- -------------- ---------- --------------------
  **\#**   **Deliverable**      **Owner**     **Duration**   **Cost**   **Acceptance
                                                                        criterion**

  **18**   **CKAN open data     Developer +   6 weeks        **\$0**    10 datasets with
           portal on            Research                                full metadata;
           data.niser.gov.ng                                            downloads
           (InterServer                                                 functional; CKAN API
           subdomain) --- 10                                            returns valid JSON
           initial datasets                                             
           with codebooks**                                             

  **19**   **WCAG 2.1 AA        Developer +   3 weeks        **\$0**    Zero Axe AA
           audit + full         Auditor                                 failures;
           remediation in                                               VoiceOver/TalkBack
           Flutter widget layer                                         manual test passes
           --- semantic labels,                                         
           contrast, focus                                              
           traversal**                                                  

  **20**   **Schema.org         Developer     1 week         **\$0**    Google Rich Results
           structured data ---                                          Test passes for all
           Flutter web                                                  content types
           generates JSON-LD                                            
           for                                                          
           ScholarlyArticle,                                            
           Person, Event,                                               
           Organization**                                               

  **21**   **Research division  Developer +   2 weeks        **\$0**    All NISER divisions
           landing pages ---    Research                                with ≥3 active
           per-division team,   staff                                   projects listed
           projects,                                                    
           publications,                                                
           contact**                                                    

  **22**   **NDPR privacy       Legal +       1 week         **\$0**    Privacy policy live;
           policy + Matomo      Developer                               no undisclosed data
           cookie-less mode ---                                         collection; Matomo
           full data audit,                                             cookie-less
           policy page, consent                                         confirmed
           handling**                                                   

  **23**   **Sitemap.xml        Developer     1 day          **\$0**    Zero crawl errors in
           generation from                                              Search Console; all
           Flutter web build                                            priority pages
           --- submitted to                                             indexed
           Google Search                                                
           Console + Bing**                                             
  -------- -------------------- ------------- -------------- ---------- --------------------

## **Phase 4 --- Engagement & Sustainability (Days 211--365, Est. \$124)**

  -------- -------------------- ------------- -------------- ----------- ---------------
  **\#**   **Deliverable**      **Owner**     **Duration**   **Cost**    **Acceptance
                                                                         criterion**

  **24**   **Mobile app store   Developer     2 weeks        **\$25      Both apps live
           submission ---                                    (Play) +    in respective
           Google Play Store                                 \$99/yr     stores; ≥4.0
           (Android) and Apple                               (Apple)**   rating within 3
           App Store (iOS)                                               months
           listing,                                                      
           screenshots, store                                            
           optimisation**                                                

  **25**   **Push notification  Developer     1 week         **\$0       Test push
           system --- Firebase                               (Firebase   notification
           Cloud Messaging for                               free)**     delivered to
           publication alerts,                                           Android and iOS
           event reminders**                                             devices

  **26**   **Matomo goals +     IT Unit       3 days         **\$0**     Monthly
           funnels ---                                                   analytics
           newsletter subscribe                                          report showing
           funnel, publication                                           conversion
           download goal, event                                          rates per goal
           registration                                                  
           conversion**                                                  

  **27**   **Content governance Director\'s   2 weeks        **\$0**     Policy
           policy + editorial   office                                   approved; all
           roles in Payload CMS                                          section owners
           --- section owners,                                           named; CMS
           cadences, CMS access                                          roles assigned
           control**                                                     

  **28**   **Tender and         Admin + IT    1 week         **\$0**     All open
           procurement section                                           tenders
           --- notices within 5                                          published
           working days of                                               within SLA;
           issue; Payload CMS                                            archive of past
           procurement role                                              awards
           assigned**                                                    accessible

  **29**   **Year-one benchmark IT + Comms    1 week         **\$0**     Target: 75/100
           re-audit --- repeat                                           composite
           8-dimension quality                                           score; report
           scoring; publish                                              published on
           transformation                                                site and in app
           report**                                                      
  -------- -------------------- ------------- -------------- ----------- ---------------

# **3. Mobile Application Development Implementation Plan**

This section provides a complete, standalone implementation plan for the
NISER mobile application. The app is built in **Flutter (Dart)** --- the
same codebase as the Plan B website --- and published to both the
**Google Play Store** (Android) and the **Apple App Store** (iOS). If
NISER chooses Plan A (Next.js) for the website, the mobile app can still
be built in Flutter as a separate project consuming the same Payload CMS
or WordPress API.

## **3.1 Why NISER Needs a Mobile App**

+---------+------------------------------------------------------------+
| **Rati  | **Evidence and context**                                   |
| onale** |                                                            |
+---------+------------------------------------------------------------+
| **Mobil | Over 70% of Nigerian internet users access the web on      |
| e-first | smartphones. A dedicated app provides a faster,            |
| Ni      | offline-capable experience optimised for the devices       |
| geria** | NISER\'s audience actually uses.                           |
|         |                                                            |
|         | *Source: Statcounter Nigeria browser data, 2024*           |
+---------+------------------------------------------------------------+
| **Push  | A mobile app allows NISER to push publication alerts,      |
| n       | event reminders, and rapid-response commentary directly to |
| otifica | subscribers\' notification screens --- bypassing email     |
| tions** | open-rate limitations.                                     |
|         |                                                            |
|         | *Source: Average push notification open rate: 20--30% vs   |
|         | email open rate: 25%*                                      |
+---------+------------------------------------------------------------+
| **      | The NISER app can cache recently accessed publications and |
| Offline | policy briefs for offline reading --- critical for         |
| a       | researchers and policymakers in areas with unreliable      |
| ccess** | connectivity.                                              |
|         |                                                            |
|         | *Source: Relevant for users in rural states and during     |
|         | travel*                                                    |
+---------+------------------------------------------------------------+
| *       | A published App Store listing signals institutional        |
| *Instit | modernity and commitment to digital accessibility. Several |
| utional | NISER peer institutions (SALDRU, AERC) do not yet have     |
| credib  | mobile apps --- NISER can lead.                            |
| ility** |                                                            |
|         | *Source: Competitive differentiation*                      |
+---------+------------------------------------------------------------+
| **R     | Future iterations of the app can include survey            |
| esearch | instruments for NISER\'s household data collection ---     |
| data    | replacing paper-based field tools.                         |
| colle   |                                                            |
| ction** | *Source: Phase 4+ roadmap feature*                         |
+---------+------------------------------------------------------------+

## **3.2 App Architecture**

The NISER mobile app uses a clean architecture pattern with three
layers: Presentation (Flutter widgets), Domain (business logic, use
cases), and Data (API clients, local cache). This separation ensures the
app is maintainable and testable as it grows.

  ------------------ ----------------------------------------------------
  **Architecture     **Components and responsibilities**
  layer**            

  **Presentation     Screens and widgets built with Flutter Material 3.
  layer --- (Flutter Key screens: Home (news feed, featured publication,
  UI)**              upcoming event), Publications (searchable,
                     filterable archive), Publication Detail (PDF viewer,
                     citation export), Researchers (directory +
                     profiles), Insights (NISER Perspectives blog),
                     Events (calendar + detail), Open Data (CKAN dataset
                     browser), Search (Elasticsearch-powered), Settings
                     (notification preferences, offline downloads, text
                     size).

  **Domain layer --- Use cases: FetchLatestPublications,
  (Business logic)** SearchPublications, FetchResearcherProfile,
                     SyncORCIDPublications, GetUpcomingEvents,
                     DownloadPDFForOffline, SubscribeToNewsletter,
                     RegisterPushToken, TrackAnalyticsEvent. State
                     management via Riverpod (recommended) or BLoC
                     pattern.

  **Data layer ---   API clients for: Payload CMS REST API (content),
  (API + Cache)**    Elasticsearch REST API (search), CKAN API
                     (datasets), ORCID Public API (researcher
                     publications), MailerSend API (newsletter
                     subscribe). Local cache via flutter_secure_storage
                     (user prefs) + Hive (offline publication cache) +
                     SQLite via Drift (structured local data).
  ------------------ ----------------------------------------------------

## **3.3 App Screens and Features**

  ------------------- ---------------------------------- -------------------
  **Screen**          **Features**                       **Priority**

  **Home /            Featured publication card, latest  Launch --- Phase 2
  Dashboard**         NISER Perspectives posts           
                      (horizontal scroll), upcoming      
                      events widget, news ticker,        
                      quick-access shortcuts to Search   
                      and Publications                   

  **Publications      Search bar (Elasticsearch), filter Launch --- Phase 2
  archive**           chips (year, type, division,       
                      keyword), publication cards with   
                      thumbnail/abstract preview, sort   
                      by date/relevance/downloads        

  **Publication       Full abstract, author cards (tap   Launch --- Phase 2
  detail**            to researcher profile), PDF viewer 
                      (flutter_pdfview), citation export 
                      (copy BibTeX/APA), download for    
                      offline, share button with OG      
                      card, related publications         
                      carousel                           

  **Researcher        Grid/list view toggle, division    Launch --- Phase 2
  directory**         filter, search by name or          
                      expertise, researcher cards with   
                      photo and division badge           

  **Researcher        Full profile: photo, bio, research Launch --- Phase 2
  profile**           interests chips, current projects, 
                      publications list (auto-synced     
                      from ORCID), external links        
                      (ORCID, Scholar, ResearchGate),    
                      contact email button               

  **NISER             Post cards with author avatar,     Launch --- Phase 2
  Perspectives        date, read-time estimate, topic    
  (Blog)**            tag chips, in-app reader with      
                      clean typography, share button,    
                      related posts                      

  **Events**          Upcoming/past tabs, event detail   Launch --- Phase 2
                      with location map embed,           
                      registration button (opens browser 
                      or in-app WebView),                
                      add-to-calendar export,            
                      post-event: slides download +      
                      recording playback                 

  **Open Data         CKAN dataset catalogue, dataset    Phase 3
  browser**           detail with metadata and data      
                      preview (tabular view for CSV),    
                      multi-format download (CSV, Excel, 
                      Stata), methodology notes          
                      accordion                          

  **Search**          Unified search across all content  Launch --- Phase 2
                      types, instant results as user     
                      types (Elasticsearch), filter by   
                      content type, recent searches,     
                      no-results fallback with           
                      suggestions                        

  **Notifications**   Push notification inbox,           Phase 3
                      notification preferences           
                      (subscribe to: new publications,   
                      events, NISER Perspectives,        
                      CBN/NBS data releases),            
                      notification history               

  **Settings**        Dark/light mode toggle, text size  Phase 3
                      adjustment, offline downloads      
                      manager (view/delete cached PDFs), 
                      newsletter subscription            
                      management, app version,           
                      accessibility settings             

  **About NISER**     Institution mission, research      Launch --- Phase 2
                      divisions (tap to division page),  
                      leadership, contact details with   
                      map, social media links            
  ------------------- ---------------------------------- -------------------

## **3.4 Flutter Package Dependencies**

The following Flutter packages are required for the NISER mobile app.
All are available on pub.dev (Flutter\'s open-source package registry)
and are actively maintained.

  ----------------------------- --------------------------- -------------------------
  **Package (pub.dev)**         **Purpose**                 **Notes**

  flutter_riverpod              State management ---        Recommended over BLoC for
                                reactive, compile-safe      new projects

  dio                           HTTP client for REST API    Interceptor support for
                                calls (CMS, Elasticsearch,  auth headers
                                CKAN, ORCID)                

  go_router                     Declarative routing ---     Required for App Store
                                deep links, push            deep link support
                                notification navigation     

  hive_flutter                  Offline data cache for      Zero-dependency NoSQL;
                                publications and researcher very fast on mobile
                                profiles                    

  drift (sqlite)                Structured local database   Type-safe Dart query
                                for user preferences,       builder
                                download queue              

  flutter_pdfview               In-app PDF viewer for       Wraps native PDF engine
                                publications                on Android/iOS

  firebase_messaging            Push notifications via      Free tier supports
                                Firebase Cloud Messaging    NISER\'s volume
                                                            indefinitely

  firebase_analytics            In-app event tracking (sent Or use matomo_tracker
                                to Matomo via custom        package directly
                                backend)                    

  matomo_tracker                Direct Matomo analytics     No Google dependency;
                                integration in Flutter      NDPR compliant

  cached_network_image          Image caching with          Reduces redundant network
                                placeholder and error       requests
                                states                      

  flutter_markdown              Render Markdown content     For publication abstracts
                                from CMS in Flutter widgets and blog post bodies

  url_launcher                  Open external links, email, Required for researcher
                                phone, ORCID profiles       profile external links

  share_plus                    Native share sheet ---      iOS and Android share API
                                share publications,         
                                insights, events            

  flutter_local_notifications   Schedule local              Offline-capable; no
                                notifications for event     server required
                                reminders                   

  connectivity_plus             Detect network status; show Required for
                                offline mode gracefully     offline-first
                                                            architecture

  flutter_secure_storage        Store user preferences and  Uses Android Keystore /
                                auth tokens securely        iOS Keychain

  intl                          Date formatting, number     Required for Nigerian
                                formatting, localization    date/number formats

  sentry_flutter                Error monitoring and crash  Free tier: 5,000
                                reporting                   errors/month
  ----------------------------- --------------------------- -------------------------

## **3.5 App Store Submission Requirements**

  ------------------ -------------------------- --------------------------
  **Requirement**    **Google Play Store        **Apple App Store (iOS)**
                     (Android)**                

  **Developer        Google Play Developer      Apple Developer Program
  account**          account --- one-time \$25  --- \$99/year (USD)
                     fee                        

  **App identifier** com.niser.ng.app (reverse  com.niser.ng.app (same
                     domain notation)           identifier)

  **Signing**        Android keystore file ---  Apple certificate +
                     generated once, kept       provisioning profile ---
                     secure                     managed via Xcode or
                                                Fastlane

  **Screenshots      2 phone + 2 tablet         3 iPhone 6.5\" + 3 iPad
  required**         (7-inch + 10-inch)         Pro (if tablet support)

  **Icon             512×512px PNG, no rounded  1024×1024px PNG, no alpha
  requirements**     corners (Play applies      channel, no rounded
                     mask)                      corners

  **Privacy policy   Required --- link to       Required --- same URL
  URL**              niser.gov.ng/privacy       

  **Content rating** Fill out rating            Fill out questionnaire ---
                     questionnaire --- NISER    4+ rating for
                     qualifies as \'Everyone\'  reference/informational

  **Data safety      Declare what data is       App Privacy section ---
  form**             collected and why          same disclosures
                     (analytics, newsletter)    

  **Review time**    1--3 days typically        1--7 days typically (first
                                                submission may take
                                                longer)

  **Update           Direct upload via Play     Via App Store Connect or
  deployment**       Console or Fastlane CI/CD  Fastlane CI/CD

  **Beta testing**   Internal testing track (up TestFlight (up to 10,000
                     to 100 testers) before     external testers)
                     public release             

  **App size         Under 50MB APK / 100MB AAB Under 50MB IPA; Flutter
  target**           for good conversion rates  web assets excluded from
                                                app bundle
  ------------------ -------------------------- --------------------------

## **3.6 Mobile App CI/CD Pipeline**

A continuous integration and delivery pipeline ensures that every code
change is tested, built, and deployed consistently. The recommended
stack uses GitHub Actions + Fastlane.

  --------------- -------------------------------------------------------
  **CI/CD stage** **Implementation detail**

  **Code push     Developer pushes to a feature branch. GitHub Actions
  (GitHub)**      triggers automatically. All subsequent stages run in
                  the cloud --- no local build machine required.

  **Static        flutter analyze --- checks for code style violations,
  analysis**      potential bugs, and deprecated API usage. PR is blocked
                  if analysis fails.

  **Unit tests**  flutter test --- runs all unit tests in the test/
                  directory. Coverage report uploaded to Codecov. PRs
                  below 80% coverage trigger a warning.

  **Integration   flutter test integration_test/ --- runs widget
  tests**         integration tests on a virtual device. Tests cover
                  critical flows: search, publication download, profile
                  view, newsletter subscribe.

  **Build         flutter build appbundle \--release --- produces a
  (Android)**     signed .aab file. Signing keys stored as GitHub Actions
                  encrypted secrets.

  **Build (iOS)** flutter build ipa \--release --- requires macOS runner
                  (GitHub Actions provides macOS runners). Certificates
                  managed by Fastlane Match stored in a private Git
                  repository.

  **Beta          On merge to main: Fastlane uploads Android .aab to Play
  deployment**    Store internal testing track; uploads iOS .ipa to
                  TestFlight. NISER IT team receives TestFlight
                  invitation.

  **Production    Manual trigger from GitHub Actions workflow_dispatch:
  release**       promotes build from internal/TestFlight to production.
                  Requires approval from IT Unit head.

  **Crash         Sentry Flutter SDK reports crashes with stack traces to
  monitoring**    Sentry dashboard. Critical crashes trigger Slack/email
                  alert to development team.
  --------------- -------------------------------------------------------

## **3.7 Offline-First Architecture for Nigerian Connectivity**

Given Nigeria\'s connectivity landscape --- frequent network
interruptions and variable 3G/4G coverage outside Lagos, Abuja, and
major cities --- the NISER app is designed with an **offline-first
architecture**. Users can access core content without an active internet
connection.

  ------------------ ------------------------------- ---------------------
  **Feature**        **Implementation**              **Offline behaviour**

  **Publication      Last 20 viewed publications     Fully readable
  cache**            stored in Hive local storage    offline; PDF shown if
                     with full abstract and metadata previously downloaded

  **PDF offline      User taps \'Download for        Full PDF readable
  download**         offline\' on any publication;   offline; download
                     PDF stored in app sandbox via   queue syncs when
                     path_provider +                 online
                     flutter_secure_storage          

  **Home feed        Latest 10 news items, 5         Stale cache shown
  cache**            publications, 3 events cached   with \'Last updated\'
                     in Hive on last successful      timestamp
                     fetch                           

  **Search offline** Elasticsearch requires          \'You are offline\'
                     internet; offline fallback      banner; cached
                     shows recently searched items   results shown
                     from local cache                

  **Researcher       Profile data for last 10 viewed Basic profile (name,
  profiles cache**   researchers stored locally      division, interests)
                                                     readable offline

  **Events cache**   Next 5 upcoming events cached   Offline event detail
                     locally                         readable;
                                                     registration button
                                                     disabled

  **Connectivity     connectivity_plus monitors      Graceful degradation
  detection**        network state; offline banner   with clear user
                     appears within 2 seconds of     feedback, never a
                     connection loss                 blank screen

  **Background       On connection restore, app      No user action
  sync**             silently fetches latest content required; new content
                     and updates local cache in      available after sync
                     background                      
  ------------------ ------------------------------- ---------------------

## **3.8 Push Notification Strategy**

Push notifications are the app\'s primary engagement mechanism --- the
equivalent of the website newsletter for mobile users. NISER should use
notifications strategically to deliver high-value, low-frequency alerts
rather than promotional noise.

  ------------------ ------------------ ------------------ -----------------
  **Notification     **Trigger**        **Frequency**      **Opt-in
  type**                                                   required**

  **New publication  When a publication As published ---   Yes --- per
  alert**            is published in    maximum 2/week     research division
                     CMS and marked                        
                     \'notify\'                            

  **NISER            When a new         As published ---   Yes --- on by
  Perspectives       Insights post is   maximum 2/week     default
  post**             published                             

  **Upcoming event   24 hours before a  Per event --- user Yes --- per event
  reminder**         registered or      controls           registration
                     bookmarked event                      

  **Rapid-response   When Editor marks  As needed ---      Yes ---
  alert**            a post as          maximum 1/day      CBN/NBS/Budget
                     \'breaking\' in                       category
                     CMS                                   

  **Weekly digest    Every Sunday 08:00 Weekly             Yes --- off by
  push**             WAT --- summary of                    default
                     week\'s                               
                     publications                          

  **App update       On new app store   On release         System --- not
  available**        release                               user-controlled
  ------------------ ------------------ ------------------ -----------------

## **3.9 App Accessibility (Mobile WCAG --- WCAG 2.1 + APCA)**

Mobile accessibility follows WCAG 2.1 Mobile Success Criteria plus
platform-specific guidelines (Android Accessibility --- Material Design;
iOS Accessibility --- Human Interface Guidelines). The following Flutter
implementation standards apply across all screens:

-   All interactive widgets use Semantics() wrapper with meaningful
    label, hint, and onTap action descriptions. Screen readers (TalkBack
    on Android, VoiceOver on iOS) must be able to navigate the app
    entirely without sight.

-   Minimum tap target size of 44×44dp (WCAG 2.5.5) on all buttons,
    icons, and list items. Use InkWell with a padding wrapper or
    MaterialButton to enforce minimum sizing.

-   Text contrast ratio minimum 4.5:1 for body text, 3:1 for large text
    (18sp+ or 14sp+ bold). Tested using the Colour Contrast Analyser and
    Flutter\'s built-in accessibility checker.

-   Text size scales with the device\'s system font size. Use
    flutter_screenutil or MediaQuery.textScaler for responsive text.
    Test at text scale factor 1.0, 1.3, and 2.0.

-   Focus order is logical and follows reading order. Test with switch
    access (Android) and switch control (iOS) to verify
    keyboard-equivalent navigation.

-   All images use semanticLabel parameter on Image widgets. Decorative
    images use excludeFromSemantics: true.

-   Dynamic content changes are announced via
    SemanticsService.announce() --- for example, when search results
    update or a notification is received.

-   Colour is never the only means of conveying information --- all
    status indicators (loading, error, success) use both colour and
    icon/text.

# **4. Budget Comparison --- Plan A vs Plan B**

## **4.1 Side-by-Side Cost Table**

  ------------------------ ------------- ------------- ------------- -----------
  **Item**                 **Plan A      **Plan A      **Plan B      **Plan B
                           low**         high**        low**         high**

  Phase 1 --- Emergency    \$0           \$0           \$0           \$0
  triage (all actions)                                               

  Frontend development     \$0           \$0           \$0           \$0
  (web)                                                              

  CMS setup and content    \$0           \$0           \$0           \$0
  migration                                                          

  Mobile app development   ---           ---           \$0           \$0
  (Android + iOS)                                                    

  App Store registration   ---           ---           \$124         \$124
  (Play + Apple)                                                     

  UI/UX design (web +      \$0           \$0           \$0           \$0
  mobile)                                                            

  CKAN open data portal    \$0           \$0           \$0           \$0
  setup                                                              

  Elasticsearch setup and  ---           ---           \$0           \$0
  configuration                                                      

  Matomo setup (included   \$0           \$0           \$0           \$0
  in VPS)                                                            

  Hosting --- Vercel Pro   \$240         \$240         ---           ---
  (12 months)                                                        

  Hosting ---              \$84          \$300         ---           ---
  Render/Railway (12                                                 
  months)                                                            

  Hosting --- InterServer  ---           ---           \$72          \$288
  VPS (12 months)                                                    

  Newsletter ---           \$0           \$108         \$0           \$108
  Brevo/MailerSend (12                                               
  months)                                                            

  Firebase (push           ---           ---           \$0           \$0
  notifications, free                                                
  tier)                                                              

  Engagement and           \$0           \$0           \$0           \$0
  governance setup                                                   

  Contingency (10%)        \$32.4        \$64.8        \$19.6        \$52

  **TOTAL**                **\$356.4**   **\$712.8**   **\$125.6**   **\$572**
  ------------------------ ------------- ------------- ------------- -----------

## **4.2 Ongoing Monthly Costs Comparison**

  --------------------------- --------------------- ---------------------
  **Ongoing item**            **Plan A monthly**    **Plan B monthly**

  Hosting                     Vercel Pro \$20 +     InterServer VPS
                              Render \$7--25 =      \$6--24/month
                              \$27--45/month        

  Newsletter                  Brevo \$0--25/month   MailerSend
                              (free up to           \$0--30/month
                              9,000/month)          (3,000/month free)

  Analytics                   Plausible \$9/month   Matomo --- included
                                                    in VPS (self-hosted)

  Search                      Algolia free /        Elasticsearch ---
                              Meilisearch \$0       included in VPS
                              (self-hosted)         (self-hosted)

  CDN                         Cloudflare free tier  Cloudflare free tier
                              --- both plans        --- both plans

  Firebase (push notif)       Not applicable        Firebase free tier
                                                    (10,000 FCM/day)

  Apple Developer             Not applicable        \$99/year =
                                                    \~\$8.25/month

  Sentry error monitoring     Not applicable        Free tier (5,000
                                                    errors/month)

  **TOTAL ESTIMATE**          \$36--79/month        \$14--62/month +
                                                    \$99/year Apple
  --------------------------- --------------------- ---------------------

# **5. Recommendation and Decision Framework**

## **5.1 Overall Recommendation**

**For the NISER website alone: Plan A (Next.js + Headless CMS) is
recommended.** Next.js provides superior SEO --- critical for a research
institution whose publications must be indexed by Google Scholar, SSRN,
and academic aggregators. The talent pool of Next.js/React developers in
Nigeria is significantly larger, reducing maintenance risk. The 8-week
Phase 2 timeline is faster, and the cost is lower.

**For NISER as a digital institution including mobile: Plan B is
recommended, with one modification.** Use Next.js for the website
(retaining Plan A\'s SEO advantage), and build the mobile app in Flutter
as a separate project consuming the same CMS API. This hybrid approach
--- sometimes called a \'best-of-both\' architecture --- gives NISER the
SEO strength of Next.js and the single codebase efficiency of Flutter
for mobile, without compromise.

For **analytics**, replace Plausible with **Matomo on InterServer**
regardless of which plan is chosen. Data sovereignty is important for a
Nigerian government research institution and Matomo\'s additional
features (heatmaps, goals, session recordings) justify the additional
setup cost.

For **hosting**, use **InterServer VPS** if NISER has or will hire a
DevOps-capable IT staff member. If the team is small and deployment
simplicity is paramount, retain Vercel + Render (Plan A). The cost
difference is minimal.

## **5.2 Hybrid Architecture --- The Best of Both Plans**

  ------------------ -------------------------- ----------------------------
  **Component**      **Chosen stack**           **Rationale**

  **Website          Next.js 14 App Router +    Best SEO; largest developer
  frontend**         TypeScript                 pool in Nigeria; fastest
                                                publication indexing

  **CMS backend**    Payload CMS or WordPress   Shared between website and
                     headless                   mobile app via REST/GraphQL
                                                API

  **Mobile app**     Flutter (Dart) ---         Single codebase; native
                     Android + iOS              performance; offline-first;
                                                push notifications

  **Search**         Elasticsearch              Start simple; migrate to
                                                Elasticsearch when content
                                                exceeds 5,000 documents

  **Newsletter**     Brevo (marketing) +        Best-of-breed for each use
                     Postmark (transactional)   case; separate billing but
                                                combined API

  **Hosting ---      Vercel Pro (Next.js        Zero-config CDN deployment;
  web**              frontend)                  automatic preview
                                                environments

  **Hosting ---      InterServer VPS            Full control; price-locked;
  CMS/API**                                     runs Payload CMS, Matomo,
                                                and CKAN

  **Analytics**      Matomo (self-hosted on     Data sovereignty; heatmaps
                     InterServer)               and goals included free

  **Push             Firebase Cloud Messaging   Industry standard;
  notifications**    (free)                     flutter_firebase_messaging
                                                has excellent Flutter
                                                support

  **Open data**      CKAN on data.niser.gov.ng  Same recommendation in both
                                                plans; independent of
                                                web/mobile stack
  ------------------ -------------------------- ----------------------------

## **5.3 KPIs --- Additional Mobile App Targets**

The following KPIs supplement the website KPIs from the original
Implementation Plan v1.0, covering the mobile app specifically.

  ------------------------- --------------- ---------------- -------------
  **Mobile KPI**            **Baseline**    **Year-1         **Tool**
                                            target**         

  Google Play Store rating  ---             **≥ 4.0 stars**  Play Console

  Apple App Store rating    ---             **≥ 4.0 stars**  App Store
                                                             Connect

  Monthly active users      0 at launch     **≥ 2,000 MAU**  Matomo /
  (mobile)                                                   Firebase

  App installs (cumulative, 0 at launch     **≥ 5,000        Play + App
  year 1)                                   installs**       Store
                                                             analytics

  Push notification opt-in  ---             **≥ 40% of       Firebase
  rate                                      installs**       Console

  Push notification         ---             **≥ 20%**        Firebase
  click-through rate                                         Console

  Publications downloaded   0               **≥ 200 offline  App Matomo
  offline (monthly)                         downloads**      events

  Average session duration  ---             **≥ 3 minutes**  Matomo /
  (app)                                                      Firebase

  Crash-free session rate   ---             **≥ 99.5%**      Sentry /
                                                             Firebase
                                                             Crashlytics

  App size at launch        ---             **≤ 50MB         Play Console
                                            (Android APK)**  

  Time to interactive (app  ---             **\< 2 seconds   Flutter
  cold start)                               on mid-range     DevTools
                                            Android**        
  ------------------------- --------------- ---------------- -------------

NISER Nigeria --- Alternative Technology Implementation Plan v2.0 · May
2026 · Prepared by Claude (Anthropic)

Companion documents: Audit Report · Comparative Analysis · Gap Analysis
· Implementation Plan v1.0
