export interface Genre {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  published_year?: number;
  isbn?: string;
  cover_url?: string;
  average_rating: number;
  total_reviews: number;
  genres: Genre[];
  created_at: string;
  updated_at: string;
}

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BookSearchResponse extends BookListResponse {
  query?: string;
  filters_applied: Record<string, any>;
}

export interface BookSearchParams {
  query?: string;
  genre_id?: number;
  min_rating?: number;
  published_year_start?: number;
  published_year_end?: number;
  page?: number;
  per_page?: number;
}

export interface BookFilters {
  genre?: number;
  minRating?: number;
  publishedYearStart?: number;
  publishedYearEnd?: number;
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list'
} 