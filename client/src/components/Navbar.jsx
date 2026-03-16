import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCategory } from '../store/newsSlice';
import { logoutUser } from '../store/authSlice';
import { CATEGORY_CONFIG, CATEGORIES } from '../utils/helpers';

export default function Navbar({ onLoginClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { currentCategory } = useSelector(s => s.news);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCategoryClick = (cat) => {
    dispatch(setCategory(cat));
    navigate(cat === 'all' ? '/' : `/${cat}`);
    setMenuOpen(false);
  };

  const handleLogout = () => dispatch(logoutUser());

  const activeCategory = CATEGORIES.find(c => {
    if (c === 'all') return location.pathname === '/';
    return location.pathname === `/${c}`;
  }) || 'all';

  return (
<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink-950/95 backdrop-blur-md border-b border-ink-800' : 'bg-ink-950'}`}>      {/* Top bar */}
      <div className="border-b border-ink-800 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="section-label">Live updates</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal"></span>
            </span>
            <span className="text-[11px] text-ink-400 font-mono">Scraper active</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-ink-400">
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Logo row */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button onClick={() => handleCategoryClick('all')} className="flex items-baseline gap-3 group">
          <span className="font-display text-2xl font-black text-white tracking-tight leading-none">PULSE</span>
          <span className="text-[10px] font-mono text-signal uppercase tracking-[0.3em]">News</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`nav-link ${activeCategory === cat ? 'active' : ''}`}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-xs text-ink-400 font-mono">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="btn-outline text-xs py-1.5 px-3">Sign out</button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="btn-primary text-xs py-2 px-4">Sign in</button>
          )}
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-ink-200 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-800 bg-ink-950/98 px-6 py-4 flex flex-col gap-3 animate-fade-in">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`text-left nav-link ${activeCategory === cat ? 'active text-white' : ''}`}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
