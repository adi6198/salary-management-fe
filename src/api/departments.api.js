import apiClient from './client';
import * as mockHandlers from '../mocks/handlers';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getDepartments = async () => {
  if (useMocks) return mockHandlers.getDepartments();
  return apiClient.get('/departments');
};
