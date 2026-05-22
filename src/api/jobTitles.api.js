import apiClient from './client';
import * as mockHandlers from '../mocks/handlers';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const getJobTitles = async () => {
  if (useMocks) return mockHandlers.getJobTitles();
  return apiClient.get('/job-titles');
};
