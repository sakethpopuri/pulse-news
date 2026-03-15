# PULSE News

```
pulse-news-final/
├── client/   ← React + Vite + Redux + Tailwind (port 3000)
├── server/   ← Express + MongoDB + Scrapers + Cron (port 5000)
└── setup.sh  ← installs everything
```

```bash
./setup.sh

# Terminal A
cd server && npm run dev

# Terminal B
cd client && npm run dev
```

Full docs: server/README.md
