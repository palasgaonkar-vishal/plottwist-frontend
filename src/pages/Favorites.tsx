import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Pagination,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Star,
  StarBorder,
  Favorite,
  MenuBook,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { favoritesAPI } from '../services/api';
import { UserFavoritesResponse, Favorite as FavoriteType } from '../types/favorite';
import BookCover from '../components/Books/BookCover';
import FavoriteButton from '../components/User/FavoriteButton';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [favorites, setFavorites] = useState<UserFavoritesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const loadFavorites = useCallback(async (page: number = 1) => {
    if (!isAuthenticated) {
      setError('Please log in to view your favorites');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔍 Loading favorites for page:', page);
      
      const response = await favoritesAPI.getUserFavorites(page, itemsPerPage);
      console.log('✅ Favorites loaded:', response.data);
      setFavorites(response.data);
      
    } catch (err: any) {
      console.error('❌ Error loading favorites:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view your favorites');
      } else {
        setError('Failed to load favorites. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites(currentPage);
  }, [loadFavorites, currentPage]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFavoriteRemoved = useCallback((bookId: number) => {
    // Remove the book from the current favorites list
    if (favorites) {
      const updatedFavorites = favorites.favorites.filter(fav => fav.book.id !== bookId);
      setFavorites({
        ...favorites,
        favorites: updatedFavorites,
        total: favorites.total - 1,
      });
    }
  }, [favorites]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box key={i} component="span" sx={{ color: i <= rating ? '#ffc107' : '#e0e0e0' }}>
          {i <= rating ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
        </Box>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Please log in to view your favorite books.
        </Alert>
      </Container>
    );
  }

  if (loading && !favorites) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorite Books
        </Typography>
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => loadFavorites(currentPage)}>
          Try Again
        </Button>
      </Container>
    );
  }

  const totalPages = favorites ? Math.ceil(favorites.total / itemsPerPage) : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorite Books
        </Typography>
        {favorites && (
          <Typography variant="body1" color="text.secondary">
            {favorites.total} book{favorites.total !== 1 ? 's' : ''} in your favorites
          </Typography>
        )}
      </Box>

      {/* Empty State */}
      {favorites && favorites.total === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <MenuBook sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No favorite books yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start exploring books and add them to your favorites!
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/books')}
            startIcon={<Visibility />}
          >
            Browse Books
          </Button>
        </Box>
      )}

      {/* Favorites Grid */}
      {favorites && favorites.favorites.length > 0 && (
        <>
          <Grid container spacing={3}>
            {favorites.favorites.map((favorite: FavoriteType) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={favorite.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  {/* Book Cover */}
                  <Box sx={{ position: 'relative' }}>
                    <BookCover
                      coverUrl={favorite.book.cover_url}
                      title={favorite.book.title}
                      author={favorite.book.author}
                      height={200}
                    />
                    
                    {/* Favorite Button */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <FavoriteButton
                        bookId={favorite.book.id}
                        bookTitle={favorite.book.title}
                        onFavoriteChange={(isFavorite) => {
                          if (!isFavorite) {
                            handleFavoriteRemoved(favorite.book.id);
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Book Info */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {favorite.book.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      by {favorite.book.author}
                    </Typography>

                    {/* Rating */}
                    {favorite.book.average_rating > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {renderStars(Math.round(favorite.book.average_rating))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {favorite.book.average_rating.toFixed(1)}
                        </Typography>
                      </Box>
                    )}

                    {/* Genres */}
                    {favorite.book.genres && favorite.book.genres.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        {favorite.book.genres.slice(0, 2).map((genre) => (
                          <Chip
                            key={genre.id}
                            label={genre.name}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                        {favorite.book.genres.length > 2 && (
                          <Chip
                            label={`+${favorite.book.genres.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )}
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Added {formatDate(favorite.created_at)}
                    </Typography>
                  </CardContent>

                  {/* Actions */}
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/books/${favorite.book.id}`)}
                      startIcon={<Visibility />}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Loading Indicator */}
      {loading && favorites && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage; 