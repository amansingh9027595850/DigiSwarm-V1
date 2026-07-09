import { api } from './axios';
import { endpoints } from './endpoints';

export const quoteApi = {
  create: (payload) => api.post(endpoints.public.quotes, payload).then((r) => r.data),

  list: (params) => api.get(endpoints.admin.quotes, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.quoteById(id)).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.quoteById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.quoteById(id)).then((r) => r.data),
};
