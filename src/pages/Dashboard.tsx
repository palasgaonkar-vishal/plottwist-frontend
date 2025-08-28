import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MenuBook,
  Favorite,
  RateReview,
  AutoAwesome,
  Star,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { usersAPI } from '../services/api'; // UPDATED: Removed unnecessary imports
import { UserProfile } from '../types/user';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<UserProfile | null>(null); // ADDED: Profile state
  const [profileLoading, setProfileLoading] = useState(true); // ADDED: Profile loading state
  const [profileError, setProfileError] = useState<string>(''); // ADDED: Profile error state

  // ADDED: Load user profile statistics
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError('');
      const response = await usersAPI.getCurrentUserProfile();
      setProfile(response.data);
    } catch (err: any) {
      console.error('Error loading profile stats:', err);
      setProfileError('Failed to load reading statistics');
    } finally {
      setProfileLoading(false);
    }
  }, [isAuthenticated]);

  // ADDED: Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'Explore our vast collection of books',
      icon: <MenuBook sx={{ fontSize: 48, color: 'primary.main' }} />,
      link: '/books',
      color: 'primary.light',
    },
    {
      title: 'My Favorites',
      description: 'View your favorite books and authors',
      icon: <Favorite sx={{ fontSize: 48, color: 'error.main' }} />,
      link: '/favorites',
      color: 'error.light',
    },
    {
      title: 'Write Review',
      description: 'Share your thoughts on books you\'ve read',
      icon: <RateReview sx={{ fontSize: 48, color: 'secondary.main' }} />,
      link: '/books',
      color: 'secondary.light',
    },
    {
      title: 'Get Recommendations',
      description: 'Discover books tailored to your taste',
      icon: <AutoAwesome sx={{ fontSize: 48, color: 'success.main' }} />,
      link: '/recommendations',
      color: 'success.light',
    },
  ];

  return (
    <Container maxWidth="lg">      
      <Box sx={{ mb: 4, pt: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome back, {user?.name}! 📚
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to discover your next great read?
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          Your Reading Journey
        </Typography>
        
        {profileLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : profileError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {profileError}
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {profile?.stats.total_reviews || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews Written
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {profile?.stats.total_favorites || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favorites
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
              <Typography variant="h4" color="success">
                {profile?.stats.average_rating_given ? profile.stats.average_rating_given.toFixed(1) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Rating Given
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 6
      }}>
        {quickActions.map((action, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: action.color,
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  opacity: 0.1,
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </Box>
              </Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {action.description}
              </Typography>
              <Button
                component={Link}
                to={action.link}
                variant="outlined"
                size="small"
                fullWidth
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard; 