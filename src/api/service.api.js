import { api } from './axios';
import { endpoints } from './endpoints';

export const serviceApi = {
  listPublic: (params) =>
    api.get(endpoints.public.services, { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.serviceBySlug(slug)).then((r) => r.data),

  listAdmin: (params) => api.get(endpoints.admin.services, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.serviceById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.services, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.serviceById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.serviceById(id)).then((r) => r.data),
};
