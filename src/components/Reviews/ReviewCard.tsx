import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '../../store/hooks';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { Review } from '../../types/review';
import { reviewsAPI } from '../../services/api';

interface ReviewCardProps {
  review: Review;
  onUpdate?: (updatedReview: Review) => void;
  onDelete?: (deletedReviewId: number) => void;
  showBookTitle?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onUpdate,
  onDelete,
  showBookTitle = false,
  className,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const isOwner = user?.id === review.user_id;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  }, []);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEdit = useCallback(() => {
    setShowEditDialog(true);
    handleMenuClose();
  }, [handleMenuClose]);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
    handleMenuClose();
  }, [handleMenuClose]);

  const handleEditSuccess = useCallback((updatedReview: Review) => {
    setShowEditDialog(false);
    if (onUpdate) {
      onUpdate(updatedReview);
    }
  }, [onUpdate]);

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      await reviewsAPI.deleteReview(review.id);
      setShowDeleteDialog(false);
      
      if (onDelete) {
        onDelete(review.id);
      }
    } catch (error: any) {
      console.error('Error deleting review:', error);
      
      let errorMessage = 'Failed to delete review. Please try again.';
      if (error.response?.status === 403) {
        errorMessage = 'You can only delete your own reviews.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Review not found.';
      }
      
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [review.id, onDelete]);

  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card className={className} sx={{ mb: 2 }}>
        <CardContent>
          {/* Header with user info and actions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2 }}>
                  {review.user_name || 'Anonymous User'}
                </Typography>
                
                <Chip
                  label={`${review.rating} stars`}
                  color={getRatingColor(review.rating) as any}
                  size="small"
                  sx={{ mr: 2 }}
                />
                
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.created_at)}
                  {review.updated_at !== review.created_at && ' (edited)'}
                </Typography>
              </Box>

              <StarRating
                value={review.rating}
                readOnly
                size="small"
                showValue={false}
              />
            </Box>

            {isOwner && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="review actions"
              >
                <MoreVert />
              </IconButton>
            )}
          </Box>

          {/* Book title (for user review lists) */}
          {showBookTitle && review.book_title && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Review for:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {review.book_title}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          )}

          {/* Review title */}
          {review.title && (
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {review.title}
            </Typography>
          )}

          {/* Review content */}
          {review.content && (
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {review.content}
            </Typography>
          )}

          {/* Empty state */}
          {!review.title && !review.content && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No written review provided.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit Review
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete Review
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      {showEditDialog && (
        <ReviewForm
          bookId={review.book_id}
          bookTitle={review.book_title}
          existingReview={review}
          mode="edit"
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
          
          {review.title && (
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              "{review.title}"
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewCard; 