import { api } from './axios';
import { endpoints } from './endpoints';

export const pricingApi = {
  listPublic: () => api.get(endpoints.public.pricing).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.pricing).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.pricing, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.pricingById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.pricingById(id)).then((r) => r.data),
};
