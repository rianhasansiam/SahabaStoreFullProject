import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.sahaba-store.shop',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    // You can add auth headers here if needed
    // 'Authorization': `Bearer ${token}`
  },
});

// Add request interceptor for global request modifications
api.interceptors.request.use(
  (config) => {
    // You can modify requests here (e.g., add auth tokens)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error statuses globally
    if (error.response?.status === 401) {
      // Handle unauthorized errors
    }
    return Promise.reject(error);
  }
);

export default api;