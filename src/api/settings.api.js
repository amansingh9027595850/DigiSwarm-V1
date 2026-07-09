import { api } from './axios';
import { endpoints } from './endpoints';

export const settingsApi = {
  getPublic: () => api.get(endpoints.public.settings).then((r) => r.data),
  getAdmin: () => api.get(endpoints.admin.settings).then((r) => r.data),
  update: (payload) => api.patch(endpoints.admin.settings, payload).then((r) => r.data),
};
