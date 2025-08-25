import React, { useState } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { MenuBook } from '@mui/icons-material';

interface BookCoverProps {
  coverUrl?: string;
  title: string;
  author: string;
  width?: number | string;
  height?: number | string;
  sx?: SxProps<Theme>;
}

const BookCover: React.FC<BookCoverProps> = ({
  coverUrl,
  title,
  author,
  width = 150,
  height = 200,
  sx = {},
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const showFallback = !coverUrl || imageError;

  return (
    <Box
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: showFallback ? 'grey.100' : 'transparent',
        border: showFallback ? '1px solid' : 'none',
        borderColor: 'grey.300',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
    >
      {!showFallback && (
        <>
          {imageLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                zIndex: 1,
              }}
            >
              <MenuBook sx={{ fontSize: 48, color: 'grey.400' }} />
            </Box>
          )}
          <img
            src={coverUrl}
            alt={`Cover of ${title} by ${author}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoading ? 'none' : 'block',
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      )}

      {showFallback && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 2,
            height: '100%',
          }}
        >
          <MenuBook sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.2,
              color: 'grey.600',
              fontWeight: 'medium',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              lineHeight: 1.1,
              color: 'grey.500',
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {author}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BookCover; 