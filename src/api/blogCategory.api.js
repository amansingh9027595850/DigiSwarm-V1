import { api } from './axios';
import { endpoints } from './endpoints';

export const blogCategoryApi = {
  listPublic: () => api.get(endpoints.public.blogCategories).then((r) => r.data),
  listAdmin: () => api.get(endpoints.admin.blogCategories).then((r) => r.data),
  create: (payload) => api.post(endpoints.admin.blogCategories, payload).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.blogCategoryById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.blogCategoryById(id)).then((r) => r.data),
};
