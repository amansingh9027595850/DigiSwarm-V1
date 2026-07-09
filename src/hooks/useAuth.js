import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { setAccessToken } from '@/api/axios';
import {
  setUser,
  clearAuth,
  setStatus,
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
} from '@/features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const login = async (credentials) => {
    dispatch(setStatus('loading'));
    try {
      const res = await authApi.login(credentials);
      const { accessToken, user: authUser } = res.data;
      setAccessToken(accessToken);
      dispatch(setUser(authUser));
      dispatch(setStatus('authenticated'));
      return authUser;
    } catch (err) {
      dispatch(setStatus('error'));
      throw err;
    }
  };

  const logout = async ({ silent = false, redirect = '/admin/login' } = {}) => {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear client state regardless
    }
    setAccessToken(null);
    dispatch(clearAuth());
    if (!silent) toast.success('Signed out');
    if (redirect) navigate(redirect, { replace: true });
  };

  return { user, isAuthenticated, role, login, logout };
};
