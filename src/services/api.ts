import axios, { AxiosResponse } from 'axios';
import {
  ReviewCreate,
  ReviewUpdate,
  ReviewListResponse,
  BookRatingStats,
  UserReviewsResponse,
  ReviewListParams
} from '../types/review';

// FIXED: Robust environment variable access for Docker/browser environments
const getApiBaseUrl = (): string => {
  // Use window object in browser environments to access environment variables
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
  }
  
  // Fallback to process.env with safe access
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
  } catch (error) {
    console.warn('Could not access process.env:', error);
  }
  
  // Default fallback for Docker environments
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for public requests (no auth header)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token for authenticated requests
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
    publicApiClient.post('/auth/login/', credentials), // FIXED: Added trailing slash
  
  register: (userData: { name: string; email: string; password: string }): Promise<AxiosResponse<any>> =>
    publicApiClient.post('/auth/register/', userData), // FIXED: Added trailing slash
  
  logout: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/logout/', data), // FIXED: Added trailing slash
  
  getCurrentUser: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/auth/me/'), // FIXED: Added trailing slash
  
  refresh: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    publicApiClient.post('/auth/refresh/', data), // FIXED: Added trailing slash
};

// Books API endpoints
export const booksAPI = {
  getBooks: (params?: any): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books/', { params }), // FIXED: Added trailing slash

  searchBooks: (params?: any): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books/search/', { params }), // FIXED: Added trailing slash

  getBook: (id: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/books/${id}/`), // FIXED: Added trailing slash

  createBook: (bookData: any): Promise<AxiosResponse<any>> =>
    apiClient.post('/books/', bookData), // FIXED: Added trailing slash

  updateBook: (id: number, bookData: any): Promise<AxiosResponse<any>> =>
    apiClient.put(`/books/${id}/`, bookData), // FIXED: Added trailing slash

  deleteBook: (id: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/books/${id}/`), // FIXED: Added trailing slash
};

// Genres API endpoints
export const genresAPI = {
  getGenres: (): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books/genres/'), // FIXED: Added trailing slash

  getGenre: (id: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/books/genres/${id}/`), // FIXED: Added trailing slash
};

// Reviews API endpoints
export const reviewsAPI = {
  // Create a new review
  createReview: (reviewData: ReviewCreate): Promise<AxiosResponse<any>> =>
    apiClient.post('/reviews/', reviewData),

  // Get a specific review by ID
  getReview: (reviewId: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/reviews/${reviewId}/`),

  // Update an existing review (owner only)
  updateReview: (reviewId: number, reviewData: ReviewUpdate): Promise<AxiosResponse<any>> =>
    apiClient.put(`/reviews/${reviewId}/`, reviewData),

  // Delete a review (owner only)
  deleteReview: (reviewId: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/reviews/${reviewId}/`),

  // Get reviews for a specific book (paginated)
  getBookReviews: (bookId: number, params?: ReviewListParams): Promise<AxiosResponse<ReviewListResponse>> =>
    publicApiClient.get(`/reviews/book/${bookId}/`, { params }),

  // Get rating statistics for a book
  getBookRatingStats: (bookId: number): Promise<AxiosResponse<BookRatingStats>> =>
    publicApiClient.get(`/reviews/book/${bookId}/stats/`),

  // Get current user's reviews
  getUserReviews: (params?: ReviewListParams): Promise<AxiosResponse<ReviewListResponse>> =>
    apiClient.get('/reviews/user/me/', { params }),

  // Get current user's review statistics
  getUserReviewStats: (): Promise<AxiosResponse<UserReviewsResponse>> =>
    apiClient.get('/reviews/user/me/stats/'),

  // Get current user's review for a specific book
  getUserReviewForBook: (bookId: number): Promise<AxiosResponse<any>> =>
    apiClient.get(`/reviews/user/me/book/${bookId}/`),
};

export default apiClient; 