import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import StarRating from './StarRating';
import { reviewsAPI } from '../../services/api';
import { Review, ReviewCreate, ReviewUpdate, ReviewFormErrors } from '../../types/review';

interface ReviewFormProps {
  bookId: number;
  bookTitle?: string;
  existingReview?: Review;
  mode: 'create' | 'edit';
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (review: Review) => void;
  onError?: (error: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  bookTitle,
  existingReview,
  mode,
  open = true,
  onClose,
  onSuccess,
  onError,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    content: existingReview?.content || '',
  });
  
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when existingReview changes
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating,
        title: existingReview.title || '',
        content: existingReview.content || '',
      });
    } else {
      setFormData({
        rating: 0,
        title: '',
        content: '',
      });
    }
    setErrors({});
  }, [existingReview]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ReviewFormErrors = {};

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating between 1 and 5 stars';
    }

    if (formData.title && formData.title.length > 255) {
      newErrors.title = 'Title cannot exceed 255 characters';
    }

    if (formData.content && formData.content.length > 2000) {
      newErrors.content = 'Review content cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setErrors({ general: 'You must be logged in to submit a review' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let response;
      
      if (mode === 'create') {
        const reviewData: ReviewCreate = {
          book_id: bookId,
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          content: formData.content.trim() || undefined,
        };
        response = await reviewsAPI.createReview(reviewData);
      } else {
        const reviewData: ReviewUpdate = {
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          content: formData.content.trim() || undefined,
        };
        response = await reviewsAPI.updateReview(existingReview!.id, reviewData);
      }

      const review = response.data;
      setShowSuccess(true);
      
      if (onSuccess) {
        onSuccess(review);
      }

      // Reset form for create mode
      if (mode === 'create') {
        setFormData({ rating: 0, title: '', content: '' });
      }

      // Close dialog after short delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      let errorMessage = 'Failed to submit review. Please try again.';
      
      if (error.response?.status === 400) {
        if (error.response.data?.detail?.includes('already reviewed')) {
          errorMessage = 'You have already reviewed this book. Please edit your existing review instead.';
        } else {
          errorMessage = 'Invalid review data. Please check your input and try again.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'You must be logged in to submit a review.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You can only edit your own reviews.';
      } else if (error.response?.status === 404) {
        errorMessage = mode === 'edit' ? 'Review not found.' : 'Book not found.';
      }

      setErrors({ general: errorMessage });
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookId, formData, mode, existingReview, isAuthenticated, validateForm, onSuccess, onError, onClose]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleRatingChange = useCallback((value: number) => {
    setFormData(prev => ({ ...prev, rating: value }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  }, [errors.rating]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, title: value }));
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  }, [errors.title]);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  }, [errors.content]);

  const isDialog = open !== undefined && onClose !== undefined;

  const formContent = (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {bookTitle && (
        <Typography variant="h6" gutterBottom>
          {mode === 'create' ? 'Write a Review for' : 'Edit Review for'} "{bookTitle}"
        </Typography>
      )}

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Review {mode === 'create' ? 'submitted' : 'updated'} successfully!
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <StarRating
          value={formData.rating}
          onChange={handleRatingChange}
          readOnly={isLoading}
          label="Your Rating *"
          error={!!errors.rating}
          helperText={errors.rating}
          showValue={true}
        />
      </Box>

      <TextField
        fullWidth
        label="Review Title (Optional)"
        value={formData.title}
        onChange={handleTitleChange}
        error={!!errors.title}
        helperText={errors.title || `${formData.title.length}/255 characters`}
        disabled={isLoading}
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 255 }}
      />

      <TextField
        fullWidth
        label="Review Content (Optional)"
        value={formData.content}
        onChange={handleContentChange}
        error={!!errors.content}
        helperText={errors.content || `${formData.content.length}/2000 characters`}
        disabled={isLoading}
        multiline
        rows={4}
        sx={{ mb: 3 }}
        inputProps={{ maxLength: 2000 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onClose && (
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !formData.rating}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        >
          {isLoading 
            ? (mode === 'create' ? 'Submitting...' : 'Updating...') 
            : (mode === 'create' ? 'Submit Review' : 'Update Review')
          }
        </Button>
      </Box>
    </Box>
  );

  if (isDialog) {
    return (
      <>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { minHeight: '400px' }
          }}
        >
          <DialogTitle>
            {mode === 'create' ? 'Write a Review' : 'Edit Review'}
          </DialogTitle>
          <DialogContent>
            {formContent}
          </DialogContent>
        </Dialog>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            Review {mode === 'create' ? 'submitted' : 'updated'} successfully!
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {formContent}
    </Paper>
  );
};

export default ReviewForm; 