import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Favorites: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          ❤️ My Favorites
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your favorite books and authors
        </Typography>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Favorites Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start browsing books and add them to your favorites to see them here.
            The favorites system will be implemented in upcoming tasks.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Favorites; 