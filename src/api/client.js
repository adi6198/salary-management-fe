import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';
import { keysToCamel, keysToSnake } from '../utils/caseConverter';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer token and snake_case payload
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.data = keysToSnake(config.data);
    }
    if (config.params) {
      config.params = keysToSnake(config.params);
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
    const res = keysToCamel(response.data);
    // Handle standard API envelope
    if (res && res.success !== undefined && res.data !== undefined) {
      // Backend pagination format
      if (res.pagination) {
        console.log(res.data, res.pagination);
        return { data: res.data, meta: res.pagination };
      }
      // Mock pagination format
      if (res.data && res.data.items && res.data.meta) {
        return { data: res.data.items, meta: res.data.meta };
      }
      // Fallback: just return the inner data
      return res.data.data ? res.data : res;
    }
    return res;
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
