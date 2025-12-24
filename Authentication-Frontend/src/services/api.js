import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accessToken = null;
let authFailureHandler = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;

    const triggerAuthFailure = () => {
      setAccessToken(null);
      if (typeof authFailureHandler === 'function') {
        authFailureHandler();
      } else {
        window.location.href = '/';
      }
    };
    
    // Prevent infinite loop
    if (isAuthError && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      
      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        
        setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          triggerAuthFailure();
        }
        return Promise.reject(refreshError);
      }
    }
    
    if (isAuthError && originalRequest.url === '/auth/refresh') {
      triggerAuthFailure();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updateProfilePhoto: (photoData) => api.put('/auth/profile-photo', photoData),
  updateAccount: (data) => api.put('/auth/update', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

export default api;
