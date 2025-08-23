import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Books: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          📚 Browse Books
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover your next favorite read
        </Typography>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Coming Soon!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The book browsing and search functionality will be implemented in the next task.
            This will include advanced search, filtering, and pagination features.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Books; 