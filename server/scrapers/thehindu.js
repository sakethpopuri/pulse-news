const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'The Hindu';
const BASE = 'https://www.thehindu.com';

async function scrapeTheHindu() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news/national/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // The Hindu card structure
    $('.story-card, .element, article').each((_, el) => {
      const titleEl = $(el).find('h2 a, h3 a, .title a').first();
      const title = titleEl.text().trim() || titleEl.attr('title') || '';
      if (!title || title.length < 15) return;

      const href = titleEl.attr('href') || '';
      const url = href.startsWith('http') ? href : `${BASE}${href}`;

      const image = $(el).find('img').first().attr('src')
                 || $(el).find('img').first().attr('data-src') || '';
      const desc = $(el).find('p, .intro').first().text().trim();

      if (!articles.find(a => a.url === url)) {
        articles.push({ title, url, image, description: desc, source: SOURCE, publishedAt: new Date() });
      }
    });

    // Fallback
    if (articles.length < 5) {
      $('a[href*="thehindu.com/news"]').each((_, el) => {
        const title = $(el).text().trim();
        if (!title || title.length < 15) return;
        const url = $(el).attr('href');
        const image = '';
        if (!articles.find(a => a.url === url)) {
          articles.push({ title, url, image, description: '', source: SOURCE, publishedAt: new Date() });
        }
      });
    }
  } catch (err) {
    console.error('[The Hindu scraper error]', err.message);
  }

  console.log(`[The Hindu] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}

module.exports = { scrapeTheHindu };
