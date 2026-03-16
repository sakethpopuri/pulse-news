require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const { startCronJob } = require('./cron/scrapeJob');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pulse-news-jade.vercel.app',
      process.env.CLIENT_URL,
    ].filter(Boolean);
    const isVercel = origin.endsWith('.vercel.app');
    if (allowed.includes(origin) || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// ─── Image Proxy ───────────────────────────────────────────────────────────
app.get('/api/proxy/image', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).json({ message: 'No URL provided' });

  try {
    const url = new URL(imageUrl);
    const protocol = url.protocol === 'https:' ? https : http;

    protocol.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': url.origin,
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }, (proxyRes) => {
      const contentType = proxyRes.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      proxyRes.pipe(res);
    }).on('error', () => {
      res.status(500).json({ message: 'Image fetch failed' });
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid URL' });
  }
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', ts: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled error]', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Connect DB then start
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'pulse-news' })
  .then(() => {
    console.log('[MongoDB] Connected');
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
      startCronJob();
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;