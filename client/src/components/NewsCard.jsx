import { CATEGORY_CONFIG, SOURCE_COLORS, timeAgo } from '../utils/helpers';

const proxyImage = (url) => {
  if (!url) return '';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl.replace('/api', '')}/api/proxy/image?url=${encodeURIComponent(url)}`;
};

export default function NewsCard({ article, index = 0, featured = false }) {
  const { title, image, category, source, publishedAt, url, sourceCount } = article;
  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.all;
  const srcColor = SOURCE_COLORS[source] || 'text-ink-400';

  if (featured) {
    return (
      
        <a href={url || '#'}
        target={url !== '#' ? '_blank' : undefined}
        rel="noreferrer"
        className="news-card block col-span-2 row-span-2 group animate-slide-up"
        style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
      >
        <div className="relative h-80 overflow-hidden bg-ink-900">
          {image
            ? <img src={proxyImage(image)} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
            : <div className="w-full h-full bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center"><span className="text-ink-600 text-4xl">✦</span></div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`category-badge ${catConfig.badge}`}>{catConfig.label}</span>
              {sourceCount > 1 && (
                <span className="text-[10px] font-mono text-ink-400 bg-ink-800/80 px-2 py-0.5 rounded-sm">{sourceCount} sources</span>
              )}
            </div>
            <h2 className="font-display text-xl font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-ink-100 transition-colors">{title}</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-mono font-medium ${srcColor}`}>{source}</span>
              <span className="text-ink-600">·</span>
              <span className="text-ink-400 font-mono">{timeAgo(publishedAt)}</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    
      <a href={url || '#'}
      target={url !== '#' ? '_blank' : undefined}
      rel="noreferrer"
      className="news-card flex flex-col group animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="relative h-44 overflow-hidden bg-ink-900 flex-shrink-0">
        {image
          ? <img src={proxyImage(image)} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
          : <div className="w-full h-full bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center"><span className="text-ink-700 text-3xl">✦</span></div>
        }
        <div className="absolute top-3 left-3">
          <span className={`category-badge ${catConfig.badge}`}>{catConfig.label}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-display text-base font-bold text-ink-100 leading-snug line-clamp-3 group-hover:text-white transition-colors">{title}</h3>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-mono font-medium ${srcColor}`}>{source}</span>
            {sourceCount > 1 && (
              <span className="text-ink-600 font-mono text-[10px]">+{sourceCount - 1}</span>
            )}
          </div>
          <span className="text-ink-500 font-mono text-[11px]">{timeAgo(publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="news-card flex flex-col overflow-hidden">
      <div className="skeleton h-44 w-full"></div>
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-5/6 rounded"></div>
        <div className="flex justify-between mt-2">
          <div className="skeleton h-3 w-20 rounded"></div>
          <div className="skeleton h-3 w-12 rounded"></div>
        </div>
      </div>
    </div>
  );
}