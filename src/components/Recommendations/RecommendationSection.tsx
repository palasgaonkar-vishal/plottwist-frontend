import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  Favorite,
  Star,
} from '@mui/icons-material';
import { RecommendationItem, RecommendationType } from '../../types/recommendation';
import RecommendationCard from './RecommendationCard';

interface RecommendationSectionProps {
  title: string;
  recommendations: RecommendationItem[];
  recommendationType: RecommendationType;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onFeedback?: (bookId: number, isPositive: boolean) => void;
  showFeedback?: boolean;
  compact?: boolean;
  maxItems?: number;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  recommendations,
  recommendationType,
  loading = false,
  error,
  onRefresh,
  onFeedback,
  showFeedback = true,
  compact = false,
  maxItems,
}) => {
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  const getRecommendationTypeIcon = () => {
    switch (recommendationType) {
      case RecommendationType.CONTENT_BASED:
        return <Favorite color="primary" />;
      case RecommendationType.POPULARITY_BASED:
        return <TrendingUp color="secondary" />;
      default:
        return <Star />;
    }
  };

  const getRecommendationTypeDescription = () => {
    switch (recommendationType) {
      case RecommendationType.CONTENT_BASED:
        return 'Books similar to your favorites and reading preferences';
      case RecommendationType.POPULARITY_BASED:
        return 'Highly-rated books that are trending among readers';
      default:
        return 'Personalized book recommendations';
    }
  };

  const displayedRecommendations = maxItems 
    ? recommendations.slice(0, maxItems)
    : recommendations;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getRecommendationTypeIcon()}
          <Box sx={{ ml: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom={false}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getRecommendationTypeDescription()}
            </Typography>
          </Box>
        </Box>

        {onRefresh && (
          <Tooltip title="Refresh recommendations">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh sx={{ 
                animation: loading ? 'spin 2s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            onRefresh && (
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && displayedRecommendations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          {getRecommendationTypeIcon()}
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
            No recommendations available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {recommendationType === RecommendationType.CONTENT_BASED
              ? 'Add some books to your favorites to get personalized recommendations'
              : 'Check back later for popular book recommendations'
            }
          </Typography>
          {onRefresh && (
            <Button variant="outlined" onClick={handleRefresh} startIcon={<Refresh />}>
              Refresh
            </Button>
          )}
        </Box>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && displayedRecommendations.length > 0 && (
        <>
          <Grid container spacing={compact ? 2 : 3}>
            {displayedRecommendations.map((recommendation, index) => (
              <Grid item xs={12} sm={6} md={compact ? 3 : 4} lg={compact ? 2 : 3} key={`${recommendation.book.id}-${index}`}>
                <RecommendationCard
                  recommendation={recommendation}
                  onFeedback={onFeedback}
                  showFeedback={showFeedback}
                  compact={compact}
                />
              </Grid>
            ))}
          </Grid>

          {/* Show More Button */}
          {maxItems && recommendations.length > maxItems && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Showing {maxItems} of {recommendations.length} recommendations
              </Typography>
              {/* This could expand to show more or navigate to a dedicated page */}
            </Box>
          )}

          {/* Recommendations Count */}
          {!maxItems && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default RecommendationSection; 