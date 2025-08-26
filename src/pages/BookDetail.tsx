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

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [book, setBook] = useState<Book | null>(null);
  const [ratingStats, setRatingStats] = useState<BookRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookId) {
        setError('Invalid book ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Load book details and rating statistics in parallel
        const [bookResponse, statsResponse] = await Promise.all([
          booksAPI.getBook(parseInt(bookId)),
          reviewsAPI.getBookRatingStats(parseInt(bookId)).catch(() => null) // Don't fail if stats unavailable
        ]);

        setBook(bookResponse.data);
        
        if (statsResponse) {
          setRatingStats(statsResponse.data);
        }

        // TODO: Load favorite status when favorites system is implemented
        // setIsFavorite(false);

      } catch (err: any) {
        console.error('Error loading book:', err);
        
        if (err.response?.status === 404) {
          setError('Book not found');
        } else {
          setError('Failed to load book details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [bookId]);

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

  const handleFavoriteToggle = () => {
    // TODO: Implement favorite functionality
    setIsFavorite(!isFavorite);
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