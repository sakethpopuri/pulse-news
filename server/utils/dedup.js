const Fuse = require('fuse.js');

/**
 * Given a flat array of raw articles (from all scrapers),
 * returns a deduplicated array keeping one representative per story.
 *
 * Strategy:
 *  - Normalise each title (lowercase, strip punctuation)
 *  - Build a Fuse index over already-accepted titles
 *  - For each new article, search for similarity score >= THRESHOLD
 *  - If match found → merge source into existing entry
 *  - If no match → accept as new entry
 */

const THRESHOLD = 0.15; // Fuse score: 0 = perfect, 1 = no match — accept below 0.15

function normaliseTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deduplicateArticles(articles) {
  const accepted = [];
  const fuseOptions = {
    keys: ['normTitle'],
    threshold: THRESHOLD,
    includeScore: true,
    minMatchCharLength: 10,
  };

  for (const article of articles) {
    const normTitle = normaliseTitle(article.title);
    article.normTitle = normTitle;

    if (accepted.length === 0) {
      accepted.push({ ...article, allSources: [article.source], sourceCount: 1 });
      continue;
    }

    const fuse = new Fuse(accepted, fuseOptions);
    const results = fuse.search(normTitle);

    if (results.length > 0 && results[0].score <= THRESHOLD) {
      // Duplicate found — merge source info, keep the article with better image/description
      const existing = results[0].item;
      if (!existing.allSources.includes(article.source)) {
        existing.allSources.push(article.source);
        existing.sourceCount = existing.allSources.length;
      }
      // Prefer article with image if existing lacks one
      if (!existing.image && article.image) {
        existing.image = article.image;
        existing.url = article.url;
        existing.source = article.source;
      }
      // Keep the most recent publishedAt
      if (new Date(article.publishedAt) > new Date(existing.publishedAt)) {
        existing.publishedAt = article.publishedAt;
      }
    } else {
      accepted.push({ ...article, allSources: [article.source], sourceCount: 1 });
    }
  }

  // Remove internal normalisation field
  return accepted.map(({ normTitle, ...rest }) => rest);
}

module.exports = { deduplicateArticles, normaliseTitle };
