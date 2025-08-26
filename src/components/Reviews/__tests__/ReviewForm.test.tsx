import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewForm from '../ReviewForm';
import authSlice, { AuthState } from '../../../store/slices/authSlice';
import { reviewsAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  reviewsAPI: {
    createReview: jest.fn(),
    updateReview: jest.fn(),
  },
}));

const mockReviewsAPI = reviewsAPI as jest.Mocked<typeof reviewsAPI>;

// Mock store setup
const createMockStore = (authState: Partial<AuthState> = {
  isAuthenticated: true,
  user: { id: 1, name: 'Test User', email: 'test@example.com' },
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token',
  isLoading: false,
  error: null,
}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: authState as AuthState,
    },
  });
};

const renderWithProvider = (component: React.ReactElement, authState?: any) => {
  const store = createMockStore(authState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ReviewForm Component', () => {
  const mockProps = {
    bookId: 1,
    bookTitle: 'Test Book',
    mode: 'create' as const,
    onSuccess: jest.fn(),
    onError: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render create review form', () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      expect(screen.getByText('Write a Review for "Test Book"')).toBeInTheDocument();
      expect(screen.getByLabelText(/your rating/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/review title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/review content/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
    });

    it('should render edit review form with existing data', () => {
      const existingReview = {
        id: 1,
        book_id: 1,
        user_id: 1,
        rating: 4,
        title: 'Great book',
        content: 'Really enjoyed reading this.',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      renderWithProvider(
        <ReviewForm 
          {...mockProps}
          mode="edit"
          existingReview={existingReview}
        />
      );
      
      expect(screen.getByText('Edit Review for "Test Book"')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Great book')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Really enjoyed reading this.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update review/i })).toBeInTheDocument();
    });

    it('should show unauthenticated state', () => {
      renderWithProvider(
        <ReviewForm {...mockProps} />,
        { 
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        }
      );

      const submitButton = screen.getByRole('button', { name: /submit review/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should require rating selection', async () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit review/i });
      expect(submitButton).toBeDisabled(); // Should be disabled when rating is 0
    });

    it('should validate title length', async () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      // Set a rating first to enable the form
      const ratingInput = screen.getByLabelText(/your rating/i);
      fireEvent.click(ratingInput);
      
      const titleInput = screen.getByLabelText(/review title/i);
      const longTitle = 'a'.repeat(256); // Exceeds 255 character limit
      
      fireEvent.change(titleInput, { target: { value: longTitle } });
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/title cannot exceed 255 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate content length', async () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      const contentInput = screen.getByLabelText(/review content/i);
      const longContent = 'a'.repeat(2001); // Exceeds 2000 character limit
      
      fireEvent.change(contentInput, { target: { value: longContent } });
      fireEvent.blur(contentInput);
      
      await waitFor(() => {
        expect(screen.getByText(/review content cannot exceed 2000 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit create review successfully', async () => {
      const mockReview = {
        id: 1,
        book_id: 1,
        user_id: 1,
        rating: 5,
        title: 'Amazing!',
        content: 'Loved this book!',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

             mockReviewsAPI.createReview.mockResolvedValueOnce({ 
         data: mockReview,
         status: 201,
         statusText: 'Created',
         headers: {},
         config: {} as any
       });

      renderWithProvider(<ReviewForm {...mockProps} />);
      
      // Fill out the form
      const ratingStars = screen.getAllByRole('radio');
      fireEvent.click(ratingStars[4]); // 5 stars
      
      fireEvent.change(screen.getByLabelText(/review title/i), {
        target: { value: 'Amazing!' }
      });
      
      fireEvent.change(screen.getByLabelText(/review content/i), {
        target: { value: 'Loved this book!' }
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
      
      await waitFor(() => {
        expect(mockReviewsAPI.createReview).toHaveBeenCalledWith({
          book_id: 1,
          rating: 5,
          title: 'Amazing!',
          content: 'Loved this book!',
        });
        expect(mockProps.onSuccess).toHaveBeenCalledWith(mockReview);
      });
    });

    it('should submit update review successfully', async () => {
      const existingReview = {
        id: 1,
        book_id: 1,
        user_id: 1,
        rating: 4,
        title: 'Good book',
        content: 'Pretty good read.',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const updatedReview = { ...existingReview, rating: 5, title: 'Great book!' };
             mockReviewsAPI.updateReview.mockResolvedValueOnce({ 
         data: updatedReview,
         status: 200,
         statusText: 'OK',
         headers: {},
         config: {} as any
       });

      renderWithProvider(
        <ReviewForm 
          {...mockProps}
          mode="edit"
          existingReview={existingReview}
        />
      );
      
      // Update rating
      const ratingStars = screen.getAllByRole('radio');
      fireEvent.click(ratingStars[4]); // 5 stars
      
      // Update title
      const titleInput = screen.getByDisplayValue('Good book');
      fireEvent.change(titleInput, { target: { value: 'Great book!' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /update review/i }));
      
      await waitFor(() => {
        expect(mockReviewsAPI.updateReview).toHaveBeenCalledWith(1, {
          rating: 5,
          title: 'Great book!',
          content: 'Pretty good read.',
        });
        expect(mockProps.onSuccess).toHaveBeenCalledWith(updatedReview);
      });
    });

    it('should handle API errors', async () => {
      mockReviewsAPI.createReview.mockRejectedValueOnce({
        response: { status: 400, data: { detail: 'Invalid data' } }
      });

      renderWithProvider(<ReviewForm {...mockProps} />);
      
      // Fill out minimal form
      const ratingStars = screen.getAllByRole('radio');
      fireEvent.click(ratingStars[4]); // 5 stars
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid review data/i)).toBeInTheDocument();
        expect(mockProps.onError).toHaveBeenCalled();
      });
    });
  });

  describe('Character Counters', () => {
    it('should show character counter for title', () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      expect(screen.getByText('0/255 characters')).toBeInTheDocument();
      
      fireEvent.change(screen.getByLabelText(/review title/i), {
        target: { value: 'Test title' }
      });
      
      expect(screen.getByText('10/255 characters')).toBeInTheDocument();
    });

    it('should show character counter for content', () => {
      renderWithProvider(<ReviewForm {...mockProps} />);
      
      expect(screen.getByText('0/2000 characters')).toBeInTheDocument();
      
      fireEvent.change(screen.getByLabelText(/review content/i), {
        target: { value: 'Test content' }
      });
      
      expect(screen.getByText('12/2000 characters')).toBeInTheDocument();
    });
  });
}); 