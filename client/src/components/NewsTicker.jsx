import { useSelector } from 'react-redux';

export default function NewsTicker() {
  const { articles } = useSelector(s => s.news);
  const headlines = articles.slice(0, 8).map(a => a.title);
  if (headlines.length === 0) return null;

  const text = headlines.join('  ·  ');
  return (
    <div className="bg-signal text-white overflow-hidden py-2 border-b border-signal/50">
      <div className="flex gap-8 whitespace-nowrap animate-ticker">
        {[text, text].map((t, i) => (
          <span key={i} className="text-[11px] font-mono tracking-wide flex-shrink-0">{t}</span>
        ))}
      </div>
    </div>
  );
}
