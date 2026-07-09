import { api } from './axios';
import { endpoints } from './endpoints';

export const jobApi = {
  listPublic: (params) => api.get(endpoints.public.jobs, { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.jobBySlug(slug)).then((r) => r.data),
  apply: (slug, formData) =>
    api
      .post(endpoints.public.jobApply(slug), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  listAdmin: (params) => api.get(endpoints.admin.jobs, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.jobById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.jobs, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.jobById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.jobById(id)).then((r) => r.data),
};
