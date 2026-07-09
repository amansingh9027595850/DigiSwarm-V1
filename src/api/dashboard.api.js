import { api } from './axios';
import { endpoints } from './endpoints';

export const dashboardApi = {
  stats: () => api.get(endpoints.admin.dashboardStats).then((r) => r.data),
  recentActivity: () => api.get(endpoints.admin.dashboardActivity).then((r) => r.data),
};
