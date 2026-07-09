import { api } from './axios';
import { endpoints } from './endpoints';

export const blogApi = {
  listPublic: (params) => api.get(endpoints.public.blogs, { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.blogBySlug(slug)).then((r) => r.data),

  listAdmin: (params) => api.get(endpoints.admin.blogs, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.blogById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.blogs, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.blogById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.blogById(id)).then((r) => r.data),
};
