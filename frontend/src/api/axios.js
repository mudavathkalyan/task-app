// src/api/axios.js
// Centralized Axios instance with JWT auth header auto-attached
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Uses Vite proxy → http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
