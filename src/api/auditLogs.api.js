import apiClient from './client';
import * as mockHandlers from '../mocks/handlers';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getAuditLogs = async (employeeId, params) => {
  if (useMocks) return mockHandlers.getAuditLogs(employeeId, params);
  return apiClient.get(`/employees/${employeeId}/audit-logs`, { params });
};
