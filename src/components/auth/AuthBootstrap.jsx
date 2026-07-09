import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '@/api/auth.api';
import { setAccessToken, setSessionExpiredHandler } from '@/api/axios';
import { setUser, clearAuth, setAuthChecked } from '@/features/auth/authSlice';

// Non-blocking: kicks off /auth/refresh + /auth/me in the background and
// mirrors the result into the Redux store. Public pages render instantly;
// ProtectedRoute waits on `authChecked` before deciding to redirect.
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    setSessionExpiredHandler(() => dispatch(clearAuth()));

    (async () => {
      try {
        const refreshRes = await authApi.refresh();
        const accessToken = refreshRes?.data?.accessToken;
        if (!accessToken) throw new Error('No access token');
        setAccessToken(accessToken);

        const meRes = await authApi.me();
        if (!cancelled) dispatch(setUser(meRes.data.user));
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          dispatch(clearAuth());
        }
      } finally {
        if (!cancelled) dispatch(setAuthChecked(true));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return children;
}
