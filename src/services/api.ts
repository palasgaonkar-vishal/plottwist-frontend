import axios, { AxiosResponse } from 'axios';
import {
  ReviewCreate,
  ReviewUpdate,
  ReviewListResponse,
  BookRatingStats,
  UserReviewsResponse,
  ReviewListParams
} from '../types/review';
import { UserProfile, UserUpdate } from '../types/user';
import { 
  FavoriteCreate, 
  FavoriteToggleResponse, 
  UserFavoritesResponse, 
  FavoriteStatus, 
  FavoriteCount,
  PopularBookResponse 
} from '../types/favorite';
import {
  RecommendationFeedbackCreate,
  RecommendationResponse,
  RecommendationListResponse,
  RecommendationParameters,
  RecommendationStats,
  RecommendationType
} from '../types/recommendation';

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
    publicApiClient.post('/auth/login', credentials), // FIXED: Removed trailing slash
  
  register: (userData: { name: string; email: string; password: string }): Promise<AxiosResponse<any>> =>
    publicApiClient.post('/auth/register', userData), // FIXED: Removed trailing slash
  
  logout: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    apiClient.post('/auth/logout', data), // FIXED: Removed trailing slash
  
  getCurrentUser: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/auth/me'), // FIXED: Removed trailing slash
  
  refresh: (data: { refresh_token: string }): Promise<AxiosResponse<any>> =>
    publicApiClient.post('/auth/refresh', data), // FIXED: Removed trailing slash
};

// Books API endpoints
export const booksAPI = {
  getBooks: (params?: any): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books', { params }), // FIXED: Removed trailing slash

  searchBooks: (params?: any): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books/search', { params }), // FIXED: Removed trailing slash

  getBook: (id: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/books/${id}`), // FIXED: Removed trailing slash

  createBook: (bookData: any): Promise<AxiosResponse<any>> =>
    apiClient.post('/books', bookData), // FIXED: Removed trailing slash

  updateBook: (id: number, bookData: any): Promise<AxiosResponse<any>> =>
    apiClient.put(`/books/${id}`, bookData), // FIXED: Removed trailing slash

  deleteBook: (id: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/books/${id}`), // FIXED: Removed trailing slash
};

// Genres API endpoints
export const genresAPI = {
  getGenres: (): Promise<AxiosResponse<any>> =>
    publicApiClient.get('/books/genres'), // FIXED: Removed trailing slash

  getGenre: (id: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/books/genres/${id}`), // FIXED: Removed trailing slash
};

// Reviews API endpoints
export const reviewsAPI = {
  // Create a new review
  createReview: (reviewData: ReviewCreate): Promise<AxiosResponse<any>> =>
    apiClient.post('/reviews', reviewData),

  // Get a specific review by ID
  getReview: (reviewId: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/reviews/${reviewId}`),

  // Update an existing review (owner only)
  updateReview: (reviewId: number, reviewData: ReviewUpdate): Promise<AxiosResponse<any>> =>
    apiClient.put(`/reviews/${reviewId}`, reviewData),

  // Delete a review (owner only)
  deleteReview: (reviewId: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/reviews/${reviewId}`),

  // Get reviews for a specific book (paginated)
  getBookReviews: (bookId: number, params?: ReviewListParams): Promise<AxiosResponse<ReviewListResponse>> =>
    publicApiClient.get(`/reviews/book/${bookId}`, { params }),

  // Get rating statistics for a book
  getBookRatingStats: (bookId: number): Promise<AxiosResponse<BookRatingStats>> =>
    publicApiClient.get(`/reviews/book/${bookId}/stats`),

  // Get current user's reviews
  getUserReviews: (params?: ReviewListParams): Promise<AxiosResponse<ReviewListResponse>> =>
    apiClient.get('/reviews/user/me', { params }),

  // Get current user's review statistics
  getUserReviewStats: (): Promise<AxiosResponse<UserReviewsResponse>> =>
    apiClient.get('/reviews/user/me/stats'),

  // Get current user's review for a specific book
  getUserReviewForBook: (bookId: number): Promise<AxiosResponse<any>> =>
    apiClient.get(`/reviews/user/me/book/${bookId}`),
};

// Users API endpoints
export const usersAPI = {
  // Get current user's basic information
  getCurrentUser: (): Promise<AxiosResponse<any>> =>
    apiClient.get('/users/me'),

  // Get current user's full profile with statistics
  getCurrentUserProfile: (): Promise<AxiosResponse<UserProfile>> =>
    apiClient.get('/users/me'),

  // Update current user's profile
  updateProfile: (userData: UserUpdate): Promise<AxiosResponse<any>> =>
    apiClient.put('/users/me', userData),

  // Get current user's reviews
  getUserReviews: (params?: ReviewListParams): Promise<AxiosResponse<ReviewListResponse>> =>
    apiClient.get('/users/me/reviews', { params }),

  // Get user by ID (public info)
  getUserById: (userId: number): Promise<AxiosResponse<any>> =>
    publicApiClient.get(`/users/${userId}`),

  // Get user's public profile
  getUserProfile: (userId: number): Promise<AxiosResponse<UserProfile>> =>
    publicApiClient.get(`/users/${userId}/profile`),
};

// Favorites API endpoints
export const favoritesAPI = {
  // Add a book to favorites
  addFavorite: (favoriteData: FavoriteCreate): Promise<AxiosResponse<any>> =>
    apiClient.post('/favorites', favoriteData),

  // Remove a book from favorites
  removeFavorite: (bookId: number): Promise<AxiosResponse<any>> =>
    apiClient.delete(`/favorites/${bookId}`),

  // Toggle favorite status
  toggleFavorite: (bookId: number): Promise<AxiosResponse<FavoriteToggleResponse>> =>
    apiClient.post(`/favorites/toggle/${bookId}`),

  // Check if book is favorited
  checkFavoriteStatus: (bookId: number): Promise<AxiosResponse<FavoriteStatus>> =>
    apiClient.get(`/favorites/check/${bookId}`),

  // Get current user's favorites
  getUserFavorites: (page?: number, perPage?: number): Promise<AxiosResponse<UserFavoritesResponse>> =>
    apiClient.get('/favorites/me', { 
      params: { page, per_page: perPage } 
    }),

  // Get favorites count
  getFavoritesCount: (): Promise<AxiosResponse<FavoriteCount>> =>
    apiClient.get('/favorites/count'),

  // Get book favorites count
  getBookFavoritesCount: (bookId: number): Promise<AxiosResponse<FavoriteCount>> =>
    publicApiClient.get(`/favorites/book/${bookId}/count`),

  // Get popular books
  getPopularBooks: (limit?: number): Promise<AxiosResponse<PopularBookResponse>> =>
    publicApiClient.get('/favorites/popular', { 
      params: { limit } 
    }),
};

// Recommendations API endpoints
export const recommendationsAPI = {
  // Get content-based recommendations
  getContentBasedRecommendations: (params?: RecommendationParameters): Promise<AxiosResponse<RecommendationResponse>> =>
    apiClient.get('/recommendations/content-based', { params }),

  // Get popularity-based recommendations
  getPopularityBasedRecommendations: (params?: RecommendationParameters): Promise<AxiosResponse<RecommendationResponse>> =>
    apiClient.get('/recommendations/popularity-based', { params }),

  // Get all recommendation types
  getAllRecommendations: (params?: Omit<RecommendationParameters, 'genres'>): Promise<AxiosResponse<RecommendationListResponse>> =>
    apiClient.get('/recommendations/all', { params }),

  // Submit recommendation feedback
  submitFeedback: (feedback: RecommendationFeedbackCreate): Promise<AxiosResponse<any>> =>
    apiClient.post('/recommendations/feedback', feedback),

  // Get recommendation statistics
  getRecommendationStats: (recommendationType?: RecommendationType): Promise<AxiosResponse<RecommendationStats[]>> =>
    apiClient.get('/recommendations/stats', { 
      params: { recommendation_type: recommendationType } 
    }),

  // Invalidate user recommendations cache
  invalidateCache: (): Promise<AxiosResponse<any>> =>
    apiClient.post('/recommendations/invalidate-cache'),
};

export default apiClient; 