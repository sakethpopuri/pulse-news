import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchNews, fetchMoreNews, setCategory } from '../store/newsSlice';
import { getMockByCategory } from '../utils/mockData';
import NewsCard, { NewsCardSkeleton } from '../components/NewsCard';
import { CATEGORY_CONFIG } from '../utils/helpers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export default function NewsPage() {
  const dispatch = useDispatch();
  const { category = 'all' } = useParams();
  const { articles, loading, loadingMore, hasMore, page, error, currentCategory } = useSelector(s => s.news);

  // sync URL param → redux
  useEffect(() => {
    if (currentCategory !== category) dispatch(setCategory(category));
  }, [category]);

  // fetch on category change
  useEffect(() => {
    if (USE_MOCK) return;
    dispatch(fetchNews({ category }));
  }, [category]);

  const displayArticles = USE_MOCK ? getMockByCategory(category) : articles;
  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.all;

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !USE_MOCK) {
      dispatch(fetchMoreNews({ category, page: page + 1 }));
    }
  }, [loadingMore, hasMore, category, page]);

  const [featured, ...rest] = displayArticles;

  return (
<div className="pt-48 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
          {/* Page header */}
      <div className="mb-8 flex items-end justify-between border-b border-ink-800 pb-4">
        <div>
          <p className="section-label mb-1">{category === 'all' ? 'All stories' : 'Category'}</p>
          <h1 className={`font-display text-3xl md:text-4xl font-black tracking-tight ${catConfig.color}`}>
            {catConfig.label}
          </h1>
        </div>
        <span className="text-xs font-mono text-ink-500">
          {displayArticles.length} articles
        </span>
      </div>

      {error && (
        <div className="text-center py-12 text-red-400 font-mono text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <NewsCardSkeleton key={i}/>)}
        </div>
      ) : (
        <>
          {/* Featured hero + grid */}
          {displayArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
              {featured && (
                <NewsCard article={featured} index={0} featured={true}/>
              )}
              {rest.map((article, i) => (
                <NewsCard key={article._id || i} article={article} index={i + 1}/>
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !USE_MOCK && (
            <div className="flex justify-center mt-10">
              <button onClick={loadMore} disabled={loadingMore} className="btn-outline flex items-center gap-2">
                {loadingMore
                  ? <><span className="w-3.5 h-3.5 border-2 border-ink-600 border-t-ink-200 rounded-full animate-spin"/><span>Loading…</span></>
                  : 'Load more stories'}
              </button>
            </div>
          )}

          {displayArticles.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-ink-600 font-mono text-sm">No articles found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
