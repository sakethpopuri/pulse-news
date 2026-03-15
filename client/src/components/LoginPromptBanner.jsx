import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// Shows a dismissible banner every 25 seconds for unauthenticated users
export default function LoginPromptBanner({ onLoginClick }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const schedule = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isAuthenticated) setVisible(true);
    }, 25000);
  };

  useEffect(() => {
    if (!isAuthenticated) schedule();
    return () => clearTimeout(timerRef.current);
  }, [isAuthenticated]);

  const handleDismiss = () => {
    setVisible(false);
    schedule(); // reschedule after dismiss
  };

  const handleLogin = () => {
    setVisible(false);
    onLoginClick();
  };

  if (isAuthenticated || !visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-md animate-slide-up">
      <div className="bg-ink-800 border border-signal/40 rounded-sm shadow-2xl px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-signal/20 border border-signal/30 flex items-center justify-center">
          <span className="text-signal text-base">✦</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body text-white font-medium">Get personalised news</p>
          <p className="text-xs text-ink-400 font-mono truncate">Sign in to save preferences and bookmarks</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleLogin} className="btn-primary py-1.5 px-3 text-xs">Sign in</button>
          <button onClick={handleDismiss} className="text-ink-500 hover:text-white transition-colors p-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
