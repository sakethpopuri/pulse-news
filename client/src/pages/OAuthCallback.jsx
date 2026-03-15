import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../store/authSlice';

// Backend redirects here after OAuth: /oauth/callback?success=true
export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  useEffect(() => {
    const success = params.get('success');
    const redirectTo = sessionStorage.getItem('oauth_redirect') || '/';
    sessionStorage.removeItem('oauth_redirect');

    if (success === 'true') {
      dispatch(checkAuth()).then(() => navigate(redirectTo, { replace: true }));
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-8 h-8 border-2 border-ink-700 border-t-signal rounded-full animate-spin"/>
        <p className="text-ink-400 font-mono text-sm">Completing sign in…</p>
      </div>
    </div>
  );
}
