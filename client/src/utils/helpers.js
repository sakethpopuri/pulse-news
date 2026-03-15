export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const CATEGORY_CONFIG = {
  all:           { label: 'Home',          color: 'text-white',      badge: 'bg-ink-700 text-ink-200' },
  sports:        { label: 'Sports',        color: 'text-green-400',  badge: 'bg-green-900/40 text-green-400' },
  entertainment: { label: 'Movies & TV',   color: 'text-purple-400', badge: 'bg-purple-900/40 text-purple-400' },
  business:      { label: 'Business',      color: 'text-gold',       badge: 'bg-yellow-900/40 text-yellow-400' },
  geopolitics:   { label: 'Geopolitics',   color: 'text-red-400',    badge: 'bg-red-900/40 text-red-400' },
  technology:    { label: 'Technology',    color: 'text-blue-400',   badge: 'bg-blue-900/40 text-blue-400' },
  health:        { label: 'Health',        color: 'text-teal-400',   badge: 'bg-teal-900/40 text-teal-400' },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export const SOURCE_COLORS = {
  'BBC News':       'text-[#bb1919]',
  'Reuters':        'text-[#ff8000]',
  'Times of India': 'text-[#d32f2f]',
  'The Hindu':      'text-[#1565c0]',
  'Al Jazeera':     'text-[#e4002b]',
};
