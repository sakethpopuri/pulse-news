// Mock data used when backend is not running (dev mode)
export const MOCK_ARTICLES = [
  { _id: '1', title: 'Global markets surge as inflation cools in major economies worldwide', category: 'business', source: 'Reuters', image: 'https://picsum.photos/seed/biz1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), url: '#', sourceCount: 3 },
  { _id: '2', title: 'Scientists discover new species of deep-sea creature in Pacific Ocean trench', category: 'health', source: 'BBC News', image: 'https://picsum.photos/seed/sci1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), url: '#', sourceCount: 1 },
  { _id: '3', title: 'Champions League: Dramatic last-minute goal sends underdogs through to the final', category: 'sports', source: 'Al Jazeera', image: 'https://picsum.photos/seed/sp1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), url: '#', sourceCount: 5 },
  { _id: '4', title: 'Tech giant unveils next-generation AI chip that outperforms all current models', category: 'technology', source: 'The Hindu', image: 'https://picsum.photos/seed/tech1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), url: '#', sourceCount: 4 },
  { _id: '5', title: 'Tensions rise in Eastern Europe as diplomatic talks break down over border dispute', category: 'geopolitics', source: 'Reuters', image: 'https://picsum.photos/seed/geo1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(), url: '#', sourceCount: 2 },
  { _id: '6', title: 'Box office smash: New franchise reboot breaks opening weekend records globally', category: 'entertainment', source: 'Times of India', image: 'https://picsum.photos/seed/ent1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), url: '#', sourceCount: 6 },
  { _id: '7', title: 'Central bank raises interest rates for the third consecutive quarter amid inflation fears', category: 'business', source: 'BBC News', image: 'https://picsum.photos/seed/biz2/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(), url: '#', sourceCount: 3 },
  { _id: '8', title: 'New study links ultra-processed foods to increased risk of cardiovascular disease', category: 'health', source: 'Reuters', image: 'https://picsum.photos/seed/hea1/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), url: '#', sourceCount: 2 },
  { _id: '9', title: 'Olympic preparations underway as host city unveils athlete village and venues', category: 'sports', source: 'Al Jazeera', image: 'https://picsum.photos/seed/sp2/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(), url: '#', sourceCount: 4 },
  { _id: '10', title: 'Semiconductor shortage eases as new factories come online across Southeast Asia', category: 'technology', source: 'The Hindu', image: 'https://picsum.photos/seed/tech2/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(), url: '#', sourceCount: 1 },
  { _id: '11', title: 'UN Security Council meets for emergency session on humanitarian crisis in conflict zone', category: 'geopolitics', source: 'BBC News', image: 'https://picsum.photos/seed/geo2/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(), url: '#', sourceCount: 5 },
  { _id: '12', title: 'Award season heats up as streaming giants dominate nominations across all categories', category: 'entertainment', source: 'Times of India', image: 'https://picsum.photos/seed/ent2/600/380', publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), url: '#', sourceCount: 2 },
];

export const getMockByCategory = (category) => {
  if (category === 'all') return MOCK_ARTICLES;
  return MOCK_ARTICLES.filter(a => a.category === category);
};
