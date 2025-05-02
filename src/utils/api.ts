import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Updated to use port 3001

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Skip adding token for auth endpoints
  if (config.url?.includes('/auth/')) {
    return config;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
};

// Books API
export const bookApi = {
  getAll: () => api.get('/api/books'),
  getById: (id: string) => api.get(`/api/books/${id}`),
  create: (data: any) => api.post('/api/books', data),
  update: (id: string, data: any) => api.patch(`/api/books/${id}`, data),
  delete: (id: string) => api.delete(`/api/books/${id}`),
};

// Reviews API
export const reviewApi = {
  getAll: () => api.get('/api/reviews'),
  getById: (id: string) => api.get(`/api/reviews/${id}`),
  create: (data: any) => api.post('/api/reviews', data),
  update: (id: string, data: any) => api.patch(`/api/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/api/reviews/${id}`),
};

// Favorites API
export const favoriteApi = {
  getAll: () => api.get('/api/favorites'),
  add: (bookId: string) => api.post('/api/favorites', { bookId }),
  remove: (bookId: string) => api.delete(`/api/favorites/${bookId}`),
};

export default api; 