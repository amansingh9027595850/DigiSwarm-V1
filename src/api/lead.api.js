import { api } from './axios';
import { endpoints } from './endpoints';

export const leadApi = {
  create: (payload) => api.post(endpoints.public.leads, payload).then((r) => r.data),

  list: (params) => api.get(endpoints.admin.leads, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.leadById(id)).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.leadById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.leadById(id)).then((r) => r.data),
};
