import { api } from './axios';
import { endpoints } from './endpoints';

export const mediaApi = {
  list: (params) => api.get(endpoints.admin.media, { params }).then((r) => r.data),
  uploadSingle: (file, folder = 'misc') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    return api
      .post(endpoints.admin.mediaUpload, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  uploadMultiple: (files, folder = 'gallery') => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    fd.append('folder', folder);
    return api
      .post(endpoints.admin.mediaUploadMultiple, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  remove: (id) => api.delete(endpoints.admin.mediaById(id)).then((r) => r.data),
};
