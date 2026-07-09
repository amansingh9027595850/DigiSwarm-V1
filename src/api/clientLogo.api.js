import { api } from './axios';
import { endpoints } from './endpoints';

export const clientLogoApi = {
  listPublic: () => api.get(endpoints.public.clientLogos).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.clientLogos).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.clientLogos, payload).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.clientLogoById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.clientLogoById(id)).then((r) => r.data),
};
