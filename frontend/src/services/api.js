import React from 'react';
import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Resilience: Ensure the URL has a protocol and the /api suffix if not local
if (import.meta.env.VITE_API_URL) {
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
  }
}

const api = axios.create({
  baseURL: baseUrl
});

// Add a request interceptor to log or handle errors globally if needed
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
