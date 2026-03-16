const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE = 'Al Jazeera';
const BASE = 'https://www.aljazeera.com';

async function scrapeAlJazeera() {
  const articles = [];
  try {
    const { data } = await axios.get(`${BASE}/news/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // AJ article cards
    $('article, .article-card, .card').each((_, el) => {
      const titleEl = $(el).find('h2 a, h3 a, .article-card__title a').first();
      const title = titleEl.text().trim();
      if (!title || title.length < 15) return;

      const href = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      const url = href.startsWith('http') ? href : `${BASE}${href}`;

      const rawImage = $(el).find('img').first().attr('src')
              || $(el).find('img').first().attr('data-src') || '';
const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${BASE}${rawImage}` : '';
      const desc = $(el).find('p, .article-card__summary').first().text().trim();

      if (!articles.find(a => a.url === url)) {
        articles.push({ title, url, image, description: desc, source: SOURCE, publishedAt: new Date() });
      }
    });

    // Fallback: links with /news/ path
    if (articles.length < 5) {
      $('a[href^="/news/"]').each((_, el) => {
        const title = $(el).find('h2, h3, span').first().text().trim()
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
    console.error('[Al Jazeera scraper error]', err.message);
  }

  console.log(`[Al Jazeera] scraped ${articles.length} articles`);
  return articles.slice(0, 30);
}

module.exports = { scrapeAlJazeera };
