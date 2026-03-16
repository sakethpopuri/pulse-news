function makeTitleSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 120); // cap length
}

module.exports = { makeTitleSlug };
