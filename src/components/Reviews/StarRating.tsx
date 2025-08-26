import React, { useState, useCallback } from 'react';
import { Box, Rating, Typography, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  precision?: number;
  label?: string;
  error?: boolean;
  helperText?: string;
  max?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  showValue = true,
  precision = 1,
  label,
  error = false,
  helperText,
  max = 5,
  className,
}) => {
  const [hover, setHover] = useState<number>(-1);

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number | null) => {
    if (onChange && newValue !== null) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleMouseEnter = useCallback((event: React.SyntheticEvent, newHover: number) => {
    if (!readOnly) {
      setHover(newHover);
    }
  }, [readOnly]);

  const handleMouseLeave = useCallback(() => {
    if (!readOnly) {
      setHover(-1);
    }
  }, [readOnly]);

  const getLabelText = (value: number): string => {
    const labels: { [key: number]: string } = {
      1: 'Useless',
      2: 'Poor',
      3: 'Ok',
      4: 'Good',
      5: 'Excellent',
    };
    return labels[value] || '';
  };

  const formatRating = (rating: number): string => {
    if (precision < 1) {
      return rating.toFixed(1);
    }
    return Math.round(rating).toString();
  };

  return (
    <Box className={className}>
      {label && (
        <Typography
          component="legend"
          variant="body2"
          sx={{
            mb: 1,
            color: error ? 'error.main' : 'text.primary',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Rating
          name="star-rating"
          value={value}
          onChange={handleChange}
          onChangeActive={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          readOnly={readOnly}
          precision={precision}
          max={max}
          size={size}
          icon={<Star fontSize="inherit" />}
          emptyIcon={<StarBorder fontSize="inherit" />}
          getLabelText={getLabelText}
          sx={{
            color: error ? 'error.main' : 'primary.main',
            '& .MuiRating-iconFilled': {
              color: error ? 'error.main' : 'warning.main',
            },
            '& .MuiRating-iconHover': {
              color: 'warning.dark',
            },
            '& .MuiRating-iconEmpty': {
              color: error ? 'error.light' : 'grey.400',
            },
          }}
        />
        
        {showValue && value > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: error ? 'error.main' : 'text.secondary',
              minWidth: size === 'small' ? '3ch' : '4ch',
            }}
          >
            {formatRating(value)}
            {!readOnly && hover > 0 && hover !== value && (
              <span style={{ opacity: 0.7 }}>
                {' → ' + formatRating(hover)}
              </span>
            )}
          </Typography>
        )}
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            color: error ? 'error.main' : 'text.secondary',
            display: 'block',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default StarRating; 