import axios, { AxiosResponse } from 'axios';

// Safe environment variable access for Docker compatibility
const getApiBaseUrl = (): string => {
  try {
    // Try to access process.env safely
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
  } catch (error) {
    console.warn('Process environment not available, using fallback API URL');
  }
  
  // Fallback for Docker or other environments where process is undefined
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/login', credentials),

  register: (userData: { email: string; password: string; name: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/register', userData),

  refresh: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/refresh', data),

  logout: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/logout', data),

  getCurrentUser: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/auth/me'),

  verifyToken: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/auth/verify-token'),
};

// Books API endpoints
export const booksAPI = {
  getBooks: (params?: any): Promise<AxiosResponse<any>> =>
    apiClient.get('/books', { params }),

  searchBooks: (params?: any): Promise<AxiosResponse<any>> =>
    apiClient.get('/books/search', { params }),

  getBook: (id: number): Promise<AxiosResponse<any>> =>
    apiClient.get(`/books/${id}`),

  createBook: (data: any): Promise<AxiosResponse<any>> =>
    apiClient.post('/books', data),

  updateBook: (id: number, data: any): Promise<AxiosResponse<any>> =>
    apiClient.put(`/books/${id}`, data),

  deleteBook: (id: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/books/${id}`),
};

// Genres API endpoints
export const genresAPI = {
  getGenres: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/books/genres'),

  getGenre: (id: number): Promise<AxiosResponse<any>> =>
    apiClient.get(`/books/genres/${id}`),
};

export default apiClient; 