import { api } from './axios';
import { endpoints } from './endpoints';

export const seoApi = {
  getByPath: (path) =>
    api.get(endpoints.public.seo, { params: { path } }).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.seo).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.seo, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.seoById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.seoById(id)).then((r) => r.data),
};
