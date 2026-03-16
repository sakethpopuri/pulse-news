const cron = require('node-cron');
const Article = require('../models/Article');
const { scrapeBBC } = require('../scrapers/bbc');
const { scrapeReuters } = require('../scrapers/reuters');
const { scrapeTOI } = require('../scrapers/toi');
const { scrapeTheHindu } = require('../scrapers/thehindu');
const { scrapeAlJazeera } = require('../scrapers/aljazeera');
const { deduplicateArticles } = require('../utils/dedup');
const { categoriseArticle } = require('../utils/categorise');
const { makeTitleSlug } = require('../utils/titleSlug');

async function runScrapeJob() {
  console.log(`\n[Scrape Job] Starting at ${new Date().toISOString()}`);
  try {
    // 1. Run all scrapers in parallel
    const results = await Promise.allSettled([
      scrapeBBC(),
      scrapeReuters(),
      scrapeTOI(),
      scrapeTheHindu(),
      scrapeAlJazeera(),
    ]);

    const allArticles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    console.log(`[Scrape Job] Total raw articles: ${allArticles.length}`);

    // 2. Deduplicate
    const deduped = deduplicateArticles(allArticles);
    console.log(`[Scrape Job] After dedup: ${deduped.length}`);

    // 3. Categorise + build DB documents
    let saved = 0;
    let skipped = 0;

    for (const article of deduped) {
      const category = categoriseArticle(article.title, article.description);
      const titleSlug = makeTitleSlug(article.title);

      try {
        await Article.findOneAndUpdate(
          { titleSlug },
          {
            $setOnInsert: {
              title: article.title,
              url: article.url,
              image: article.image || '',
              description: article.description || '',
              source: article.source,
              category,
              titleSlug,
              publishedAt: article.publishedAt || new Date(),
              scrapedAt: new Date(),
            },
            $set: {
              allSources: article.allSources || [article.source],
              sourceCount: article.sourceCount || 1,
            },
          },
          { upsert: true, new: true }
        );
        saved++;
      } catch (err) {
        if (err.code === 11000) skipped++; // duplicate key — already in DB
        else console.error('[Scrape Job] DB error:', err.message);
      }
    }

    console.log(`[Scrape Job] Done — saved: ${saved}, skipped (dup): ${skipped}`);

    // 4. Clean up articles older than 7 days
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { deletedCount } = await Article.deleteMany({ scrapedAt: { $lt: cutoff } });
    if (deletedCount > 0) console.log(`[Scrape Job] Pruned ${deletedCount} old articles`);

  } catch (err) {
    console.error('[Scrape Job] Fatal error:', err.message);
  }
}

function startCronJob() {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', runScrapeJob);
  console.log('[Cron] Scraper scheduled every 30 minutes');

  // Run immediately on startup
  runScrapeJob();
}

module.exports = { startCronJob, runScrapeJob };
