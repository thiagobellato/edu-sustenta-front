import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/token/', { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/users/', data),
  
  getMe: () => api.get('/users/me/'),
  
  becomeAluno: () => api.post('/users/become-aluno/'),
};

// Dashboard endpoints
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats/'),
};

// Schools endpoints
export const schoolsApi = {
  getAll: () => api.get('/schools/'),
  create: (data: { name: string; cnpj: string }) => api.post('/schools/', data),
  join: (token: string) => api.post('/schools/join/', { token }),
};

// Professors endpoints
export const professorsApi = {
  getAll: () => api.get('/professores/'),
};

// Notifications endpoints
export const notificationsApi = {
  getAll: () => api.get('/notifications/'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/`, { read: true }),
};

// Students endpoints
export const studentsApi = {
  getAll: () => api.get('/students/'),
};

// Trails endpoints
export const trailsApi = {
  getAll: (params?: { status?: string; category?: string }) => 
    api.get('/trails/', { params }),
  getOne: (id: number) => api.get(`/trails/${id}/`),
  create: (data: any) => api.post('/trails/', data),
  update: (id: number, data: any) => api.patch(`/trails/${id}/`, data),
  delete: (id: number) => api.delete(`/trails/${id}/`),
};

export default api;
