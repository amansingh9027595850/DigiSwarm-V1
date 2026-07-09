import { api } from './axios';
import { endpoints } from './endpoints';

export const userApi = {
  list: (params) => api.get(endpoints.admin.users, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.userById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.users, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.userById(id), payload).then((r) => r.data),
  resetPassword: (id, payload) =>
    api.post(endpoints.admin.userResetPassword(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.userById(id)).then((r) => r.data),
};
