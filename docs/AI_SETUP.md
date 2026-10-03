AI & Search Services Setup
=========================

This document describes quick local setup options for the AI and search components used by the project: Qdrant (vector DB), Elasticsearch (keyword search), Ollama (local LLM), and Matomo (analytics).

1) Qdrant (vector database)
- Quick start using Docker:

```yaml
services:
  qdrant:
    image: qdrant/qdrant:v1.2.1
    container_name: qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant-data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334

volumes:
  qdrant-data:
```

- Set the env var `QDRANT_URL=http://localhost:6333` and optionally `QDRANT_API_KEY`.

2) Elasticsearch (optional)
- Quick start using Docker (single-node for dev):

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
```

- Set `ELASTICSEARCH_URL=http://localhost:9200` and optionally `ELASTICSEARCH_API_KEY`.

3) Ollama (self-hosted LLM)
- Run Ollama locally following Ollama's install instructions: https://ollama.com/docs
- Set `OLLAMA_URL` to the Ollama HTTP endpoint (e.g., `http://localhost:11434`) and optionally `OLLAMA_API_KEY` and `OLLAMA_MODEL`.

4) Matomo (self-hosted analytics)
- Quick start using Docker Compose (Matomo + MySQL). See Matomo docs for full production setup.

5) Notes on deployment
- The project expects the service URLs in environment variables. Update `.env.local` or your production env accordingly.
- To index CMS content for semantic search, run the admin ingest endpoint (example):

```bash
WEBHOOK_SECRET=your_secret npm run admin-ingest
```

6) Common troubleshooting
- If your services run in Docker on a separate network, use container hostnames (e.g., `http://qdrant:6333`) and ensure the app container can reach them.
- Use the runner scripts in `scripts/` to test endpoints locally:

```bash
npm run policy-monitor
npm run admin-ingest
npm run smoke-tests
```
