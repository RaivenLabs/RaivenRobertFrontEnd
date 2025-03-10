﻿import axios from 'axios';
import { config } from '../config/config.development';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = Bearer ;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
