import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/authSlice';
import Navbar from './components/Navbar';
import NewsTicker from './components/NewsTicker';
import LoginModal from './components/LoginModal';
import LoginPromptBanner from './components/LoginPromptBanner';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import OAuthCallback from './pages/OAuthCallback';
function CopyrightToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const firstHide = setTimeout(() => setVisible(false), 15000);

    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 3 * 60 * 1000);

    return () => {
      clearTimeout(firstHide);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 bg-ink-800 border border-amber-500/40 rounded-sm shadow-2xl px-5 py-3 max-w-md">
        <span className="text-amber-400 text-lg flex-shrink-0">⚠</span>
        <p className="text-sm font-body text-ink-200">
          Sorry, images are not loading due to copyright restrictions from news sources.
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-ink-500 hover:text-white transition-colors flex-shrink-0 ml-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, checked } = useSelector(s => s.auth);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(null);

  // Check existing session on first load
  useEffect(() => { dispatch(checkAuth()); }, []);

  const openLogin = (redirectPath) => {
    setLoginRedirect(redirectPath || location.pathname);
    setLoginModalOpen(true);
  };

  const isLoginPage = location.pathname === '/login';

  // Don't render until auth check is done (avoids flash)
  if (!checked && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-ink-800 border-t-signal rounded-full animate-spin"/>
      </div>
    );
  }

  return (
    <>
     <CopyrightToast />
      {!isLoginPage && (
  <>
    <Navbar onLoginClick={() => openLogin()}/>
    
      <NewsTicker/>
  </>
)}

      <Routes>
        <Route path="/"              element={<NewsPage/>}/>
        <Route path="/:category"     element={<NewsPage/>}/>
        <Route path="/login"         element={<LoginPage/>}/>
        <Route path="/oauth/callback" element={<OAuthCallback/>}/>
      </Routes>

      {!isLoginPage && (
        <>
          <LoginModal
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            redirectAfter={loginRedirect}
          />
          <LoginPromptBanner onLoginClick={() => openLogin()}/>
        </>
      )}
    </>
  );
}
