/**
 * TypeScript interfaces for review and rating system
 */

export interface ReviewCreate {
  book_id: number;
  rating: number; // 1-5 scale
  title?: string;
  content?: string;
}

export interface ReviewUpdate {
  rating?: number; // 1-5 scale
  title?: string;
  content?: string;
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  title?: string;
  content?: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  book_title?: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BookRatingStats {
  book_id: number;
  average_rating?: number;
  total_reviews: number;
  rating_distribution: {
    [key: string]: number; // "1": count, "2": count, etc.
  };
}

export interface UserReviewsResponse {
  user_id: number;
  reviews: Review[];
  total_reviews: number;
  average_rating_given?: number;
}

// Parameters for review API calls
export interface ReviewListParams {
  page?: number;
  per_page?: number;
  sort_by?: 'created_at' | 'rating' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// Form validation errors
export interface ReviewFormErrors {
  rating?: string;
  title?: string;
  content?: string;
  general?: string;
} 