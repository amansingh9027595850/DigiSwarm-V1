import { api } from './axios';
import { endpoints } from './endpoints';

export const faqApi = {
  listPublic: (params) => api.get(endpoints.public.faqs, { params }).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.faqs).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.faqs, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.faqById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.faqById(id)).then((r) => r.data),
};
