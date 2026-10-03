**NISER NIGERIA · DIGITAL MODERNISATION PROGRAMME**

**Alternative Technology**

**Implementation Plan v2.1**

Now including AI & Chatbot Integration --- Section 6

Flutter Web + Mobile · Elasticsearch · InterServer · Matomo · MailerSend

+-----------+----------+-----------+-----------+----------+-----------+
| Version   | Base     | Mobile    | AI        | Timeline | Score     |
|           | stacks   | plan      | features  |          | target    |
| **2.1 +   |          |           |           | **12--14 |           |
| AI**      | **5      | **I       | **7       | months** | *         |
|           | altern   | ncluded** | capab     |          | *75/100** |
|           | atives** |           | ilities** |          |           |
+-----------+----------+-----------+-----------+----------+-----------+

+-----------------------------------+-----------------------------------+
| **Plan B v2.0 technologies**      | **New in v2.1 (this document)**   |
|                                   |                                   |
| -   Flutter Web + Mobile (Dart)   | -   AI Research Chatbot (RAG +    |
|                                   |     Llama 3)                      |
| ```{=html}                        |                                   |
| <!-- -->                          | -   Semantic search (Qdrant +     |
| ```                               |     embeddings)                   |
| -   Elasticsearch                 |                                   |
|                                   | -   AI Policy Brief Generator     |
| -   MailerSend / Postmark         |     (Claude API)                  |
|                                   |                                   |
| -   InterServer VPS hosting       | -   AI Literature Review          |
|                                   |     Assistant                     |
| -   Matomo Analytics              |                                   |
|     (self-hosted)                 | -   Content Recommendations       |
|                                   |     Engine                        |
|                                   |                                   |
|                                   | -   Policy Monitor & Alert        |
|                                   |     Pipeline                      |
|                                   |                                   |
|                                   | -   AI Translation --- Yoruba,    |
|                                   |     Hausa, Igbo                   |
+-----------------------------------+-----------------------------------+

# **Executive Summary**

This is Version 2.1 of the NISER Alternative Technology Implementation
Plan, which adds the complete **AI and Chatbot Integration section** to
the Flutter + Elasticsearch + InterServer + Matomo stack documented in
v2.0. The seven AI capabilities detailed in Section 6 are identical in
both Plan A v1.1 (Next.js) and Plan B v2.1 (Flutter) --- the AI layer is
stack-agnostic and consumes the same CMS APIs regardless of the frontend
technology used.

**Key difference in AI deployment between Plan A and Plan B:** In Plan
A, the RAG pipeline and vector database (Qdrant) run as serverless
functions on Vercel. In Plan B, they run as persistent services on the
InterServer VPS --- giving NISER full control over the AI infrastructure
at the cost of additional server administration. For the self-hosted
Llama 3 model (Capability 1), Plan B\'s VPS hosting is **significantly
better** --- a persistent GPU instance on the same VPS is more
cost-effective than spinning up a serverless GPU for each chat request.

## **AI Stack Comparison --- Plan A vs Plan B**

  ------------------ -------------------------- --------------------------
  **AI component**   **Plan A (Next.js +        **Plan B (Flutter +
                     Vercel)**                  InterServer)**

  **Vector database  Qdrant Cloud free tier or  Qdrant self-hosted on
  (Qdrant)**         Qdrant on Render           InterServer VPS --- full
                                                control

  **Embedding        API call to Hugging Face   Self-hosted
  model**            Inference API (free tier)  sentence-transformers on
                     or self-hosted             InterServer --- no API
                                                cost

  **LLM ---          Claude API (cloud) or      Ollama + Llama 3
  chatbot**          Ollama+Llama3 on a         persistent on InterServer
                     separate GPU instance      GPU add-on --- lowest
                                                latency

  **RAG pipeline**   Vercel Edge Function ---   Node.js service on
                     serverless, auto-scaling   InterServer --- always-on,
                                                lower cold-start latency

  **Policy Monitor   Vercel Cron (free, 1       Linux cron on InterServer
  cron**             job/day limit)             --- no limits, unlimited
                                                frequency

  **AI Translation   Hugging Face Inference API NLLB model on InterServer
  (NLLB)**           (free tier, rate limited)  --- unlimited, no rate
                                                limits

  **Matomo + AI      N/A --- Plausible used in  Matomo tracks chatbot
  analytics**        Plan A                     interactions as custom
                                                events --- unified
                                                analytics

  **Monthly AI infra \$20--60/month (Vercel     \$10--40/month (VPS
  cost**             functions + API calls)     share + API calls only
                                                where needed)
  ------------------ -------------------------- --------------------------

# **1--5. Technology Stack, Architecture, Phases, Mobile Plan, Budget**

**Note:** Sections 1--5 of this document contain the full content from
Implementation Plan v2.0 (Alternative Technology Implementation Plan).
This v2.1 edition appends Section 6 (AI & Chatbot Integration) to that
complete document. For the full technology stack comparison (Flutter vs
Next.js, Elasticsearch vs Algolia/Meilisearch, InterServer vs Vercel,
Matomo vs Plausible, MailerSend vs Brevo), mobile application
implementation plan, offline-first architecture, CI/CD pipeline, and
budget comparison, refer to Implementation Plan v2.0.

The following table summarises how AI integration changes the Phase 2--4
deliverable list in Plan B v2.1 relative to v2.0:

  ---------- --------------------------- ------------- -------------- ------------------
  **\#**     **New AI deliverable (Phase **Owner**     **Duration**   **Acceptance
             2--4)**                                                  criterion**

  **AI-1**   Research Chatbot --- Qdrant Developer     3 weeks        80% test queries
             on InterServer VPS,                                      answered;
             Ollama+Llama3 GPU service,                               streaming response
             streaming Flutter chat                                   \<3s on 3G
             widget                                                   

  **AI-2**   Semantic search --- Qdrant  Developer     1 week         Semantic results
             hybrid search integrated                                 in \<300ms; hybrid
             with Elasticsearch; Flutter                              ranking working
             search UI toggle                                         

  **AI-3**   Policy Brief Generator ---  Developer     2 weeks        Draft brief in
             Claude API connected to CMS                              \<60s; audit log
             Payload admin panel; audit                               captures all
             log                                                      fields

  **AI-4**   Literature Review Assistant Developer     2 weeks        Structured review
             --- Payload CMS editor                                   in \<3 min;
             panel; RAG + long-context                                researcher-only
             Claude API                                               access

  **AI-5**   Content Recommendations --- Developer     3 days         Related content on
             pre-computed at Payload CMS                              all publication
             publish time; Flutter                                    screens in app and
             carousel widget                                          web

  **AI-6**   Policy Monitor --- Linux    Developer +   2 weeks        Daily brief by
             cron + RSS + zero-shot      IT                           07:00 WAT;
             classifier + Claude Haiku                                relevant items
             API; MailerSend delivery                                 correctly flagged
                                                                      ≥80%

  **AI-7**   AI Translation --- NLLB-200 Developer     2 weeks        5 posts
             self-hosted on InterServer;                              translated +
             Flutter language selector;                               reviewed per
             Matomo tracks language                                   language at launch
             usage                                                    
  ---------- --------------------------- ------------- -------------- ------------------

## **Flutter-specific AI UI components**

The following Flutter widgets are added to the project for AI features:

  ---------------------------------------------------- ----------------------------------------------
  **Widget / file**                                    **Purpose**

  lib/features/chatbot/chat_screen.dart                Full-screen chat UI with message history,
                                                       streaming token display, source citation
                                                       cards, and privacy notice banner.

  lib/features/chatbot/chat_bubble.dart                Individual message widget with Markdown
                                                       rendering (flutter_markdown) and expandable
                                                       citations accordion.

  lib/features/search/semantic_toggle.dart             Toggle chip allowing users to switch between
                                                       keyword-only and AI-enhanced search modes.

  lib/features/recommendations/related_carousel.dart   Horizontal scroll carousel of pre-computed
                                                       related content cards --- publications,
                                                       researchers, events.

  lib/features/language/language_selector.dart         Bottom sheet language picker (English, Yoruba,
                                                       Hausa, Igbo) with translation status indicator
                                                       per content item.

  lib/services/ai/chatbot_service.dart                 Manages Server-Sent Events (SSE) HTTP stream
                                                       from the chatbot API endpoint; exposes
                                                       Stream\<String\> for the UI.

  lib/services/ai/search_service.dart                  Wraps Elasticsearch client with a
                                                       semantic/keyword mode flag; routes to correct
                                                       search endpoint based on user preference.
  ---------------------------------------------------- ----------------------------------------------

## **Updated Plan B v2.1 budget**

  ------------------------------ -------------- ------------- ----------------------------
  **Item**                       **Low (USD)**  **High        **Notes**
                                                (USD)**       

  Web + mobile frontend          \$0            \$0           Single codebase for web,
  (Flutter)                                                   Android, iOS

  CMS setup (Payload CMS)        \$0            \$0           Payload CMS recommended for
                                                              Plan B

  Mobile app --- AI UI           \$0            \$0           Additional Flutter widgets
  components (Flutter)                                        for AI features

  App Store registration         \$124          **\$124**     \$25 Play + \$99/yr Apple

  UI/UX design (web + mobile +   \$0            \$0           Includes chatbot widget
  AI)                                                         design

  CKAN open data portal          \$0            \$0           Same as Plan A

  WCAG + mobile accessibility    \$0            **\$0**       Web +
  audit                                                       Flutter/TalkBack/VoiceOver

  Elasticsearch setup + AI       \$0            \$0           InterServer VPS; GPU add-on
  vector integration                                          for Llama3

  AI integration --- all 7       \$0            **\$0**       Setup + first-year model
  capabilities                                                costs

  InterServer VPS (12 months)    \$72           **\$288**     \$6--24/month price-locked

  MailerSend (12 months)         \$0            **\$108**     Free 3,000/month; \$30/month
                                                              at scale

  Firebase (push notifications,  \$0            **\$0**       Free tier permanent
  12 months)                                                  

  AI ongoing (12 months)         \$17           **\$145**     Lower than Plan A --- more
                                                              self-hosted

  Contingency (10%)              \$21.3         **\$66.5**    Buffer for mobile scope
                                                              changes

  **TOTAL v2.1 (web + mobile +   \$234.3        **\$731.5**   Complete programme including
  AI)**                                                       mobile app and AI
  ------------------------------ -------------- ------------- ----------------------------

# **AI & Chatbot Integration Plan**

This section details the Artificial Intelligence and Chatbot integration
strategy for the NISER website and mobile application. Rather than a
single monolithic AI feature, the plan introduces **seven distinct
AI-powered capabilities** phased across the implementation timeline ---
from a simple conversational research assistant at launch to a fully
autonomous policy monitoring and briefing system by month twelve. All AI
integrations are designed to **augment NISER\'s human research
capacity** without replacing editorial judgement or researcher
expertise.

Each integration is evaluated for **cost**, **data privacy** (critical
given NISER\'s government affiliation and NDPR obligations), **technical
complexity**, and **institutional value**. Where AI models are used,
NISER\'s sensitive internal data never leaves its own infrastructure
unless an explicit decision to use a cloud API is made and documented.

+-----------------+-----------------+-----------------+-----------------+
| AI capabilities | Launch-ready    | Phase 3--4      | Self-hosted AI  |
|                 | (Phase 2)       | features        | options         |
| **7             |                 |                 |                 |
| integrations**  | **3 features**  | **4 features**  | **4 of 7**      |
+-----------------+-----------------+-----------------+-----------------+

## **AI Capability Overview**

  -------- ------------------- -------------- ------------ ---------------- ----------------
  **\#**   **Capability**      **Primary      **Phase**    **Model/tool**   **NDPR risk**
                               user**                                       

  **1**    **NISER Research    Public         Phase 2      Llama 3          Low ---
           Chatbot**           visitors,                   (self-hosted)    self-hosted
                               researchers                                  

  **2**    **AI-Powered        All users      Phase 2      Semantic         Low ---
           Publication                                     embeddings       on-premise
           Search**                                                         

  **3**    **Automated Policy  Research staff Phase 2      Claude API /     Medium --- API
           Brief Generator**                               GPT-4o           call

  **4**    **AI Literature     Researchers    Phase 3      Claude API + RAG Medium --- API
           Review Assistant**                                               call

  **5**    **Intelligent       Website        Phase 3      On-device ML     Low --- no data
           Content             visitors                                     sent
           Recommendations**                                                

  **6**    **Automated Policy  Research staff Phase 4      LLM + RSS        Low ---
           Monitoring &                                    pipeline         summarisation
           Alerts**                                                         only

  **7**    **AI Translation    Public ---     Phase 4      NLLB             Low ---
           Layer**             multilingual                (self-hosted)    self-hosted
  -------- ------------------- -------------- ------------ ---------------- ----------------

## **Capability 1 --- NISER Research Chatbot**

**What it does:** A conversational AI assistant embedded on the NISER
website and mobile app that answers questions about NISER\'s research,
publications, and policy areas. Visitors can ask questions such as
\'What has NISER published on agricultural policy in the last 3 years?\'
or \'Who is NISER\'s expert on poverty measurement?\' and receive
accurate, source-cited answers drawn exclusively from NISER\'s own
content.

  ------------------ ------------------------------------------------------
  **Aspect**         **Detail**

  **Model**          Llama 3.1 8B (Meta, open-source) --- self-hosted on
                     InterServer VPS or a dedicated GPU instance.
                     Alternatively: Claude Haiku API or GPT-4o mini API for
                     lower infrastructure overhead at slightly higher
                     variable cost.

  **Architecture**   Retrieval-Augmented Generation (RAG). The model does
                     NOT answer from training data --- it retrieves
                     relevant chunks from NISER\'s indexed content
                     (publications, researcher profiles, policy briefs,
                     news) via Elasticsearch or Meilisearch, then generates
                     a grounded, cited response.

  **Knowledge base** NISER publications (abstracts + full text where
                     available), researcher profiles, policy briefs, news
                     items, CKAN dataset descriptions, and the About NISER
                     pages. Updated automatically whenever new content is
                     published in the CMS.

  **Interface**      Floating chat widget on all website pages
                     (bottom-right); dedicated \'Ask NISER\' screen in the
                     mobile app. Supports multi-turn conversation
                     (remembers context within the session). \'Clear chat\'
                     button for privacy.

  **Citation         Every response includes a \'Sources\' section listing
  requirement**      the specific NISER publications or pages used. Links
                     open the source document directly. The chatbot
                     explicitly states it cannot answer questions outside
                     NISER\'s knowledge base.

  **Guardrails**     System prompt strictly limits the chatbot to NISER\'s
                     research domain. Questions outside scope (e.g.,
                     general knowledge, political opinions, personal
                     advice) receive: \'I can only assist with questions
                     related to NISER\'s research and publications. For
                     this topic, please consult \[alternative resource\].\'

  **NDPR             No personally identifiable information is stored. Chat
  compliance**       sessions are ephemeral --- not logged to any database.
                     If a user provides their name or email in the chat, it
                     is not retained. A privacy notice appears when the
                     chat widget is first opened.

  **Fallback**       If the chatbot cannot find a relevant answer with
                     sufficient confidence, it responds: \'I don\'t have
                     enough information to answer this accurately. I
                     recommend contacting NISER directly at \[email\] or
                     browsing the Publications section.\' No hallucinated
                     answers.

  **Cost estimate**  Self-hosted Llama 3.1 8B: \$0 model cost +
                     \$20--40/month GPU compute (Vast.ai or RunPod). Claude
                     Haiku API: \~\$0.25 per 1,000 conversations at average
                     4,000 tokens each. At 500 conversations/month:
                     \~\$0.50. Highly affordable.
  ------------------ ------------------------------------------------------

### **Chatbot implementation steps**

-   Set up a vector database (Qdrant --- open source, self-hosted) or
    use Elasticsearch\'s built-in dense vector search. Qdrant runs on
    the InterServer VPS with 512MB RAM.

-   Build a document ingestion pipeline: every time a publication,
    profile, or news item is published in the CMS, a Next.js or Payload
    CMS webhook fires a Python script that: (1) fetches the content, (2)
    splits it into 500-token chunks, (3) generates embeddings using the
    sentence-transformers/all-MiniLM-L6-v2 model (free, self-hosted),
    and (4) stores the chunks and embeddings in Qdrant.

-   Build the RAG query pipeline: user message → generate embedding →
    retrieve top-5 most similar chunks from Qdrant → inject chunks as
    context into the LLM system prompt → generate cited response →
    stream to the frontend widget.

-   Build the chat widget in React (for the Next.js site) or Flutter
    (for the mobile app). Use Server-Sent Events (SSE) for streaming
    token-by-token response display --- the same pattern used by
    ChatGPT\'s interface.

-   Write the system prompt with strict domain boundaries, citation
    instructions, and the fallback response protocol. Test with 50
    representative queries before launch.

-   Deploy a monitoring dashboard (LangSmith free tier or a simple
    PostgreSQL log of query categories, response latency, and fallback
    rate) to track chatbot quality over time. Review monthly.

  ------------------ ------------------------------------------------------------
  **Type**           **Chatbot vs Traditional Search --- Advantages and
                     Disadvantages**

  **Advantage**      Conversational discovery --- users can ask natural language
                     questions rather than constructing keyword search queries.
                     Critical for non-technical policymakers and journalists who
                     don\'t know NISER\'s exact publication titles or author
                     names.

  **Advantage**      Multi-hop reasoning --- the chatbot can answer compound
                     questions like \'Compare NISER\'s findings on poverty
                     reduction in the North vs South over the last 5 years\' by
                     synthesising across multiple publications in a single
                     response.

  **Advantage**      24/7 availability --- NISER\'s research expertise is
                     accessible at any time without requiring a researcher to
                     respond to individual enquiries.

  **Disadvantage**   Requires maintenance as knowledge base grows --- the vector
                     index must be kept current. Automated pipeline mitigates
                     this but requires initial engineering investment.

  **Disadvantage**   Potential for confident-sounding errors --- even with RAG,
                     LLMs can occasionally misrepresent source material. Human
                     review of chatbot responses should be conducted monthly to
                     catch systematic errors.
  ------------------ ------------------------------------------------------------

## **Capability 2 --- AI-Powered Semantic Publication Search**

**What it does:** Upgrades the standard keyword search
(Meilisearch/Elasticsearch) with semantic vector search ---
understanding the meaning of a query, not just its keywords. A user
searching for \'food insecurity causes in northern Nigeria\' will find
publications about \'agricultural drought\', \'pastoralist conflict\',
and \'fertiliser subsidy removal\' even if those exact words were not in
the search query.

  ---------------- ------------------------------------------------------
  **Aspect**       **Detail**

  **Technology**   Hybrid search: keyword matching (BM25, via
                   Elasticsearch or Meilisearch) + dense vector
                   similarity search (via Qdrant or Elasticsearch\'s
                   built-in kNN). Results are merged using Reciprocal
                   Rank Fusion (RRF) for optimal relevance.

  **Embedding      sentence-transformers/all-mpnet-base-v2 --- a free,
  model**          open-source model that produces 768-dimensional
                   embeddings. Self-hosted. Average encoding time: 50ms
                   per document on CPU. For NISER\'s expected corpus of
                   under 5,000 publications, this is entirely adequate.

  **User           Search bar shows a \'Semantic search\' badge
  experience**     indicating AI-powered results. A toggle allows users
                   to switch between \'Keyword only\' and \'AI-enhanced\'
                   results for comparison. Both modes return results in
                   under 500ms.

  **Re-ranking**   Optional: Cohere Rerank API (free tier: 1,000
                   requests/month) re-ranks the top-20 candidates from
                   the vector search using a cross-encoder model for
                   higher precision. At NISER\'s query volume, the free
                   tier is sufficient indefinitely.

  **Cost**         \$0 --- all components self-hosted. Cohere Rerank free
                   tier covers expected query volume.
  ---------------- ------------------------------------------------------

## **Capability 3 --- Automated Policy Brief Generator (Internal Tool)**

**What it does:** An internal AI tool, accessible only to authenticated
NISER researchers via the CMS admin panel, that generates a draft policy
brief from a selected working paper or set of publications. The
researcher selects 1--3 source documents, specifies the target audience
(Federal Ministry, State Government, Development Partners, Media), and
the AI produces a structured 2-page draft brief that the researcher then
edits and approves before publication.

  ----------------------- ------------------------------------------------------
  **Aspect**              **Detail**

  **Model**               Claude 3.5 Sonnet API (Anthropic) --- recommended for
                          long-form structured document generation with precise
                          instruction following. Alternatively: GPT-4o. Both
                          available via REST API.

  **Brief structure**     Introduction (100 words), Key Findings (200 words,
                          bullet points), Policy Implications (200 words),
                          Recommendations (150 words, numbered list), Data
                          Sources (auto-generated from source documents). Total:
                          \~650--750 words. Formatted as a Payload CMS draft
                          entry, ready for editorial review.

  **Prompt engineering**  The system prompt instructs the model to: use plain
                          language (Grade 10 reading level), avoid academic
                          jargon, cite specific NISER publications by title and
                          year, focus on actionable recommendations for the
                          specified audience, and flag any claims in the source
                          documents that are ambiguous or require human
                          verification.

  **Human-in-the-loop**   The AI output is always a draft. It is saved to a
                          \'Draft --- AI generated\' status in the CMS. A named
                          researcher must review, edit, and explicitly approve
                          before it moves to \'Ready for publication\'. The
                          published brief always shows the human author, not
                          \'AI\'.

  **Cost**                At 10 policy briefs/month × \~8,000 tokens each:
                          approximately \$2.40/month at Claude 3.5 Sonnet
                          pricing. Negligible.

  **Audit log**           Every AI-generated brief records: which source
                          documents were used, which model version was called,
                          the timestamp, and which researcher approved it. This
                          audit log is stored in the CMS and available to
                          NISER\'s Director on request.
  ----------------------- ------------------------------------------------------

## **Capability 4 --- AI Literature Review Assistant (Internal Tool)**

**What it does:** A researcher-facing tool that synthesises NISER\'s
publication archive plus selected external sources (uploaded PDFs or
URLs) into a structured literature review on a specified topic. The
researcher provides a research question and the tool returns: a thematic
summary of what NISER has published, identified gaps in the existing
literature, key disagreements between sources, and suggested related
external literature to consult.

  ------------------ ------------------------------------------------------
  **Aspect**         **Detail**

  **Architecture**   RAG + long-context LLM. Researcher inputs a
                     topic/question → system retrieves top-20 most relevant
                     NISER publication chunks from Qdrant → researcher can
                     upload up to 5 additional PDFs (processed via pypdf) →
                     all context sent to Claude 3.5 Sonnet (200K context
                     window) → structured review generated.

  **Output format**  Markdown document exported to the CMS as a draft
                     working note. Sections: Research Question, NISER
                     Internal Literature Summary (with citations), External
                     Literature Summary, Identified Gaps, Methodological
                     Notes, Recommended Next Steps.

  **Data privacy**   Uploaded external PDFs are processed in memory and not
                     stored. No external document content is permanently
                     retained. NISER\'s own content is already in the
                     self-hosted Qdrant database --- no new privacy
                     exposure.

  **Integration**    Available as a panel within the Payload CMS editor.
                     Researcher opens a new \'Working Paper\' entry, clicks
                     \'AI Literature Review\', enters the research
                     question, uploads external sources, and receives the
                     draft review as a formatted CMS block they can edit in
                     place.

  **Cost**           Estimated \$20--50/month depending on usage frequency.
                     20 literature reviews/month at 50,000 tokens each ≈
                     \$30/month at Claude 3.5 Sonnet API pricing.
  ------------------ ------------------------------------------------------

## **Capability 5 --- Intelligent Content Recommendations**

**What it does:** A recommendation engine that surfaces relevant NISER
content to website and app users based on their current reading context
--- not personal tracking data. When reading a publication about
agricultural finance, the system recommends related publications, the
relevant researcher\'s profile, and upcoming events on the same topic.

  ------------------ ------------------------------------------------------
  **Aspect**         **Detail**

  **Privacy          Content-based filtering only --- no user tracking, no
  approach**         cookies, no user profile stored. Recommendations are
                     based entirely on the content currently being viewed,
                     not on who is viewing it. Fully NDPR compliant by
                     design.

  **Algorithm**      At publication time, each document\'s embedding is
                     computed and its top-10 nearest neighbours in the
                     Qdrant vector space are pre-computed and stored as a
                     \'related_content\' field in the CMS. On page load,
                     the Next.js/Flutter app fetches these pre-computed
                     recommendations --- zero runtime AI cost, zero
                     latency.

  **Recommendation   \'Related publications\' carousel on each publication
  surfaces**         page (3 items), \'You may also find useful\' on
                     researcher profile pages (2 publications by the same
                     researcher + 2 by similar researchers), \'Related
                     events\' on the homepage news feed, \'Continue
                     exploring\' section at the bottom of each NISER
                     Perspectives post.

  **Mobile app**     Flutter app displays recommendations as a horizontal
                     scroll card carousel below each content item. Cards
                     include title, publication type badge, and \'Save for
                     offline\' button.

  **Cost**           \$0 --- all pre-computed at build/publish time using
                     the existing Qdrant/embedding infrastructure from
                     Capability 1.
  ------------------ ------------------------------------------------------

## **Capability 6 --- Automated Policy Monitoring & Research Alerts**

**What it does:** An automated daily pipeline that monitors Nigerian
policy news sources (CBN, NBS, Federal Ministry of Finance, National
Assembly, IMF Nigeria, World Bank Nigeria), identifies developments
relevant to NISER\'s research divisions, summarises them using an LLM,
and delivers a structured daily briefing to designated NISER researchers
by 07:00 WAT each morning --- enabling NISER\'s rapid-response
commentary capability.

  ---------------- ------------------------------------------------------
  **Aspect**       **Detail**

  **Data sources   CBN press releases (RSS), NBS data releases (RSS),
  monitored**      Federal Ministry of Finance publications, IMF Nigeria
                   Article IV, World Bank Nigeria blog, National Assembly
                   bills database, major Nigerian financial news
                   (Businessday, Punch Business, The Cable --- RSS only,
                   no scraping of paywalled content).

  **Pipeline**     Cron job at 05:00 WAT daily: (1) Fetch all RSS feeds,
                   (2) Filter items published in the last 24 hours, (3)
                   For each item, classify relevance to NISER research
                   divisions using a zero-shot classification model
                   (facebook/bart-large-mnli --- self-hosted), (4)
                   Summarise relevant items using Claude Haiku API
                   (lowest cost), (5) Format into a structured daily
                   brief by division, (6) Send via Brevo/MailerSend to
                   division heads.

  **Alert format** Subject: \'NISER Policy Monitor --- \[Date\] --- \[N\]
                   items across \[divisions\]\'. Body: sections per
                   division with item title, source, 2-sentence summary,
                   relevance score, and a \'Write rapid response?\'
                   button that pre-populates the CMS Insights editor with
                   the topic and a draft title.

  **Urgency        If a high-impact event is detected (e.g., MPR rate
  escalation**     change, CPI data release, budget presentation), an
                   immediate push notification is sent to the mobile app
                   in addition to the email --- bypassing the daily
                   schedule.

  **Cost**         \~\$5--15/month. Claude Haiku at \~\$0.25/million
                   tokens; 50 summaries/day × 300 tokens = 15,000
                   tokens/day = \~\$1.13/month. Classification model
                   self-hosted: \$0. RSS fetching: \$0.

  **Data privacy** No user data is processed. All data is from public RSS
                   feeds. Summaries are sent only to authenticated NISER
                   email addresses. No third-party receives NISER\'s
                   internal data.
  ---------------- ------------------------------------------------------

## **Capability 7 --- AI Translation Layer (Yoruba, Hausa, Igbo)**

**What it does:** An AI-powered translation layer that makes NISER\'s
policy briefs, NISER Perspectives posts, and key homepage content
available in Nigeria\'s three major languages --- Yoruba, Hausa, and
Igbo --- using Meta\'s NLLB-200 (No Language Left Behind) open-source
translation model, self-hosted on the InterServer VPS.

  ------------------ ------------------------------------------------------
  **Aspect**         **Detail**

  **Model**          NLLB-200-distilled-600M (Meta, open-source, Apache 2.0
                     licensed). Supports 200 languages including Yoruba
                     (yor_Latn), Hausa (hau_Latn), and Igbo (ibo_Latn).
                     Self-hosted --- no API cost, no data sent to third
                     parties. Runs on CPU (slower) or GPU (faster).

  **Quality note**   NLLB quality for Nigerian languages is functional but
                     imperfect, particularly for technical economic
                     terminology. The recommended workflow: AI translation
                     → human reviewer (one per language, can be a NISER
                     associate or volunteer) → published translation. AI
                     produces first draft in seconds; human reviewer spends
                     15--30 minutes on quality.

  **Content scope**  Phase 4 launch: NISER Perspectives blog posts only
                     (highest public value, shortest format). Phase 4
                     expansion: policy brief summaries (executive summary
                     section only). Future: full publication abstracts.

  **UI               Language selector in website header and mobile app
  implementation**   settings (Ẹ̀dèYorùbá \| Hausa \| Igbo \| English).
                     Translated content stored as separate CMS entries
                     linked to the English original. URL pattern:
                     /yo/insights/\[slug\], /ha/insights/\[slug\],
                     /ig/insights/\[slug\].

  **Cost**           \$0 for the model. GPU compute if needed:
                     \$10--20/month on Vast.ai for a shared GPU instance
                     for translation jobs. On CPU, translation of a
                     600-word article takes approximately 30--60 seconds
                     --- acceptable for a background job.

  **Institutional    NISER is one of very few Nigerian research
  significance**     institutions whose research outputs would be
                     accessible in indigenous Nigerian languages. This is a
                     significant differentiator for NISER\'s public
                     communication mandate and its relationship with state
                     governments.
  ------------------ ------------------------------------------------------

## **AI Governance and Responsible Use Policy**

All AI features at NISER are subject to the following governance
principles. These must be documented in NISER\'s Content Governance
Policy and reviewed annually by the Director and IT Unit Head.

  ------------------ ----------------------------------------------------
  **Principle**      **Implementation requirement**

  **Human oversight  No AI-generated content may be published without
  mandatory**        explicit approval by a named NISER researcher or
                     editor. AI tools produce drafts; humans produce
                     publications.

  **Transparency to  The NISER Research Chatbot must always identify
  users**            itself as an AI assistant. All published content
                     that used AI assistance in drafting must carry a
                     disclosure: \'This brief was drafted with AI
                     assistance and reviewed by \[Researcher Name\].\'

  **Data             AI tools must not store, log, or transmit user query
  minimisation**     data unless the user has explicitly consented. Chat
                     sessions are ephemeral. No personal data is used to
                     train or fine-tune any model.

  **NDPR compliance  Any AI capability that processes data from Nigerian
  review**           residents (chatbot queries, newsletter signup
                     interactions) must be reviewed by NISER\'s Data
                     Protection Officer before deployment and documented
                     in the NDPR compliance register.

  **Model versioning Every AI-generated content item in the CMS must
  and audit**        record: model name, model version, date generated,
                     and approving researcher. This audit log must be
                     retained for 5 years.

  **Hallucination    The chatbot fallback rate (queries that couldn\'t be
  monitoring**       answered) and any reported errors must be reviewed
                     monthly. A researcher must be designated as the AI
                     Quality Officer responsible for this review.

  **Vendor lock-in   Where possible, open-source self-hosted models
  avoidance**        (Llama 3, NLLB-200, sentence-transformers) are
                     preferred over proprietary APIs. Where proprietary
                     APIs are used (Claude, GPT-4o), the system must be
                     designed to swap providers with a single
                     configuration change.

  **Annual AI ethics Each AI capability is reviewed annually for:
  review**           unintended bias in outputs (particularly regarding
                     regional or political balance in Nigerian economic
                     content), accuracy degradation as NISER\'s content
                     evolves, and changes in the regulatory landscape for
                     AI in Nigeria.
  ------------------ ----------------------------------------------------

## **AI Integration Budget Summary**

  -------------------------- -------------- ----------- ----------------------
  **Capability**             **Monthly      **Monthly   **Notes**
                             (low)**        (high)**    

  1\. Research Chatbot       **\$0**        **\$40**    Self-hosted: \$0/mo;
                                                        Claude API:
                                                        \~\$20--40/mo

  2\. Semantic Search        **\$0**        **\$0**     All self-hosted;
                                                        Cohere free tier for
                                                        reranking

  3\. Policy Brief Generator **\$2**        **\$15**    Claude Haiku API; very
                                                        low token volume

  4\. Literature Review      **\$10**       **\$50**    Claude Sonnet API;
  Assistant                                             researcher-initiated
                                                        only

  5\. Content                **\$0**        **\$0**     Pre-computed; no
  Recommendations                                       runtime cost

  6\. Policy Monitor &       **\$5**        **\$20**    Claude Haiku API; RSS
  Alerts                                                pipeline on VPS

  7\. AI Translation Layer   **\$0**        **\$20**    Self-hosted NLLB;
                                                        optional GPU instance

  **Total AI integration**   **\$17**       **\$145**   Conservative monthly
                                                        average: \~\$60--80/mo
  -------------------------- -------------- ----------- ----------------------

**Total AI budget in context:** The complete AI integration programme
adds \$0 to the one-time implementation cost and \$17--145/month to
ongoing costs --- averaging approximately \$8.5 --72.5/month at
realistic usage levels. For a federal research institution with NISER\'s
mandate and budget, this is a transformative capability investment at a
negligible operational cost.

## **AI Integration Phased Timeline**

  ------------ --------------- ------------------ -------------------------
  **Phase**    **Timeline**    **AI capabilities  **Acceptance criterion**
                               deployed**         

  **Phase 2**  Days 31--90     Capabilities 1, 2, Chatbot answers 80% of
               (launch)        5 --- Chatbot,     test queries correctly
                               Semantic Search,   with citations; Semantic
                               Recommendations    search returns relevant
                                                  results within 500ms;
                                                  Recommendations appear on
                                                  all publication pages

  **Phase 3**  Days 91--180    Capabilities 3, 4  Policy Brief Generator
                               --- Policy Brief   produces a draft brief
                               Generator,         from any NISER
                               Literature Review  publication in under 60
                               Assistant          seconds; Literature
                                                  Review tool returns a
                                                  structured review within
                                                  3 minutes; Both tools
                                                  have audit log active in
                                                  CMS

  **Phase 4**  Days 181--365   Capabilities 6, 7  Daily policy brief email
                               --- Policy         delivered by 07:00 WAT;
                               Monitor, AI        At least 5 Insights posts
                               Translation        translated into Yoruba
                                                  and Hausa within 30 days
                                                  of tool launch;
                                                  Translation quality
                                                  reviewed and approved by
                                                  designated language
                                                  reviewers
  ------------ --------------- ------------------ -------------------------

# **Conclusion**

**Plan B v2.1** represents the most comprehensive digital transformation
option for NISER --- delivering a unified web and mobile codebase
(Flutter), enterprise-grade search (Elasticsearch), full infrastructure
control (InterServer VPS), complete data sovereignty (Matomo), and seven
AI-powered capabilities, all within a single integrated implementation
programme.

For NISER\'s decision-makers, the choice between Plan A v1.1 and Plan B
v2.1 reduces to a single strategic question: **Is a mobile app a
priority alongside the website?** If yes, Plan B v2.1 delivers the most
efficient path --- a single Flutter codebase produces all three. If the
website is the primary focus and mobile can wait, Plan A v1.1 is faster,
cheaper, and better optimised for SEO and research publication
discovery. In either case, the AI capabilities in Section 6 are
identical and recommended.

NISER Nigeria · Alternative Technology Implementation Plan v2.1 · May
2026

Companion: Audit Report · Comparative Analysis · Gap Analysis · Plan
v1.1
