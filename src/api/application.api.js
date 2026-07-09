import { api } from './axios';
import { endpoints } from './endpoints';

export const applicationApi = {
  list: (params) => api.get(endpoints.admin.applications, { params }).then((r) => r.data),
  getById: (id) => api.get(endpoints.admin.applicationById(id)).then((r) => r.data),
  update: (id, payload) =>
    api.patch(endpoints.admin.applicationById(id), payload).then((r) => r.data),
  remove: (id) => api.delete(endpoints.admin.applicationById(id)).then((r) => r.data),
  // Fetches the resume bytes through our authenticated proxy and returns
  // the response as a Blob — caller turns that into a blob: URL for inline
  // preview or download. `download=true` adds Content-Disposition: attachment.
  fetchResume: (id, { download = false } = {}) =>
    api
      .get(`${endpoints.admin.applicationById(id)}/resume`, {
        params: download ? { download: 1 } : undefined,
        responseType: 'blob',
      })
      .then((r) => r.data),
};
