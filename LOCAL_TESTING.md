# NISER Local Testing Guide

Complete guide for testing all NISER features locally before deploying to InterServer.

---

## 🚀 Quick Start

### 1. Run the Setup Script (First Time Only)
```bash
bash setup-local-dev.sh
```

This will:
- ✅ Check Docker, Node.js, and npm
- ✅ Configure `.env.local` for local development
- ✅ Install npm dependencies
- ✅ Start Docker services (Elasticsearch, Qdrant, Matomo)
- ✅ Build the Next.js application
- ✅ Create sample test data

### 2. Start the Next.js Dev Server
In a new terminal:
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
```

### 3. Open in Browser
Visit: **http://localhost:3000**

---

## 📋 Service Health Checks

### Verify All Services Are Running
```bash
# List running containers
docker-compose ps

# Expected output:
# NAME                COMMAND             SERVICE          STATUS      PORTS
# niser-app           ...                 app              Up          3000/3000
# niser-elasticsearch ...                 elasticsearch    Up          9200/9200
# niser-nginx         ...                 nginx            Up          80/80, 443/443
# qdrant              ...                 qdrant           Up          6333/6333
# matomo              ...                 matomo           Up          8081/80
# matomo-db           ...                 matomo-db        Up          3306/3306
```

### Test Individual Services

#### Elasticsearch
```bash
curl http://localhost:9200

# Expected response (200 OK):
# {
#   "name" : "elasticsearch-container-id",
#   "cluster_name" : "docker-cluster",
#   "cluster_uuid" : "...",
#   "version" : { "number" : "8.11.0", ... }
# }
```

#### Qdrant
```bash
curl http://localhost:6333/health

# Expected response (200 OK):
# {"status":"ok"}
```

#### Matomo
```bash
open http://localhost:8081

# You'll see Matomo setup wizard on first visit
```

#### Next.js App
```bash
curl http://localhost:3000

# Should return HTML homepage
```

---

## 🧪 Feature-by-Feature Testing

### Test 1: Chatbot (RAG Pipeline)

#### Prerequisites
- Qdrant running
- Content indexed in Qdrant
- LLM configured (Ollama or Claude API)

#### Step 1: Ingest Content to Vector Store
```bash
curl -X POST http://localhost:3000/api/embed \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $WEBHOOK_SECRET" \
  -d '{}'

# Expected response:
# {
#   "message": "Content synchronized to vector store",
#   "documents_indexed": 42,
#   "collections": { "niser_documents": { "vectors_count": 42 } }
# }
```

#### Step 2: Test Chatbot API (Backend)
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What has NISER published on agriculture?",
    "history": []
  }'

# Expected response (streaming text events):
# data: {"event":"mode","mode":"niser"}
# data: {"token":"NISER","sources":[...]}
# data: {"token":" has","sources":[...]}
# ...
```

The chatbot answers in tiers, each reported via the `mode` SSE event:
- `niser` — answered from the NISER repository (default)
- `web` — external web search fallback (requires `WEB_SEARCH_API_KEY`, Tavily); never used for NISER-specific questions
- `general` — general-knowledge answer, labelled in the UI (disable with `CHAT_GENERAL_KNOWLEDGE=false`)
- `none` — no reliable answer; the assistant says so and points to Publications/Insights

#### Step 3: Test Chatbot UI (Frontend)
1. Open http://localhost:3000/chatbot
2. Type: "What research has NISER done on poverty reduction?"
3. You should see:
   - ✅ Streaming response appearing word-by-word
   - ✅ Source citations shown below
   - ✅ Chat history maintained
   - ✅ "Clear chat" button works

**Troubleshooting:**
- If chatbot returns "I don't have enough information", Qdrant may not be populated
- Run the embed API call first (see Step 1)
- Check logs: `docker-compose logs qdrant`

---

### Test 2: Semantic Search

#### Step 1: Verify Qdrant Has Data
```bash
curl -X GET http://localhost:6333/collections/niser_documents

# Expected response shows collection with vectors:
# {"result": {"vectors_count": 42, ...}}
```

#### Step 2: Test Semantic Search (API)
```bash
curl "http://localhost:3000/api/search?q=agricultural%20policy&mode=semantic"

# Expected response:
# {
#   "mode": "semantic",
#   "query": "agricultural policy",
#   "results": [
#     {
#       "id": "pub-123",
#       "type": "publication",
#       "title": "Policy Response to Agricultural Productivity",
#       "score": 0.92
#     }
#   ]
# }
```

#### Step 3: Test Keyword Search (API)
```bash
curl "http://localhost:3000/api/search?q=agriculture&mode=keyword"

# Should return exact keyword matches via Elasticsearch
```

#### Step 4: Test Search UI (Frontend)
1. Open http://localhost:3000/search
2. Type "agricultural finance" in search box
3. Toggle between "Keyword only" and "AI-enhanced" modes
4. Verify results update in real-time

**Troubleshooting:**
- If no results, ensure content is indexed: run `/api/embed` first
- Check Elasticsearch status: `curl http://localhost:9200/_cat/indices`

---

### Test 3: Elasticsearch Keyword Search

#### Step 1: Check Elasticsearch Is Ready
```bash
curl http://localhost:9200/_cluster/health

# Expected response:
# {"status":"green","number_of_nodes":1,...}
```

#### Step 2: Index Sample Data
```bash
curl -X POST http://localhost:9200/niser_content/_doc \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Agricultural Policy in Nigeria",
    "content": "This document discusses government policies affecting agriculture",
    "type": "publication",
    "year": 2024
  }'

# Expected response:
# {"_index":"niser_content","_type":"_doc","_id":"...","_version":1,"result":"created"}
```

#### Step 3: Search Elasticsearch
```bash
curl -X GET "http://localhost:9200/niser_content/_search?q=agricultural"

# Expected response with results
```

---

### Test 4: Analytics (Matomo)

#### Step 1: Open Matomo Dashboard
```bash
open http://localhost:8081
```

You'll see the setup wizard:
1. Database setup (already done)
2. Create superuser account
3. Enter NISER website info

#### Step 2: Verify Tracking Is Working
1. Visit http://localhost:3000/chatbot
2. Send a message
3. Go back to Matomo dashboard
4. Check "Real-time" section — should show your page visit

#### Step 3: Configure Goals (for production)
1. Go to **Administration** → **Goals**
2. Create goals:
   - "Newsletter Subscribe" — when `/api/subscribe` is called
   - "Publication Download" — when PDF is downloaded
   - "Event Registration" — when event is registered

---

### Test 5: Policy Monitoring Pipeline

#### Step 1: Run Policy Monitor Script
```bash
npm run policy-monitor

# Expected output:
# [Policy Monitor] Fetching policy sources...
# [Policy Monitor] Processing feeds...
# [Policy Monitor] Generated daily brief
# [Policy Monitor] Sent to: niser-research@niser.gov.ng
```

#### Step 2: Check Generated Brief
```bash
# The brief should be sent via MailerSend to configured email
# Check your email for: "NISER Policy Monitor — [Date]"
```

#### Step 3: Verify Cron Job (for production)
For automatic daily runs:
```bash
# Test with cron (requires InterServer):
# 0 5 * * * cd /home/niser && npm run policy-monitor >> /var/log/policy-monitor.log 2>&1
```

**Troubleshooting:**
- Check script logs: `tail -f /var/log/policy-monitor.log`
- Verify RSS feeds are accessible
- Check MailerSend API key in `.env.local`

---

### Test 6: Email Integration

#### Step 1: Subscribe to Newsletter
1. Go to http://localhost:3000
2. Scroll down to newsletter form
3. Enter test email: `test@example.com`
4. Submit form

#### Step 2: Verify API Call
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response:
# {"success":true,"message":"Subscribed to newsletter"}
```

#### Step 3: Check Brevo/MailerSend
- Log in to Brevo dashboard
- Check **Contacts** → should see `test@example.com`
- Check **Email campaigns** for newsletter emails

**Note:** Without valid API key, subscription will fail silently.

---

### Test 7: Push Notifications (Firebase)

#### Step 1: Verify Firebase Configuration
```bash
node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./sincere-cortex-451921-i2-firebase-adminsdk-fbsvc-cb5ab342ca.json');
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
console.log('Firebase initialized successfully');
"
```

#### Step 2: Send Test Notification
```bash
curl -X POST http://localhost:3000/api/fcm \
  -H "Content-Type: application/json" \
  -d '{
    "token": "test-device-token",
    "title": "Test Notification",
    "body": "This is a test push notification"
  }'
```

#### Step 3: Test on Mobile App
- Install NISER app on Android/iOS
- Grant notification permission
- Wait for test notification

---

### Test 8: Translation Service

#### Step 1: Translate Content (if NLLB running)
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a policy brief on agricultural finance",
    "source_language": "eng_Latn",
    "target_language": "yor_Latn"
  }'

# Expected response:
# {
#   "original": "This is a policy brief on agricultural finance",
#   "translation": "Eyi je iwe alaye nipa owó isin-olu àgricultural",
#   "language": "Yoruba"
# }
```

#### Step 2: Test Translation UI
1. Go to http://localhost:3000/insights/[article-slug]
2. Look for language selector (if implemented)
3. Choose Yoruba/Hausa/Igbo
4. Verify translation loads

**Note:** NLLB service must be running locally or accessible via `NLLB_SERVICE_URL`.

---

### Test 9: Publications & Researchers

#### Test Publications Page
```bash
# Visit the publications page
open http://localhost:3000/publications

# Test filtering:
# - Filter by year
# - Filter by division
# - Search by keyword
# - Sort by relevance/date

# Test publication detail page
# - Verify PDF viewer shows (if PDF available)
# - Test citation export (BibTeX, APA, Chicago)
# - Test DOI linking
```

#### Test Researcher Directory
```bash
# Visit researcher directory
open http://localhost:3000/people

# Test features:
# - Search by name
# - Filter by division
# - View researcher profile
# - Check ORCID profile link
# - Verify publications listed
```

---

### Test 10: Accessibility (WCAG)

#### Run Automated Audit
```bash
# Install axe-core CLI
npm install -g @axelabs/axe-core

# Scan homepage
axe http://localhost:3000

# Expected: 0 critical violations
```

#### Manual Testing

**Keyboard Navigation:**
```bash
# Test all pages with keyboard only:
1. Tab through all interactive elements
2. Verify focus indicator is visible
3. Test form submission with Enter
4. Test modal close with Escape
```

**Screen Reader (VoiceOver on Mac):**
```bash
# Open System Preferences → Accessibility → VoiceOver
# Enable VoiceOver (Cmd + F5)
# Navigate through http://localhost:3000
# Verify:
# - All images have alt text
# - Form labels are associated
# - Headings are in proper order
```

**Color Contrast:**
```bash
# Use Chrome DevTools → Lighthouse
# Run Accessibility audit
# Fix any contrast warnings
```

---

## 🔍 Debugging & Logs

### View Docker Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f elasticsearch
docker-compose logs -f qdrant
docker-compose logs -f matomo

# Follow logs in real-time
docker-compose logs --tail=100 -f
```

### View Next.js Logs
```bash
# Dev server already shows logs in terminal where npm run dev is running
# Check for errors like:
# - Port 3000 already in use
# - Missing environment variables
# - Connection errors to Docker services
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Port 3000 already in use` | `lsof -i :3000` and `kill -9 <PID>` |
| `Cannot connect to Elasticsearch` | Check `docker-compose ps` and `docker-compose logs elasticsearch` |
| `Qdrant collection not found` | Run `/api/embed` to ingest content |
| `Chatbot returns no results` | Verify Qdrant has data and proper embeddings |
| `Email not sending` | Check `BREVO_API_KEY` in `.env.local` |
| `Matomo not tracking` | Verify tracking code on pages and check `MATOMO_URL` |

---

## 📊 Performance Testing

### Measure Page Load Time
```bash
# Using curl with timing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# Using Chrome DevTools:
# 1. Open http://localhost:3000
# 2. Press F12 → Network tab
# 3. Refresh page
# 4. Check Load time and DomContentLoaded
```

### Measure Search Performance
```bash
# Time semantic search
time curl "http://localhost:3000/api/search?q=agriculture&mode=semantic"

# Expected: <500ms for semantic search
# Expected: <100ms for keyword search
```

### Measure Chatbot Response Time
```bash
# Time first token arrival
time curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"What is NISER?","history":[]}'

# Expected: <2s for first token (with local Ollama)
# Expected: <3s for first token (with Claude API)
```

---

## 🧹 Cleanup & Reset

### Stop All Services
```bash
docker-compose down
```

### Remove All Data (Reset)
```bash
docker-compose down -v

# This removes:
# - All containers
# - All volumes (Qdrant data, Elasticsearch indices, Matomo database)
# - Networks
```

### Clear Node Modules & Rebuild
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Reset Environment Variables
```bash
# Restore .env.local to defaults
rm .env.local
cp .env.local.example .env.local  # if exists, or create fresh
```

---

## ✅ Pre-Deployment Checklist

Before deploying to InterServer, verify:

- [ ] All Docker services start without errors
- [ ] Next.js app builds successfully
- [ ] Chatbot can retrieve and cite sources
- [ ] Semantic search returns relevant results
- [ ] Elasticsearch indices created successfully
- [ ] Matomo dashboard accessible and tracking
- [ ] Newsletter subscription form works
- [ ] Push notifications send successfully
- [ ] Policy monitor script runs without errors
- [ ] Translation service produces acceptable output
- [ ] All pages pass WCAG accessibility audit
- [ ] No console errors in browser DevTools
- [ ] All API endpoints respond with correct status codes
- [ ] Nginx reverse proxy correctly routes traffic
- [ ] SSL certificates ready (for HTTPS)

---

## 📞 Getting Help

If you encounter issues:

1. **Check logs first:**
   ```bash
   docker-compose logs -f
   ```

2. **Verify all services are healthy:**
   ```bash
   docker-compose ps
   ```

3. **Test individual components:**
   - Use `curl` to test API endpoints
   - Check network tabs in browser DevTools
   - Review service-specific logs

4. **Review documentation:**
   - `/docs/AI_SETUP.md` — AI feature configuration
   - `NISER_Software_Design_Document_v1.0.md` — Architecture
   - `.env.production.example` — All environment variables

5. **Reset and start fresh:**
   ```bash
   docker-compose down -v
   bash setup-local-dev.sh
   ```

---

**Last updated:** June 29, 2026
# start mock NLLB service
npm run mock-nllb