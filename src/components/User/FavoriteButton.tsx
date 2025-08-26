import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { favoritesAPI } from '../../services/api';

interface FavoriteButtonProps {
  bookId: number;
  bookTitle?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary';
  showTooltip?: boolean;
  className?: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  bookId,
  bookTitle,
  size = 'medium',
  color = 'primary',
  showTooltip = true,
  className,
  onFavoriteChange,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Load initial favorite status
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!isAuthenticated) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await favoritesAPI.checkFavoriteStatus(bookId);
        setIsFavorite(response.data.is_favorite);
      } catch (error) {
        console.error('Error loading favorite status:', error);
        setIsFavorite(false);
      }
    };

    loadFavoriteStatus();
  }, [bookId, isAuthenticated]);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      setMessage('Please log in to add favorites');
      setMessageType('error');
      setShowMessage(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await favoritesAPI.toggleFavorite(bookId);
      const newFavoriteStatus = response.data.is_favorite;
      
      setIsFavorite(newFavoriteStatus);
      setMessage(response.data.message);
      setMessageType('success');
      setShowMessage(true);

      // Notify parent component
      if (onFavoriteChange) {
        onFavoriteChange(newFavoriteStatus);
      }

    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      let errorMessage = 'Failed to update favorite status';
      if (error.response?.status === 404) {
        errorMessage = 'Book not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to add favorites';
      }

      setMessage(errorMessage);
      setMessageType('error');
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  }, [bookId, isAuthenticated, onFavoriteChange]);

  const getTooltipText = (): string => {
    if (!isAuthenticated) {
      return 'Log in to add favorites';
    }
    
    if (isFavorite) {
      return `Remove ${bookTitle ? `"${bookTitle}"` : 'this book'} from favorites`;
    }
    
    return `Add ${bookTitle ? `"${bookTitle}"` : 'this book'} to favorites`;
  };

  const renderButton = () => (
    <IconButton
      onClick={handleToggleFavorite}
      disabled={isLoading}
      size={size}
      color={color}
      className={className}
      aria-label={getTooltipText()}
      sx={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
        '&:disabled': {
          opacity: 0.6,
        },
      }}
    >
      {isLoading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} />
      ) : isFavorite ? (
        <Favorite
          sx={{
            color: 'error.main',
            filter: 'drop-shadow(0 0 2px rgba(244, 67, 54, 0.3))',
          }}
        />
      ) : (
        <FavoriteBorder />
      )}
    </IconButton>
  );

  return (
    <>
      {showTooltip ? (
        <Tooltip title={getTooltipText()} arrow>
          {renderButton()}
        </Tooltip>
      ) : (
        renderButton()
      )}

      <Snackbar
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={messageType} 
          onClose={() => setShowMessage(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavoriteButton; 