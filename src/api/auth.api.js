import { api } from './axios';
import { endpoints } from './endpoints';

export const authApi = {
  login: (payload) => api.post(endpoints.auth.login, payload).then((r) => r.data),
  refresh: () => api.post(endpoints.auth.refresh).then((r) => r.data),
  logout: () => api.post(endpoints.auth.logout).then((r) => r.data),
  me: () => api.get(endpoints.auth.me).then((r) => r.data),
  forgotPassword: (payload) => api.post(endpoints.auth.forgotPassword, payload).then((r) => r.data),
  resetPassword: (payload) => api.post(endpoints.auth.resetPassword, payload).then((r) => r.data),
};
