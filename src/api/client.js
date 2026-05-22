import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract data and handle 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => {
    // The backend uses format: { success: true, data: ... } or raw data.
    // Let's standardise returning response.data.data or response.data.
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      // Only redirect to login if we are not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
