const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  url:         { type: String, required: true },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  source:      { type: String, required: true },    // e.g. "BBC News"
  sourceUrl:   { type: String, default: '' },
  allSources:  { type: [String], default: [] },     // all sources that had this story
  sourceCount: { type: Number, default: 1 },

  // Category assigned by keyword tagger
  category: {
    type: String,
    enum: ['all', 'sports', 'entertainment', 'business', 'geopolitics', 'technology', 'health'],
    default: 'all',
    index: true,
  },

  publishedAt:  { type: Date, default: Date.now, index: true },
  scrapedAt:    { type: Date, default: Date.now },

  // Dedup fingerprint: normalised title slug
  titleSlug:    { type: String, required: true, unique: true },
}, { timestamps: true });

// Compound index for paginated category queries
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
