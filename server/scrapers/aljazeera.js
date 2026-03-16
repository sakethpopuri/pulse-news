const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'Al Jazeera';
const BASE = 'https://www.aljazeera.com';

async function scrapeAlJazeera() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    $('article, .article-card, [class*="article"]').each((_, el) => {
      const titleEl = $(el).find('h2, h3, h4, [class*="title"], [class*="headline"]').first();
      const title = titleEl.text().trim();
      if (!title || title.length < 20) return;

      const linkEl = $(el).find('a[href]').first();
      const href = linkEl.attr('href') || $(el).closest('a').attr('href') || '';
      if (!href) return;
      const url = href.startsWith('http') ? href : `${BASE}${href}`;

      const img = $(el).find('img').first();
      const rawImage = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';
      const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';

      if (!articles.find(a => a.url === url)) {
        articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
      }
    });

    // Fallback
    if (articles.length < 5) {
      $('a[href*="/news/"]').each((_, el) => {
        const title = $(el).text().trim();
        if (!title || title.length < 20) return;
        const href = $(el).attr('href') || '';
        const url = href.startsWith('http') ? href : `${BASE}${href}`;
        const img = $(el).find('img').first();
        const rawImage = img.attr('src') || img.attr('data-src') || '';
        const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';
        if (!articles.find(a => a.url === url)) {
          articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
        }
      });
    }

  } catch (err) {
    console.error('[Al Jazeera scraper error]', err.message);
  }

  console.log(`[Al Jazeera] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}
module.exports = { scrapeAlJazeera };
