const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'Times of India';
const BASE = 'https://timesofindia.indiatimes.com';

async function scrapeTOI() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // TOI article cards
    $('figure figcaption a, .top-story a, .listing-txt a, h2 a, h3 a').each((_, el) => {
      const title = $(el).text().trim() || $(el).attr('title') || '';
      if (!title || title.length < 15) return;
      const href = $(el).attr('href') || '';
      const url = href.startsWith('http') ? href : `${BASE}${href}`;
      if (!url.includes('timesofindia')) return;

      const container = $(el).closest('li, article, div').first();
      const rawImage = container.find('img').first().attr('src')
              || container.find('img').first().attr('data-src') || '';
const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';

      if (!articles.find(a => a.url === url)) {
        articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
      }
    });
  } catch (err) {
    console.error('[TOI scraper error]', err.message);
  }

  console.log(`[TOI] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}

module.exports = { scrapeTOI };
