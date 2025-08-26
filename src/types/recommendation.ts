import { Book } from './book';

export enum RecommendationType {
  CONTENT_BASED = 'content_based',
  POPULARITY_BASED = 'popularity_based'
}

export interface RecommendationFeedbackCreate {
  book_id: number;
  recommendation_type: RecommendationType;
  is_positive: boolean;
  context_data?: string;
}

export interface RecommendationFeedback {
  id: number;
  user_id: number;
  book_id: number;
  recommendation_type: RecommendationType;
  is_positive: boolean;
  context_data?: string;
  created_at: string;
}

export interface RecommendationItem {
  book: Book;
  score: number;
  reason: string;
  recommendation_type: RecommendationType;
}

export interface RecommendationResponse {
  user_id: number;
  recommendations: RecommendationItem[];
  recommendation_type: RecommendationType;
  total_count: number;
  generated_at: string;
  cache_expiry?: string;
}

export interface RecommendationListResponse {
  user_id: number;
  content_based: RecommendationItem[];
  popularity_based: RecommendationItem[];
  generated_at: string;
}

export interface RecommendationParameters {
  limit?: number;
  exclude_user_books?: boolean;
  min_rating?: number;
  genres?: number[];
}

export interface RecommendationStats {
  recommendation_type: RecommendationType;
  total_generated: number;
  total_feedback: number;
  positive_feedback: number;
  negative_feedback: number;
  feedback_rate: number;
  positive_rate: number;
  avg_score?: number;
}

export interface RecommendationFormErrors {
  general?: string;
}

// UI-specific interfaces
export interface RecommendationSectionProps {
  title: string;
  recommendations: RecommendationItem[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  showFeedback?: boolean;
}

export interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onFeedback?: (bookId: number, isPositive: boolean) => void;
  showFeedback?: boolean;
} 