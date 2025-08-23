import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import {
  MenuBook,
  Favorite,
  RateReview,
  AutoAwesome,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'Explore our vast collection of books',
      icon: <MenuBook sx={{ fontSize: 48, color: 'primary.main' }} />,
      link: '/books',
      color: 'primary.light',
    },
    {
      title: 'My Favorites',
      description: 'View your favorite books and authors',
      icon: <Favorite sx={{ fontSize: 48, color: 'error.main' }} />,
      link: '/favorites',
      color: 'error.light',
    },
    {
      title: 'Write Review',
      description: 'Share your thoughts on books you\'ve read',
      icon: <RateReview sx={{ fontSize: 48, color: 'secondary.main' }} />,
      link: '/books',
      color: 'secondary.light',
    },
    {
      title: 'Get Recommendations',
      description: 'Discover books tailored to your taste',
      icon: <AutoAwesome sx={{ fontSize: 48, color: 'success.main' }} />,
      link: '/recommendations',
      color: 'success.light',
    },
  ];

  return (
    <Container maxWidth="lg">      
      <Box sx={{ mb: 4, pt: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome back, {user?.name}! 📚
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to discover your next great read?
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          Your Reading Journey
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Books Read
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h4" color="secondary">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews Written
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h4" color="error">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorites
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h4" color="success">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pages Read
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 6
      }}>
        {quickActions.map((action, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: action.color,
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  opacity: 0.1,
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </Box>
              </Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {action.description}
              </Typography>
              <Button
                component={Link}
                to={action.link}
                variant="outlined"
                size="small"
                fullWidth
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Recent Activity (Placeholder) */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No recent activity yet. Start by browsing books or writing your first review!
          </Typography>
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/books"
              variant="contained"
              color="primary"
            >
              Browse Books
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 