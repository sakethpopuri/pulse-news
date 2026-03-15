import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginModal({ isOpen, onClose, redirectAfter }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // Close on successful auth
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      navigate(redirectAfter || location.pathname, { replace: true });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearError());
      setForm({ name: '', email: '', password: '' });
    }
  }, [isOpen]);

  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') dispatch(loginUser({ email: form.email, password: form.password }));
    else dispatch(registerUser(form));
  };

  const handleOAuth = (provider) => {
    // Save current path so backend can redirect back after OAuth
    sessionStorage.setItem('oauth_redirect', redirectAfter || location.pathname);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose}/>

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-ink-900 border border-ink-700 rounded-sm shadow-2xl animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-800">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-ink-400 mt-0.5 font-mono">
              {mode === 'login' ? 'Sign in to your account' : 'Join PULSE News today'}
            </p>
          </div>
          <button onClick={onClose} className="text-ink-500 hover:text-white transition-colors p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* OAuth buttons */}
          <div className="flex flex-col gap-2">
            {[
              { provider: 'google',   label: 'Continue with Google',   icon: '𝐆' },
              { provider: 'facebook', label: 'Continue with Facebook',  icon: 'f' },
              { provider: 'twitter',  label: 'Continue with Twitter/X', icon: '𝕏' },
            ].map(({ provider, label, icon }) => (
              <button
                key={provider}
                onClick={() => handleOAuth(provider)}
                className="w-full flex items-center gap-3 px-4 py-2.5 border border-ink-700 hover:border-ink-500 hover:bg-ink-800 rounded-sm transition-all text-sm font-body text-ink-200 hover:text-white"
              >
                <span className="w-5 text-center font-bold text-base">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-ink-800"/>
            <span className="text-[11px] text-ink-500 font-mono">or with email</span>
            <div className="flex-1 h-px bg-ink-800"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Full name"
                className="input-field"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              className="input-field"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
            />

            {error && (
              <p className="text-xs text-red-400 font-mono bg-red-900/20 border border-red-900/40 px-3 py-2 rounded-sm">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/><span>Please wait…</span></>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-ink-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); dispatch(clearError()); }} className="text-signal hover:text-signal-hover underline font-medium transition-colors">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
