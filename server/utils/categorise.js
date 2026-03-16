/**
 * Assigns a category to an article based on keyword matching
 * against title + description.
 * Returns one of: sports | entertainment | business | geopolitics | technology | health | all
 */

const CATEGORY_KEYWORDS = {
  sports: [
    'cricket', 'football', 'soccer', 'tennis', 'basketball', 'nba', 'ipl',
    'fifa', 'olympic', 'athletics', 'rugby', 'golf', 'f1', 'formula one',
    'match', 'tournament', 'league', 'championship', 'world cup', 'player',
    'coach', 'squad', 'wicket', 'innings', 'goal', 'penalty', 'medal',
    'sport', 'athlete', 'stadium', 'transfer fee',
  ],
  entertainment: [
    'movie', 'film', 'cinema', 'box office', 'streaming', 'netflix', 'amazon prime',
    'disney', 'hbo', 'series', 'season', 'episode', 'actor', 'actress', 'director',
    'oscar', 'grammy', 'bafta', 'award', 'celebrity', 'bollywood', 'hollywood',
    'music', 'album', 'concert', 'singer', 'band', 'entertainment', 'tv show',
    'anime', 'trailer', 'premiere', 'sequel',
  ],
  business: [
    'stock', 'market', 'economy', 'gdp', 'inflation', 'interest rate', 'fed',
    'central bank', 'rbi', 'revenue', 'profit', 'loss', 'quarter', 'earnings',
    'startup', 'ipo', 'investment', 'funding', 'acquisition', 'merger',
    'trade', 'export', 'import', 'tariff', 'tax', 'budget', 'fiscal',
    'ceo', 'company', 'corporate', 'bank', 'finance', 'cryptocurrency', 'bitcoin',
  ],
  geopolitics: [
    'war', 'conflict', 'military', 'troops', 'sanction', 'nato', 'un', 'united nations',
    'treaty', 'summit', 'diplomacy', 'diplomat', 'embassy', 'foreign minister',
    'president', 'prime minister', 'election', 'government', 'parliament',
    'nuclear', 'missile', 'border', 'territory', 'refugee', 'ceasefire',
    'geopolitic', 'bilateral', 'alliance', 'coup', 'protest', 'riot',
  ],
  technology: [
    'ai', 'artificial intelligence', 'machine learning', 'chatgpt', 'openai',
    'google', 'apple', 'microsoft', 'meta', 'amazon', 'tech', 'software',
    'hardware', 'chip', 'semiconductor', 'smartphone', 'app', 'cybersecurity',
    'hack', 'data breach', 'cloud', 'startup', 'robot', 'automation',
    'electric vehicle', 'ev', 'space', 'nasa', 'satellite', 'internet',
  ],
  health: [
    'health', 'disease', 'virus', 'vaccine', 'hospital', 'doctor', 'medicine',
    'drug', 'cancer', 'diabetes', 'heart', 'mental health', 'who',
    'pandemic', 'outbreak', 'symptom', 'treatment', 'surgery', 'clinical',
    'nutrition', 'diet', 'exercise', 'obesity', 'mortality', 'life expectancy',
    'pharmaceutical', 'fda', 'cdc', 'study', 'research',
  ],
};

function categoriseArticle(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();

  const scores = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.filter(kw => text.includes(kw)).length;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'all';
}

module.exports = { categoriseArticle };
