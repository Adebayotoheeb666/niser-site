# NISER Digital Platform: Handoff Documentation

## 1. Design System Tokens (Sovereign Intelligence)

| Category | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Colors** | `surface` | #f8f9ff | Main page background |
| | `nigeria-green-deep` | #133306 | Primary brand color, headers, primary buttons |
| | `nigeria-green-vibrant` | #2d5a27 | Active states, success indicators |
| | `research-blue` | #1a365d | Secondary accents, data visualizations |
| **Typography** | `font-family` | Source Serif 4 | All headings and body copy (Institutional authority) |
| `headline-lg` | 32px / 1.2 | Page titles |
| `body-md` | 16px / 1.6 | Standard research text |
| **Spacing** | `margin-desktop` | 80px | Global horizontal page padding |
| `gutter` | 24px | Grid gap between cards |

## 2. Shared Components Summary

- **TopNavBar:** Desktop sticky header with division navigation and global search.
- **SideNavBar:** Internal workspace navigation for researchers.
- **Footer:** Institutional information and regulatory links.
- **ChatWidget:** RAG-enabled streaming interface component.

## 3. API Endpoints (Technical Spec v1.0)

| Service | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Chatbot** | POST | `/api/chatbot` | RAG streaming SSE endpoint for NISER Research Assistant. |
| **Search** | GET | `/api/search` | Hybrid BM25 + kNN search across publications and insights. |
| **Policy Brief** | POST | `/api/policy-brief` | AI-assisted drafting tool for researchers. |
| **Literature** | POST | `/api/embed` | Vector ingestion for external researcher PDFs. |
| **Translation** | POST | `/api/translate` | NLLB-powered translation (Yoruba, Hausa, Igbo). |

## 4. AI Infrastructure

- **Vector DB:** Qdrant (self-hosted)
- **Embeddings:** sentence-transformers/all-mpnet-base-v2
- **LLM:** Ollama + Llama 3.1 8B (Public Chat) / Claude 3.5 (Researcher Tools)
