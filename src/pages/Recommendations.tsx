import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  TrendingUp,
  Favorite,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { recommendationsAPI } from '../services/api';
import { 
  RecommendationListResponse, 
  RecommendationFeedbackCreate, 
  RecommendationType 
} from '../types/recommendation';
import RecommendationSection from '../components/Recommendations/RecommendationSection';
import BreadcrumbsNav from '../components/Breadcrumbs';

const Recommendations: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [recommendations, setRecommendations] = useState<RecommendationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = useCallback(async (showRefreshing = false) => {
    if (!isAuthenticated) {
      setError('Please log in to see personalized recommendations');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const response = await recommendationsAPI.getAllRecommendations({
        limit: 12,
        exclude_user_books: true,
        min_rating: 3.0,
      });

      setRecommendations(response.data);

    } catch (err: any) {
      console.error('Error loading recommendations:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to see personalized recommendations');
      } else if (err.response?.status === 404) {
        setError('No recommendations available at this time');
      } else {
        setError('Failed to load recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  const handleFeedback = useCallback(async (bookId: number, isPositive: boolean, recommendationType: RecommendationType) => {
    try {
      const feedbackData: RecommendationFeedbackCreate = {
        book_id: bookId,
        recommendation_type: recommendationType,
        is_positive: isPositive,
        context_data: JSON.stringify({
          page: 'recommendations',
          timestamp: new Date().toISOString(),
        }),
      };

      await recommendationsAPI.submitFeedback(feedbackData);
      console.log('Feedback submitted successfully');

    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error; // Re-throw to be handled by the RecommendationCard
    }
  }, []);

  const handleContentBasedFeedback = useCallback((bookId: number, isPositive: boolean) => {
    return handleFeedback(bookId, isPositive, RecommendationType.CONTENT_BASED);
  }, [handleFeedback]);

  const handlePopularityBasedFeedback = useCallback((bookId: number, isPositive: boolean) => {
    return handleFeedback(bookId, isPositive, RecommendationType.POPULARITY_BASED);
  }, [handleFeedback]);

  const handleRefresh = useCallback(() => {
    loadRecommendations(true);
  }, [loadRecommendations]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  if (!isAuthenticated) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            Please log in to see personalized book recommendations.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
                 {/* Breadcrumbs */}
         <Box sx={{ mb: 2 }}>
           <Typography variant="body2" color="text.secondary">
             Home / Recommendations
           </Typography>
         </Box>

        {/* Page Header */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesome sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  Discover Your Next Great Read
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Personalized book recommendations just for you
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={refreshing}
              startIcon={refreshing ? <CircularProgress size={20} /> : <Refresh />}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh All'}
            </Button>
          </Box>

          {recommendations && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip
                    icon={<Favorite />}
                    label={`${recommendations.content_based.length} personalized recommendations`}
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    icon={<TrendingUp />}
                    label={`${recommendations.popularity_based.length} trending books`}
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Recommendations Sections */}
        {recommendations && !error && (
          <>
            {/* Content-Based Recommendations */}
            <RecommendationSection
              title="Just for You"
              recommendations={recommendations.content_based}
              recommendationType={RecommendationType.CONTENT_BASED}
              loading={refreshing}
              onRefresh={handleRefresh}
              onFeedback={handleContentBasedFeedback}
              showFeedback={true}
            />

            {/* Popularity-Based Recommendations */}
            <RecommendationSection
              title="Trending Now"
              recommendations={recommendations.popularity_based}
              recommendationType={RecommendationType.POPULARITY_BASED}
              loading={refreshing}
              onRefresh={handleRefresh}
              onFeedback={handlePopularityBasedFeedback}
              showFeedback={true}
            />
          </>
        )}

        {/* No Recommendations State */}
        {recommendations && !error && recommendations.content_based.length === 0 && recommendations.popularity_based.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No recommendations available yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding some books to your favorites or writing reviews to get personalized recommendations.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" href="/books">
                Browse Books
              </Button>
              <Button variant="outlined" onClick={handleRefresh}>
                Try Again
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Recommendations; 