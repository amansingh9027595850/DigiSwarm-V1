import { api } from './axios';
import { endpoints } from './endpoints';

export const roleApi = {
  list: () => api.get(endpoints.admin.roles).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.roles, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.roleById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.roleById(id)).then((r) => r.data),
};
