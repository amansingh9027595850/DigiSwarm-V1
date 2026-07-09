import axios from 'axios';

// In dev, default to "/api/v1" so requests go through the Vite proxy
// (vite.config.js forwards /api → http://localhost:5000). This avoids CORS
// and survives whatever port Vite picks. In prod, set VITE_API_BASE_URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

let accessToken = null;
let onSessionExpired = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

const SKIP_REFRESH_PATHS = ['/auth/login', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'];

const shouldSkipRefresh = (url = '') => SKIP_REFRESH_PATHS.some((p) => url.includes(p));

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !shouldSkipRefresh(original.url)) {
      original._retry = true;
      try {
        refreshing =
          refreshing ||
          api.post('/auth/refresh').finally(() => {
            refreshing = null;
          });
        const { data } = await refreshing;
        const newToken = data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        setAccessToken(null);
        if (typeof onSessionExpired === 'function') onSessionExpired();
      }
    }

    return Promise.reject(error);
  },
);
