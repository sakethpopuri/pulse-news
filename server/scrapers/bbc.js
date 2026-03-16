const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'BBC News';
const BASE = 'https://www.bbc.com';

async function scrapeBBC() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // BBC uses data-testid attributes on cards
    $('[data-testid="card-text-wrapper"]').each((_, el) => {
      const titleEl = $(el).find('h2, h3').first();
      const title = titleEl.text().trim();
      if (!title || title.length < 15) return;

      const linkEl = $(el).closest('a[href]');
      const href = linkEl.attr('href') || '';
      const url = href.startsWith('http') ? href : `${BASE}${href}`;

      const imgEl = $(el).closest('[data-testid]').find('img').first();
      const rawImage = imgEl.attr('src') || imgEl.attr('data-src') || '';
      const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';

      const desc = $(el).find('p').first().text().trim();

      if (title && url && url !== BASE) {
        articles.push({ title, url, image, description: desc, source: SOURCE, publishedAt: new Date() });
      }
    });

    // Fallback: grab promo links
    if (articles.length < 5) {
      $('a[href^="/news/"]').each((_, el) => {
        const title = $(el).find('h3, h2, [class*="title"]').first().text().trim()
                   || $(el).attr('aria-label') || '';
        if (!title || title.length < 15) return;
        const url = `${BASE}${$(el).attr('href')}`;
        const image = $(el).find('img').attr('src') || '';
        if (!articles.find(a => a.url === url)) {
          articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
        }
      });
    }
  } catch (err) {
    console.error('[BBC scraper error]', err.message);
  }

  console.log(`[BBC] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}

module.exports = { scrapeBBC };
