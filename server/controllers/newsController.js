const Article = require('../models/Article');

// GET /api/news?category=all&page=1&limit=20
async function getNews(req, res) {
  try {
    const { category = 'all', page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = category === 'all' ? {} : { category };

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(filter),
    ]);

    return res.status(200).json({
      articles,
      total,
      page: pageNum,
      hasMore: skip + articles.length < total,
    });
  } catch (err) {
    console.error('[getNews]', err);
    return res.status(500).json({ message: 'Failed to fetch news' });
  }
}

// GET /api/news/:id
async function getArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) return res.status(404).json({ message: 'Article not found' });
    return res.status(200).json({ article });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/news/stats — dashboard info
async function getStats(req, res) {
  try {
    const [total, byCategory, lastScraped] = await Promise.all([
      Article.countDocuments(),
      Article.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Article.findOne().sort({ scrapedAt: -1 }).select('scrapedAt').lean(),
    ]);
    return res.status(200).json({ total, byCategory, lastScraped: lastScraped?.scrapedAt });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getNews, getArticle, getStats };
