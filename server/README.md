# PULSE News — Full Stack News Aggregator

Real-time news aggregated from BBC, Reuters, Times of India, The Hindu and Al Jazeera.
Deduplicated with Fuse.js fuzzy matching. Categorised by keyword tagger.
Auth via JWT cookies + Google / Facebook / Twitter OAuth.

---

## Project Structure

```
pulse-news/
├── news-aggregator-client/   ← React + Vite + Redux + Tailwind
└── news-aggregator-server/   ← Express + MongoDB + Scrapers + Cron
```

---

## 1. Prerequisites

- Node.js >= 18
- npm >= 9
- A MongoDB Atlas free-tier cluster (https://cloud.mongodb.com)
- OAuth app credentials (Google, Facebook, Twitter) — see Section 4

---

## 2. Run Locally (Quick Start)

### Step 1 — Clone and install

```bash
# Clone or unzip the project
cd news-aggregator-client && npm install
cd ../news-aggregator-server && npm install
```

### Step 2 — Frontend env

The file `news-aggregator-client/.env` is already created:
```
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=true       ← set to true to use mock data without backend
```

Set `VITE_USE_MOCK=false` once your backend is running.

### Step 3 — Backend env

Edit `news-aggregator-server/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/pulse-news
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
TWITTER_API_KEY=
TWITTER_API_SECRET=
```

### Step 4 — Start both servers

**Terminal 1 — Backend:**
```bash
cd news-aggregator-server
npm run dev
# Server starts on http://localhost:5000
# Scraper runs immediately on startup, then every 30 min
```

**Terminal 2 — Frontend:**
```bash
cd news-aggregator-client
npm run dev
# App opens on http://localhost:3000
```

### Step 5 — Check it's working

- Visit http://localhost:3000 — you should see the PULSE News UI
- If `VITE_USE_MOCK=true`, mock articles load immediately
- If `VITE_USE_MOCK=false`, backend scrapes on startup (takes ~15s)
- Visit http://localhost:5000/health — should return `{ "status": "ok" }`
- Visit http://localhost:5000/api/news — should return articles JSON

---

## 3. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → Create free M0 cluster
2. Create a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (for Render deployment) or your local IP for dev
4. Click "Connect" → "Connect your application" → copy the connection string
5. Replace `<user>` and `<password>` in `MONGO_URI`

---

## 4. OAuth App Setup

### Google
1. Go to https://console.cloud.google.com
2. Create project → APIs & Services → Credentials → Create OAuth 2.0 Client
3. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Client Secret into `.env`

### Facebook
1. Go to https://developers.facebook.com → Create App → Consumer
2. Add "Facebook Login" product
3. Valid OAuth redirect: `http://localhost:5000/api/auth/facebook/callback`
4. Copy App ID and App Secret into `.env`

### Twitter / X
1. Go to https://developer.twitter.com → Create project and app
2. Enable OAuth 1.0a → Callback URL: `http://localhost:5000/api/auth/twitter/callback`
3. Copy API Key and API Secret into `.env`

> **For production**, replace `localhost:5000` with your Render backend URL in all OAuth redirect URIs.

---

## 5. Deploy to Vercel (Frontend)

```bash
cd news-aggregator-client
npm run build   # creates dist/

# Install Vercel CLI
npm i -g vercel
vercel

# When prompted:
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

**Set environment variable in Vercel dashboard:**
```
VITE_API_URL = https://your-backend.onrender.com/api
VITE_USE_MOCK = false
```

---

## 6. Deploy to Render (Backend)

1. Push `news-aggregator-server/` to a GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Add all env vars from `.env` in the Render dashboard Environment tab
6. Deploy — Render auto-deploys on every push

**Important:** After Render deploy, update your OAuth apps' redirect URIs to:
```
https://your-backend.onrender.com/api/auth/google/callback
https://your-backend.onrender.com/api/auth/facebook/callback
https://your-backend.onrender.com/api/auth/twitter/callback
```

And update `CLIENT_URL` on Render to your Vercel frontend URL.

---

## 7. API Endpoints Reference

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register with email + password |
| POST | /api/auth/login | Login, sets httpOnly JWT cookie |
| POST | /api/auth/logout | Clears JWT cookie |
| GET | /api/auth/me | Get current user (requires cookie) |
| GET | /api/auth/google | Redirect to Google OAuth |
| GET | /api/auth/facebook | Redirect to Facebook OAuth |
| GET | /api/auth/twitter | Redirect to Twitter OAuth |

### News
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/news | Get articles (query: `category`, `page`, `limit`) |
| GET | /api/news/stats | Article counts by category |
| GET | /api/news/:id | Single article by MongoDB ID |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health check |

---

## 8. How the Scraper Works

1. `node-cron` fires `runScrapeJob()` every 30 minutes (and immediately on startup)
2. All 5 scrapers run **in parallel** via `Promise.allSettled` — one failing doesn't block others
3. Raw articles are collected (~150 total across sources)
4. `dedup.js` uses **Fuse.js** fuzzy matching (threshold 0.15) to merge duplicate stories
5. `categorise.js` assigns a category via keyword matching against title + description
6. `Article.findOneAndUpdate` with `upsert:true` saves new articles — duplicate `titleSlug` keys are silently skipped
7. Articles older than 7 days are pruned automatically

---

## 9. Key Design Decisions

| Decision | Reason |
|----------|--------|
| httpOnly cookies for JWT | Immune to XSS — JS cannot read the token |
| `sameSite: none` in production | Required for cross-origin Vercel↔Render cookie flow |
| `VITE_USE_MOCK=true` default | Frontend works without backend for UI development |
| `Promise.allSettled` in cron | One broken scraper never crashes the whole job |
| `findOneAndUpdate` upsert | Idempotent — re-running scrapers never creates duplicates |
| Fuse.js over ML embeddings | Zero infra cost, <5ms per check, good enough for news titles |
| Keyword categoriser | Deterministic, fast, no external API needed |
