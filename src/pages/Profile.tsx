import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Person,
  Edit,
  Star,
  Favorite,
  RateReview,
  LocationOn,
  Language,
  CalendarToday,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '../store/hooks';
import { usersAPI, favoritesAPI } from '../services/api';
import { UserProfile } from '../types/user';
import { UserFavoritesResponse } from '../types/favorite';
import { ReviewListResponse } from '../types/review';
import ProfileForm from '../components/User/ProfileForm';
import ReviewList from '../components/Reviews/ReviewList';
import BookCard from '../components/Books/BookCard';
import FavoriteButton from '../components/User/FavoriteButton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<UserFavoritesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Please log in to view your profile');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [profileResponse, favoritesResponse] = await Promise.all([
        usersAPI.getCurrentUserProfile(),
        favoritesAPI.getUserFavorites(1, 10).catch(() => null), // Don't fail if favorites unavailable
      ]);

      setProfile(profileResponse.data);
      
      if (favoritesResponse) {
        setFavorites(favoritesResponse.data);
      }

    } catch (err: any) {
      console.error('Error loading profile:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your profile');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleProfileUpdate = useCallback((updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  }, []);

  const renderProfileStats = () => {
    if (!profile) return null;

    const stats = [
      {
        icon: <RateReview color="primary" />,
        label: 'Reviews Written',
        value: profile.stats.total_reviews,
        sublabel: `${profile.stats.reviews_this_month} this month`,
      },
      {
        icon: <Star sx={{ color: 'orange' }} />,
        label: 'Average Rating',
        value: profile.stats.average_rating_given 
          ? profile.stats.average_rating_given.toFixed(1) 
          : 'N/A',
        sublabel: profile.stats.average_rating_given ? 'stars given' : 'No ratings yet',
      },
      {
        icon: <Favorite color="error" />,
        label: 'Favorite Books',
        value: profile.stats.total_favorites,
        sublabel: 'books marked',
      },
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.primary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.sublabel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderProfileInfo = () => {
    if (!profile) return null;

    return (
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                {profile.name}
              </Typography>
              
              <Chip
                icon={<Person />}
                label={profile.is_verified ? 'Verified' : 'Member'}
                color={profile.is_verified ? 'success' : 'default'}
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              {profile.email}
            </Typography>

            {profile.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {profile.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {profile.location}
                  </Typography>
                </Box>
              )}

              {profile.website && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Language fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    component="a"
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    Website
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Joined {formatDate(profile.created_at)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
            sx={{ ml: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderFavorites = () => {
    if (!favorites || favorites.favorites.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No favorite books yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start adding books to your favorites to see them here.
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {favorites.favorites.map((favorite) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={favorite.id}>
            <Box sx={{ position: 'relative' }}>
              <BookCard book={favorite.book} />
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <FavoriteButton
                  bookId={favorite.book.id}
                  bookTitle={favorite.book.title}
                  size="small"
                  onFavoriteChange={(isFavorite) => {
                    if (!isFavorite) {
                      // Remove from local state
                      setFavorites(prev => prev ? {
                        ...prev,
                        favorites: prev.favorites.filter(f => f.id !== favorite.id),
                        total: prev.total - 1,
                      } : null);
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Profile not found.
        </Alert>
      </Container>
    );
  }

  if (isEditing) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <ProfileForm
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        {renderProfileInfo()}
        {renderProfileStats()}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="fullWidth"
          >
            <Tab icon={<RateReview />} label="My Reviews" />
            <Tab icon={<Favorite />} label="Favorite Books" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <ReviewList
              bookId={0} // Not used for user reviews
              mode="user"
              showCreateButton={false}
              showBookTitles={true}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {renderFavorites()}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 