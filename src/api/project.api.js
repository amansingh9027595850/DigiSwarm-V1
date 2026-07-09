import { api } from './axios';
import { endpoints } from './endpoints';

export const projectApi = {
  listPublic: (params) => api.get(endpoints.public.projects, { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.projectBySlug(slug)).then((r) => r.data),

  listAdmin: (params) => api.get(endpoints.admin.projects, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.projectById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.projects, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.projectById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.projectById(id)).then((r) => r.data),
};
