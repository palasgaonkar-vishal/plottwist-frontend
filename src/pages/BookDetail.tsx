import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Rating,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  Star,
  CalendarToday,
  Book as BookIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../types/book';
import { booksAPI } from '../services/api';
import BookCover from '../components/Books/BookCover';
import BreadcrumbsNav from '../components/Breadcrumbs';
import ReviewList from '../components/Reviews/ReviewList';
import { useAppSelector } from '../store/hooks';
import { BookRatingStats } from '../types/review';
import { reviewsAPI } from '../services/api';
import StarRating from '../components/Reviews/StarRating';
import { favoritesAPI } from '../services/api';

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [book, setBook] = useState<Book | null>(null);
  const [ratingStats, setRatingStats] = useState<BookRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Load book details and favorite status
  useEffect(() => {
    const loadBookDetails = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        setError('');

        const response = await booksAPI.getBook(Number(bookId));
        setBook(response.data);

        // Load rating statistics
        try {
          const statsResponse = await reviewsAPI.getBookRatingStats(Number(bookId));
          setRatingStats(statsResponse.data);
        } catch (statsError) {
          console.error('Error loading rating stats:', statsError);
          // Don't fail the whole page if stats unavailable
        }

        // Load favorite status if user is authenticated
        if (isAuthenticated) {
          try {
            const favoriteResponse = await favoritesAPI.checkFavoriteStatus(Number(bookId));
            setIsFavorite(favoriteResponse.data.is_favorite);
            console.log('📖 Initial favorite status:', favoriteResponse.data.is_favorite);
          } catch (favError) {
            console.error('Error loading favorite status:', favError);
            setIsFavorite(false);
          }
        } else {
          setIsFavorite(false);
        }

      } catch (err: any) {
        console.error('Error loading book details:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBookDetails();
  }, [bookId, isAuthenticated]); // Added isAuthenticated to dependencies

  const handleBack = () => {
    navigate('/books');
  };

  const handleShare = () => {
    if (navigator.share && book) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot toggle favorite');
      return;
    }

    try {
      console.log('🔄 Toggling favorite for book:', bookId);
      const response = await favoritesAPI.toggleFavorite(Number(bookId));
      console.log('✅ Toggle favorite response:', response.data);
      
      setIsFavorite(response.data.is_favorite);
      
      // Optional: Show success message
      console.log(response.data.message);
      
    } catch (error: any) {
      console.error('❌ Error toggling favorite:', error);
      
      let errorMessage = 'Failed to update favorite status';
      if (error.response?.status === 404) {
        errorMessage = 'Book not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to add favorites';
      }
      
      console.error(errorMessage);
      // Optional: Show error message to user
    }
  };

  const formatPublishedYear = (year?: number) => {
    return year ? year.toString() : 'Unknown';
  };

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) return 'full';
      if (i === fullStars && hasHalfStar) return 'half';
      return 'empty';
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Books
          </Button>
          
          <Alert 
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Books
          </Button>
          
          <Alert severity="warning">
            Book not found.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <BreadcrumbsNav />
        
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          Back to Books
        </Button>

        {/* Main Content */}
        <Paper sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
              gap: 4,
            }}
          >
            {/* Left Column - Book Cover */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <BookCover
                coverUrl={book.cover_url}
                title={book.title}
                author={book.author}
                width={250}
                height={350}
              />
            </Box>

            {/* Right Column - Book Details */}
            <Box>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Title and Author */}
                <Typography variant="h3" component="h1" gutterBottom color="primary">
                  {book.title}
                </Typography>
                
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>

                {/* Rating and Reviews */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {ratingStats && ratingStats.total_reviews > 0 ? (
                    <>
                      <StarRating
                        value={ratingStats.average_rating || 0}
                        readOnly
                        size="medium"
                        showValue={true}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        ({ratingStats.total_reviews} review{ratingStats.total_reviews !== 1 ? 's' : ''})
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews yet
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleFavoriteToggle}
                    variant={isFavorite ? 'contained' : 'outlined'}
                    color="secondary"
                  >
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    startIcon={<Share />}
                    onClick={handleShare}
                    variant="outlined"
                  >
                    Share
                  </Button>
                </Box>

                {/* Genres */}
                {book.genres.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Genres
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {book.genres.map((genre) => (
                        <Chip
                          key={genre.id}
                          label={genre.name}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Book Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        Published: {formatPublishedYear(book.published_year)}
                      </Typography>
                    </Box>
                    
                    {book.isbn && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          ISBN: {book.isbn}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                {book.description && (
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {book.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Reviews Section */}
        <Paper sx={{ p: 4, mt: 4 }}>
          <ReviewList
            bookId={book.id}
            bookTitle={book.title}
            showCreateButton={true}
            mode="book"
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default BookDetail; 