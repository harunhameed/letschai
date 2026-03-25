import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor — attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by clearing token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const register = (data) => api.post('/auth/register/', data);
export const login = (data) => api.post('/auth/login/', data);

// ─── Profile ───
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.put('/profile/', data);
export const getUserProfile = (id) => api.get(`/profile/${id}/`);

// ─── Feed ───
export const getPosts = () => api.get('/posts/');
export const createPost = (data) => api.post('/posts/', data);

// ─── Connections ───
export const sendConnectionRequest = (data) => api.post('/connections/send/', data);
export const acceptConnection = (id) => api.post(`/connections/accept/${id}/`);
export const getPendingRequests = () => api.get('/connections/pending/');
export const getMyConnections = () => api.get('/connections/');

// ─── Search ───
export const searchUsers = (params) => {
  const qs = new URLSearchParams();
  if (params.q) qs.append('q', params.q);
  if (params.branch_name) qs.append('branch_name', params.branch_name);
  if (params.batch_year) qs.append('batch_year', params.batch_year);
  if (params.is_authorized !== undefined && params.is_authorized !== '') qs.append('is_authorized', params.is_authorized);
  return api.get(`/search/?${qs.toString()}`);
};

// ─── Stats ───
export const getStats = () => api.get('/stats/');

// ─── Spin ───
export const spinWheel = () => api.post('/spin/');

// ─── Clubs ───
export const getClubs = () => api.get('/clubs/');
export const getClubPosts = (clubId) => api.get(`/clubs/${clubId}/posts/`);

export default api;
