import { api } from './axios';
import { endpoints } from './endpoints';

export const teamApi = {
  listPublic: () => api.get(endpoints.public.team).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.team).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.team, payload).then((r) => r.data),
  update: (id, payload) => api.patch(endpoints.admin.teamById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.teamById(id)).then((r) => r.data),
};
