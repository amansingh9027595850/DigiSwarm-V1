import { api } from './axios';
import { endpoints } from './endpoints';

export const auditLogApi = {
  list: (params) => api.get(endpoints.admin.auditLogs, { params }).then((r) => r.data),
};
