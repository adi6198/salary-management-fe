import apiClient from './client';
import * as mockHandlers from '../mocks/handlers';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getEmployees = async (params) => {
  if (useMocks) return mockHandlers.getEmployees(params);
  return apiClient.get('/employees', { params });
};

export const getEmployee = async (id) => {
  if (useMocks) {
    // Add logic later if needed, for now use standard handlers or just return mock employee
    return null; // placeholder for phase 3
  }
  return apiClient.get(`/employees/${id}`);
};

export const createEmployee = async (data) => {
  if (useMocks) return { success: true };
  return apiClient.post('/employees', data);
};

export const updateEmployee = async (id, data) => {
  if (useMocks) return { success: true };
  return apiClient.put(`/employees/${id}`, data);
};

export const deactivateEmployee = async (id, data) => {
  if (useMocks) return { success: true };
  return apiClient.delete(`/employees/${id}`, { data });
};

export const exportEmployeesCSV = async (params) => {
  if (useMocks) return new Blob(['id,name\n1,Test'], { type: 'text/csv' });
  return apiClient.get('/employees/export/csv', {
    params,
    responseType: 'blob',
  });
};
