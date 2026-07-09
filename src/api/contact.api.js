import { api } from './axios';
import { endpoints } from './endpoints';

export const contactApi = {
  create: (payload) => api.post(endpoints.public.contact, payload).then((r) => r.data),

  list: (params) => api.get(endpoints.admin.contactMessages, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.contactMessageById(id)).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.contactMessageById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.contactMessageById(id)).then((r) => r.data),
};
