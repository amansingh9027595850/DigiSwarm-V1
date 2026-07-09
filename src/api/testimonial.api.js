import { api } from './axios';
import { endpoints } from './endpoints';

export const testimonialApi = {
  listPublic: (params) => api.get(endpoints.public.testimonials, { params }).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.testimonials).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.testimonials, payload).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.testimonialById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.testimonialById(id)).then((r) => r.data),
};
