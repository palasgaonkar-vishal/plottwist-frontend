import { Book } from './book';

export interface FavoriteCreate {
  book_id: number;
}

export interface Favorite {
  id: number;
  book_id: number;
  user_id: number;
  created_at: string;
  book: Book;
}

export interface FavoriteToggleResponse {
  is_favorite: boolean;
  message: string;
}

export interface UserFavoritesResponse {
  favorites: Favorite[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FavoriteStatus {
  is_favorite: boolean;
}

export interface FavoriteCount {
  count: number;
}

export interface PopularBookResponse {
  books: Array<{
    book: Book;
    favorite_count: number;
  }>;
} 