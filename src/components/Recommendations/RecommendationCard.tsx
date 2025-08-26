import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Star,
  TrendingUp,
  Favorite,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RecommendationItem, RecommendationType } from '../../types/recommendation';
import BookCover from '../Books/BookCover';
import FavoriteButton from '../User/FavoriteButton';
import StarRating from '../Reviews/StarRating';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onFeedback?: (bookId: number, isPositive: boolean) => void;
  showFeedback?: boolean;
  compact?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onFeedback,
  showFeedback = true,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const { book, score, reason, recommendation_type } = recommendation;

  const handleBookClick = useCallback(() => {
    navigate(`/books/${book.id}`);
  }, [navigate, book.id]);

  const handleFeedback = useCallback(async (isPositive: boolean) => {
    if (!onFeedback) return;

    try {
      await onFeedback(book.id, isPositive);
      setFeedbackGiven(isPositive);
      setMessage(isPositive ? 'Thanks for the positive feedback!' : 'Thanks for the feedback!');
      setShowMessage(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback');
      setShowMessage(true);
    }
  }, [onFeedback, book.id]);

  const getRecommendationTypeIcon = () => {
    switch (recommendation_type) {
      case RecommendationType.CONTENT_BASED:
        return <Favorite fontSize="small" color="primary" />;
      case RecommendationType.POPULARITY_BASED:
        return <TrendingUp fontSize="small" color="secondary" />;
      default:
        return <Star fontSize="small" />;
    }
  };

  const getRecommendationTypeLabel = () => {
    switch (recommendation_type) {
      case RecommendationType.CONTENT_BASED:
        return 'Based on your favorites';
      case RecommendationType.POPULARITY_BASED:
        return 'Popular choice';
      default:
        return 'Recommended';
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
        }}
        onClick={handleBookClick}
      >
        <Box sx={{ position: 'relative' }}>
                     <BookCover
             coverUrl={book.cover_url}
             title={book.title}
             author={book.author}
             height={compact ? 150 : 200}
             sx={{
               width: '100%',
             }}
           />

          {/* Recommendation Type Badge */}
          <Chip
            icon={getRecommendationTypeIcon()}
            label={getRecommendationTypeLabel()}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '& .MuiChip-label': {
                fontSize: '0.7rem',
                px: 1,
              },
            }}
          />

          {/* Favorite Button */}
          <Box 
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton
              bookId={book.id}
              bookTitle={book.title}
              size="small"
            />
          </Box>

          {/* Recommendation Score */}
          <Chip
            label={`${(score * 100).toFixed(0)}% match`}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {book.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
            by {book.author}
          </Typography>

          {!compact && (
            <>
              {/* Rating and Reviews */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {book.average_rating > 0 ? (
                  <>
                    <StarRating
                      value={book.average_rating}
                      readOnly
                      size="small"
                      showValue={false}
                    />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {book.average_rating.toFixed(1)} ({book.total_reviews} reviews)
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No ratings yet
                  </Typography>
                )}
              </Box>

              {/* Recommendation Reason */}
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  fontStyle: 'italic',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {reason}
              </Typography>

              {/* Genres */}
              {book.genres && book.genres.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {book.genres.slice(0, 2).map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                    />
                  ))}
                  {book.genres.length > 2 && (
                    <Chip
                      label={`+${book.genres.length - 2} more`}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>

        {/* Feedback Buttons */}
        {showFeedback && !compact && (
          <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
            <Box onClick={(e) => e.stopPropagation()}>
              <Tooltip title="This recommendation was helpful">
                <IconButton
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackGiven !== null}
                  color={feedbackGiven === true ? 'primary' : 'default'}
                  size="small"
                >
                  <ThumbUp fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="This recommendation wasn't helpful">
                <IconButton
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackGiven !== null}
                  color={feedbackGiven === false ? 'error' : 'default'}
                  size="small"
                >
                  <ThumbDown fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        )}
      </Card>

      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setShowMessage(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecommendationCard; 