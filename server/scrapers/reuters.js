const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'Reuters';
const BASE = 'https://www.reuters.com';

async function scrapeReuters() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // Reuters card structure
    $('a[data-testid="Heading"]').each((_, el) => {
      const title = $(el).text().trim();
      if (!title || title.length < 15) return;
      const href = $(el).attr('href') || '';
      const url = href.startsWith('http') ? href : `${BASE}${href}`;
      const container = $(el).closest('li, article, [class*="story"]');
      const image = container.find('img').first().attr('src') || '';
      const desc = container.find('p').first().text().trim();
      if (!articles.find(a => a.url === url)) {
        articles.push({ title, url, image, description: desc, source: SOURCE, publishedAt: new Date() });
      }
    });

    // Fallback: article links
    if (articles.length < 5) {
      $('a[href*="/article/"]').each((_, el) => {
        const title = $(el).find('h3, h2, span').first().text().trim()
                   || $(el).attr('aria-label') || '';
        if (!title || title.length < 15) return;
        const href = $(el).attr('href') || '';
        const url = href.startsWith('http') ? href : `${BASE}${href}`;
        const image = $(el).find('img').attr('src') || '';
        if (!articles.find(a => a.url === url)) {
          articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
        }
      });
    }
  } catch (err) {
    console.error('[Reuters scraper error]', err.message);
  }

  console.log(`[Reuters] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}

module.exports = { scrapeReuters };
