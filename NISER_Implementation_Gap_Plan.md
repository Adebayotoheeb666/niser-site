# NISER Implementation Gap Plan

## Purpose

This document captures the remaining implementation work needed in the current Next.js codebase to support the AI, search, analytics, email, and translation capabilities described in the existing alternative plan documents.

It is intended as a practical roadmap for turning the current repository into a fully implemented AI-enabled NISER website and supporting backend services.

## Scope

This implementation gap plan focuses on the areas that exist in the design documents but are not yet implemented in the repository:

- AI chatbot / RAG pipeline
- Semantic search / vector database integration
- AI policy brief generator
- Literature assistant / literature review AI
- Translation service (NLLB)
- Policy monitor and alert pipeline
- Matomo analytics integration
- Email / newsletter delivery integration
- Missing backend API routes and service wrappers

## Current implemented baseline

The repo already contains the following working features:

- CMS-backed Next.js site with content pages and dynamic routes
- `/app/api/search/route.ts` — keyword search across CMS content
- `/app/api/chatbot/route.ts` — chatbot endpoint with context matching and SSE streaming
- `/app/chatbot/page.tsx` — chatbot user interface
- `/app/search/page.tsx` — search UI with semantic/keyword toggle UI controls
- `/app/ai-policy-brief/page.tsx` — AI policy brief generator UI stub
- `/app/literature-assistant/page.tsx` — literature review assistant UI stub

## Missing implementation areas

### 1. Search and semantic search

Missing:

- Qdrant / vector database client integration
- Embedding generation and upsert workflow
- Semantically ranked search results
- UI-backend linkage for semantic search mode
- Search index population and sync from CMS

Needed files / services:

- `lib/ai/qdrant.ts` or equivalent client
- `lib/ai/embeddings.ts` or embedding service client
- Server-side route enhancements for `/api/search`
- Batch or webhook process to index publications, insights, events, news

### 2. AI chatbot / RAG pipeline

Missing:

- LLM service integration (Claude, Ollama, Llama 3, or other)
- RAG context retrieval from vector search
- Prompt engineering and citation generation
- Chat session / conversation state support

Needed files / services:

- `lib/ai/chat.ts` or LLM gateway client
- `lib/ai/qdrant.ts` for chunk retrieval
- `/app/api/chatbot/route.ts` enhancement or replacement
- Possibly `/app/api/embed/route.ts` or webhook endpoint for embedding ingestion

### 3. AI policy brief generator

Missing:

- Backend route for policy brief generation
- Claude / LLM call to summarize content and generate brief
- Internal API authentication for staff-only use
- Optional email delivery support via MailerSend / Postmark / Brevo

Needed files / services:

- `/app/api/policy-brief/route.ts`
- `lib/ai/claude.ts` or LLM wrapper
- `lib/email/*` service wrapper
- Optional `app/api/subscribe/route.ts` enhancements for newsletter signups

### 4. Literature review assistant

Missing:

- Backend AI synthesis endpoint for literature search and summarization
- Query routing to vector search + content retrieval
- Evidence/citation support for generated summaries

Needed files / services:

- `/app/api/literature-assistant/route.ts` or extend chatbot route
- `lib/ai/literature.ts` to manage literature-specific prompts

### 5. AI translation layer

Missing:

- Translation API proxy route
- NLLB service integration for Yoruba/Hausa/Igbo
- UI integration for translated content or translated queries

Needed files / services:

- `/app/api/translate/route.ts`
- `lib/ai/translate.ts`
- Environment config for `NLLB_SERVICE_URL`

### 6. Policy monitor and alerting

Missing:

- RSS / policy source ingestion pipeline
- Classifier and alert rule engine
- Periodic monitoring job or cron route
- Alerts via email or dashboard API

Needed files / services:

- `/app/api/policy-monitor/route.ts`
- `lib/policy-monitor/*.ts`
- `lib/ai/classifier.ts` or rules-based analysis

### 7. Analytics integration

Missing:

- Matomo event integration for chatbot and AI actions
- Matomo configuration in app layout or analytics wrappers
- Server-side Matomo tracking helper if self-hosted analytics is required

Needed files / services:

- `lib/matomo.ts`
- Layout or client hook integration to load Matomo scripts
- Environment config for `MATOMO_URL` and `MATOMO_SITE_ID`

### 8. Email / newsletter delivery

Missing:

- Newsletter signup route and dispatcher
- Email delivery service wrapper for MailerSend / Postmark / Brevo

Needed files / services:

- `/app/api/subscribe/route.ts` or enhancement to existing subscribe page
- `lib/email-service.ts`
- Integration with policy brief or alert workflows if sending reports

## Recommended implementation roadmap

### Phase 1 — Core AI and search foundation

1. Add reusable AI service clients and environment configuration.
   - `lib/ai/embeddings.ts`
   - `lib/ai/qdrant.ts`
   - `lib/ai/claude.ts` or `lib/ai/llm.ts`
   - `lib/ai/translate.ts`
   - `lib/matomo.ts`
   - `lib/email-service.ts`

2. Implement vector indexing and retrieval.
   - Establish CMS content chunking and embedding upsert flow.
   - Build a batch or webhook process for publications/insights/news/events.
   - Extend `/api/search` to return semantic results when requested.

3. Harden current search API.
   - Add pagination, type-safe search result schema, and error handling.
   - Add configuration for semantic vs keyword mode at the API layer.

### Phase 2 — AI feature endpoints

1. Replace or enhance `/api/chatbot/route.ts` with a true RAG pipeline.
   - Use Qdrant retrieve, then call the LLM.
   - Stream chatbot answers with source citations.
   - Include fallback logic for no relevant chunks.

2. Build the policy brief endpoint.
   - `/app/api/policy-brief/route.ts`
   - Authenticate internal users or staff.
   - Call the LLM and return structured brief output.

3. Build the literature assistant endpoint.
   - `/app/api/literature-assistant/route.ts`
   - Support search terms, content filters, and summary generation.

4. Build the translation endpoint.
   - `/app/api/translate/route.ts`
   - Proxy translation requests to NLLB service.

### Phase 3 — Monitoring, analytics, and delivery

1. Add Matomo tracking for AI interactions.
   - Track chatbot sessions and AI feature usage.
   - Add custom event labels for policy brief generation and translation.

2. Implement policy monitor and alert pipeline.
   - Define RSS sources and ingestion schedule.
   - Add classifier and alert rules.
   - Add email notifications or dashboard status.

3. Add email delivery support.
   - Complete newsletter signup route.
   - Use mail delivery service for alerts and policy brief notifications.

## Environment variables and secrets

Add or populate the following environment variables as needed:

- `QDRANT_URL`
- `QDRANT_API_KEY`
- `CLAUDE_API_KEY`
- `NLLB_SERVICE_URL`
- `MATOMO_URL`
- `MATOMO_SITE_ID`
- `MAILER_SEND_API_KEY` / `POSTMARK_API_KEY` / `BREVO_API_KEY`
- `INTERNAL_AI_SECRET`

## Recommended file targets

Use the following file structure as a guide for implementation:

- `lib/ai/qdrant.ts`
- `lib/ai/embeddings.ts`
- `lib/ai/claude.ts`
- `lib/ai/translate.ts`
- `lib/ai/chat.ts`
- `lib/matomo.ts`
- `lib/email-service.ts`
- `app/api/search/route.ts`
- `app/api/chatbot/route.ts`
- `app/api/policy-brief/route.ts`
- `app/api/literature-assistant/route.ts`
- `app/api/translate/route.ts`
- `app/api/policy-monitor/route.ts`
- `app/api/subscribe/route.ts`

## Notes and assumptions

- The current repository is a Next.js 14 app and should remain the main deployment target for web functionality.
- The AI plan is intended to be implemented as server-side features and API routes, not as client-only simulations.
- The existing page UIs for chatbot, policy brief, and literature assistant can be connected to the missing backend routes once they are implemented.
- Full self-hosted AI infrastructure is optional; the implementation can start with cloud-hosted models and move to Qdrant/NLLB self-hosting later.

## Next recommended step

Create the AI service layer first, then wire the existing UI pages to the new backend endpoints. This will keep the work incremental and provide clear validation points for each missing capability.
