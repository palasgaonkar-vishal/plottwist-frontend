import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { Add, Sort } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { Review, ReviewListResponse, ReviewListParams } from '../../types/review';
import { reviewsAPI, usersAPI } from '../../services/api';

interface ReviewListProps {
  bookId: number;
  bookTitle?: string;
  showCreateButton?: boolean;
  showBookTitles?: boolean;
  mode?: 'book' | 'user';
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  bookId,
  bookTitle,
  showCreateButton = true,
  showBookTitles = false,
  mode = 'book',
  className,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });
  
  const [sortBy, setSortBy] = useState<'created_at' | 'rating' | 'updated_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadReviews = useCallback(async (params: ReviewListParams = {}) => {
    setLoading(true);
    setError('');

    try {
      const requestParams = {
        page: pagination.page,
        per_page: pagination.perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...params,
      };

      let response: { data: ReviewListResponse };
      
      if (mode === 'user') {
        response = await usersAPI.getUserReviews(requestParams);
      } else {
        response = await reviewsAPI.getBookReviews(bookId, requestParams);
      }

      const { reviews, total, page, per_page, total_pages } = response.data;
      
      setReviews(reviews);
      setPagination({
        page,
        perPage: per_page,
        total,
        totalPages: total_pages,
      });
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      
      let errorMessage = 'Failed to load reviews. Please try again.';
      if (err.response?.status === 404) {
        errorMessage = mode === 'user' ? 'No reviews found for user.' : 'Book not found.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [bookId, mode, pagination.page, pagination.perPage, sortBy, sortOrder]);

  // Load reviews when component mounts or dependencies change
  useEffect(() => {
    loadReviews();
  }, [pagination.page, pagination.perPage, sortBy, sortOrder]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handlePerPageChange = useCallback((event: any) => {
    const newPerPage = parseInt(event.target.value);
    setPagination(prev => ({ 
      ...prev, 
      perPage: newPerPage, 
      page: 1 // Reset to first page
    }));
  }, []);

  const handleSortChange = useCallback((event: any) => {
    const [newSortBy, newSortOrder] = event.target.value.split('-');
    setSortBy(newSortBy as any);
    setSortOrder(newSortOrder as any);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const handleReviewCreate = useCallback((newReview: Review) => {
    setShowCreateForm(false);
    // Reload the current page to show the new review
    loadReviews({ page: pagination.page });
  }, [loadReviews, pagination.page]);

  const handleReviewUpdate = useCallback((updatedReview: Review) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  }, []);

  const handleReviewDelete = useCallback((deletedReviewId: number) => {
    setReviews(prev => prev.filter(review => review.id !== deletedReviewId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    
    // If current page becomes empty and it's not the first page, go to previous page
    if (reviews.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else if (reviews.length === 1) {
      // Reload to update empty state
      loadReviews({ page: 1 });
    }
  }, [reviews.length, pagination.page, loadReviews]);

  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'rating-desc', label: 'Highest Rating' },
    { value: 'rating-asc', label: 'Lowest Rating' },
    { value: 'updated_at-desc', label: 'Recently Updated' },
  ];

  if (loading && reviews.length === 0) {
    return (
      <Box className={className} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Reviews {pagination.total > 0 && `(${pagination.total})`}
          </Typography>
          
          {showCreateButton && isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateForm(true)}
            >
              Write Review
            </Button>
          )}
        </Box>

        {/* Controls */}
        {reviews.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                label="Sort By"
                startAdornment={<Sort sx={{ mr: 1 }} />}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={pagination.perPage}
                onChange={handlePerPageChange}
                label="Per Page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <Box sx={{ mb: 3 }}>
            {reviews.map((review, index) => (
              <Box key={review.id}>
                <ReviewCard
                  review={review}
                  onUpdate={handleReviewUpdate}
                  onDelete={handleReviewDelete}
                  showBookTitle={showBookTitles}
                />
                {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        /* Empty State */
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {mode === 'user' ? 'No reviews written yet' : 'No reviews yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {mode === 'user' 
              ? 'Start by reviewing some books you\'ve read.'
              : 'Be the first to review this book!'
            }
          </Typography>
          
          {showCreateButton && isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateForm(true)}
            >
              Write First Review
            </Button>
          )}
        </Box>
      )}

      {/* Create Review Form */}
      {showCreateForm && (
        <ReviewForm
          bookId={bookId}
          bookTitle={bookTitle}
          mode="create"
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleReviewCreate}
        />
      )}

      {loading && reviews.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default ReviewList; 