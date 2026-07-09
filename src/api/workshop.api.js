import { api } from './axios';
import { endpoints } from './endpoints';

const stripUndef = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));

export const workshopApi = {
  // Public
  getCurrent: () => api.get(endpoints.public.workshopCurrent).then((r) => r.data),
  listPublic: () => api.get(endpoints.public.workshops).then((r) => r.data),
  getBySlug: (slug) => api.get(endpoints.public.workshopBySlug(slug)).then((r) => r.data),
  register: (slug, payload) =>
    api.post(endpoints.public.workshopRegister(slug), payload).then((r) => r.data),

  // Admin: workshops
  listAdmin: (params) =>
    api.get(endpoints.admin.workshops, { params: stripUndef(params) }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.workshopById(id)).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.workshops, payload).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.workshopById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.workshopById(id)).then((r) => r.data),

  // Admin: registrations
  listRegistrations: (params) =>
    api
      .get(endpoints.admin.workshopRegistrations, { params: stripUndef(params) })
      .then((r) => r.data),
  updateRegistration: (id, payload) =>
    api.patch(endpoints.admin.workshopRegistrationById(id), payload).then((r) => r.data),
  removeRegistration: (id) =>
    api.delete(endpoints.admin.workshopRegistrationById(id)).then((r) => r.data),
};
