import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useAppSelector } from '../store/hooks';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          👤 My Profile
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings and preferences
        </Typography>
        
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Account Information
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {user?.name || 'Loading...'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Email:</strong> {user?.email || 'Loading...'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Verified:</strong> {user?.is_verified ? 'Yes' : 'No'}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Profile Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Full profile editing functionality will be available in upcoming features.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 