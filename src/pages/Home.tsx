import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const Home: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleTestBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/health');
      const data = await response.json();
      alert(`Backend Status: ${data.status}`);
    } catch (error) {
      alert('Backend connection failed');
    }
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        gap: 3
      }}>
        <Typography variant="h1" color="primary" gutterBottom>
          📚 PlotTwist
        </Typography>
        <Typography variant="h2" color="text.secondary" gutterBottom>
          Book Review Platform
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
          Discover your next favorite book with AI-powered recommendations, 
          connect with fellow readers, and share your thoughts through detailed reviews.
        </Typography>
        
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleGetStarted}
              size="large"
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleSignIn}
              size="large"
            >
              Sign In
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGoToDashboard}
            size="large"
          >
            Go to Dashboard
          </Button>
        )}

        <Button 
          variant="text" 
          color="secondary" 
          onClick={handleTestBackend}
          sx={{ mt: 2 }}
        >
          Test Backend Connection
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 