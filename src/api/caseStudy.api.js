import { api } from './axios';
import { endpoints } from './endpoints';

export const caseStudyApi = {
  listPublic: (params) => api.get(endpoints.public.caseStudies, { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.caseStudyBySlug(slug)).then((r) => r.data),

  listAdmin: (params) => api.get(endpoints.admin.caseStudies, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.caseStudyById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.caseStudies, payload).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.caseStudyById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.caseStudyById(id)).then((r) => r.data),
};
