import apiClient from './client';

export const login = async (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const getMe = async () => {
  return apiClient.get('/auth/me');
};
