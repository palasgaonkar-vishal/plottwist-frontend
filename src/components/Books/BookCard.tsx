import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Rating,
  Button,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import { Visibility, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book, ViewMode } from '../../types/book';
import BookCover from './BookCover';
import FavoriteButton from '../User/FavoriteButton'; // ADDED: Import FavoriteButton

interface BookCardProps {
  book: Book;
  viewMode?: ViewMode;
  onViewDetails?: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  viewMode = ViewMode.GRID,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(book.id);
    } else {
      navigate(`/books/${book.id}`);
    }
  };

  const formatYear = (year?: number) => {
    return year ? `(${year})` : '';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (viewMode === ViewMode.LIST) {
    return (
      <Card
        sx={{
          display: 'flex',
          mb: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, position: 'relative' }}>
          <BookCover
            coverUrl={book.cover_url}
            title={book.title}
            author={book.author}
            width={80}
            height={120}
          />
          {/* Favorite Button Overlay for List View */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <FavoriteButton
              bookId={book.id}
              bookTitle={book.title}
              size="small"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={handleViewDetails}
            >
              {book.title}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              by {book.author} {formatYear(book.published_year)}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={book.average_rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {book.average_rating.toFixed(1)} ({book.total_reviews} reviews)
              </Typography>
            </Box>
            
            {book.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {truncateText(book.description, 200)}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {book.genres.slice(0, 3).map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {book.genres.length > 3 && (
                <Chip
                  label={`+${book.genres.length - 3}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
          </CardContent>
          
          <CardActions sx={{ pt: 0 }}>
            <Button
              startIcon={<Visibility />}
              onClick={handleViewDetails}
              variant="contained"
              size="small"
            >
              View Details
            </Button>
          </CardActions>
        </Box>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <BookCover
          coverUrl={book.cover_url}
          title={book.title}
          author={book.author}
          width={140}
          height={200}
          sx={{ cursor: 'pointer' }}
        />
        {/* Favorite Button Overlay */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <FavoriteButton
            bookId={book.id}
            bookTitle={book.title}
            size="small"
          />
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Tooltip title={book.title} placement="top">
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={handleViewDetails}
          >
            {book.title}
          </Typography>
        </Tooltip>
        
        <Typography
          variant="subtitle2"
          color="text.secondary"
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.author} {formatYear(book.published_year)}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Rating value={book.average_rating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {book.average_rating.toFixed(1)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {book.genres.slice(0, 2).map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
          {book.genres.length > 2 && (
            <Chip
              label={`+${book.genres.length - 2}`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>
        
        {book.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {book.description}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ pt: 0 }}>
        <Button
          startIcon={<Info />}
          onClick={handleViewDetails}
          variant="outlined"
          size="small"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard; 