import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // Where to redirect after login
  const from = location.state?.from || sessionStorage.getItem('login_redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem('login_redirect');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated]);

  useEffect(() => () => { dispatch(clearError()); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') dispatch(loginUser({ email: form.email, password: form.password }));
    else dispatch(registerUser(form));
  };

  const handleOAuth = (provider) => {
    sessionStorage.setItem('oauth_redirect', from);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-ink-900 border-r border-ink-800 p-12">
        <div>
          <span className="font-display text-2xl font-black text-white">PULSE</span>
          <span className="text-[10px] font-mono text-signal ml-3 uppercase tracking-[0.3em]">News</span>
        </div>
        <div>
          <blockquote className="font-display text-3xl font-bold text-white leading-snug mb-6">
            "The world, <em>as it happens</em>."
          </blockquote>
          <p className="text-ink-400 font-body text-sm leading-relaxed max-w-xs">
            Aggregated from BBC News, Reuters, Times of India, The Hindu and Al Jazeera — deduplicated, categorised, and delivered in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
          </span>
          <span className="text-xs font-mono text-ink-400">Live scraper active</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-display text-2xl font-black text-white">PULSE</span>
            <span className="text-[10px] font-mono text-signal ml-3 uppercase tracking-[0.3em]">News</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-1">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-ink-400 font-mono mb-6">
            {mode === 'login' ? 'Access your personalised feed' : 'Start reading in seconds'}
          </p>

          {/* OAuth */}
          <div className="flex flex-col gap-2 mb-5">
            {[
              { provider: 'google',   label: 'Continue with Google',   icon: '𝐆' },
              { provider: 'facebook', label: 'Continue with Facebook',  icon: 'f' },
              { provider: 'twitter',  label: 'Continue with Twitter/X', icon: '𝕏' },
            ].map(({ provider, label, icon }) => (
              <button
                key={provider}
                onClick={() => handleOAuth(provider)}
                className="w-full flex items-center gap-3 px-4 py-3 border border-ink-700 hover:border-ink-500 hover:bg-ink-800 rounded-sm transition-all text-sm font-body text-ink-200 hover:text-white"
              >
                <span className="w-5 text-center font-bold text-base">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ink-800"/>
            <span className="text-[11px] text-ink-500 font-mono">or with email</span>
            <div className="flex-1 h-px bg-ink-800"/>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <input type="text" placeholder="Full name" className="input-field"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required/>
            )}
            <input type="email" placeholder="Email address" className="input-field"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required/>
            <input type="password" placeholder="Password" className="input-field"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6}/>

            {error && (
              <p className="text-xs text-red-400 font-mono bg-red-900/20 border border-red-900/40 px-3 py-2 rounded-sm">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/><span>Please wait…</span></>
                : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-5">
            {mode === 'login' ? "No account? " : 'Have an account? '}
            <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); dispatch(clearError()); }}
              className="text-signal hover:text-signal-hover underline font-medium transition-colors">
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 font-mono mt-6 transition-colors mx-auto">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to news
          </button>
        </div>
      </div>
    </div>
  );
}
