import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button } from '@mui/material';
import { green, yellow } from '@mui/material/colors';

// Custom theme with pastel greens and warm yellow accents
const theme = createTheme({
  palette: {
    primary: {
      main: green[300], // Pastel green
      light: green[100],
      dark: green[500],
    },
    secondary: {
      main: yellow[400], // Warm yellow accent
      light: yellow[200],
      dark: yellow[600],
    },
    background: {
      default: '#f8fdf8', // Very light green background
    },
  },
  typography: {
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

function App() {
  const handleTestBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/health');
      const data = await response.json();
      alert(`Backend Status: ${data.status}`);
    } catch (error) {
      alert('Backend connection failed');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3
        }}>
          <Typography variant="h1" color="primary" gutterBottom>
            📚 PlotTwist
          </Typography>
          <Typography variant="h2" color="text.secondary" gutterBottom>
            Book Review Platform
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover your next favorite book with AI-powered recommendations
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleTestBackend}
            size="large"
          >
            Test Backend Connection
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
