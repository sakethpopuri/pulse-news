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
      {!isLoginPage && (
        <>
          <Navbar onLoginClick={() => openLogin()}/>
          <div className="pt-[88px]">
            <NewsTicker/>
          </div>
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
