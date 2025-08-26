export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_verified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileStats {
  total_reviews: number;
  average_rating_given?: number;
  total_favorites: number;
  books_reviewed: number;
  reviews_this_month: number;
}

export interface UserProfile extends User {
  stats: UserProfileStats;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  general?: string;
} 