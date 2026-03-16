const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'BBC News';
const BASE = 'https://www.bbc.com';

async function scrapeBBC() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('/news/') && !href.includes('/sport/')) return;
      
      const title = $(el).find('h2, h3, [class*="headline"], [class*="title"]').first().text().trim()
                 || $(el).attr('aria-label') || '';
      if (!title || title.length < 20) return;

      const url = href.startsWith('http') ? href : `${BASE}${href}`;
      if (articles.find(a => a.url === url)) return;

      const img = $(el).find('img').first();
      const rawImage = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';
      const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';

      if (title && url) {
        articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
      }
    });

  } catch (err) {
    console.error('[BBC scraper error]', err.message);
  }

  console.log(`[BBC] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}
module.exports = { scrapeBBC };
