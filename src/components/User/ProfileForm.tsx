import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  LocationOn,
  Language,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { usersAPI } from '../../services/api';
import { UserUpdate, UserFormErrors, UserProfile } from '../../types/user';

interface ProfileFormProps {
  profile: UserProfile;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileUpdate,
  onCancel,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<UserUpdate>({
    name: profile.name,
    email: profile.email,
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when profile changes
  useEffect(() => {
    setFormData({
      name: profile.name,
      email: profile.email,
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
    });
    setErrors({});
  }, [profile]);

  const validateForm = useCallback((): boolean => {
    const newErrors: UserFormErrors = {};

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate bio length
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    // Validate location length
    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location cannot exceed 100 characters';
    }

    // Validate website length and format
    if (formData.website) {
      if (formData.website.length > 200) {
        newErrors.website = 'Website URL cannot exceed 200 characters';
      } else if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
        // Auto-prepend https:// if not present
        if (!formData.website.match(/^[a-zA-Z]+:\/\//)) {
          setFormData(prev => ({ ...prev, website: `https://${prev.website}` }));
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare update data (only include changed fields)
      const updateData: UserUpdate = {};
      
      if (formData.name !== profile.name) {
        updateData.name = formData.name?.trim();
      }
      if (formData.email !== profile.email) {
        updateData.email = formData.email;
      }
      if (formData.bio !== (profile.bio || '')) {
        updateData.bio = formData.bio?.trim() || undefined;
      }
      if (formData.location !== (profile.location || '')) {
        updateData.location = formData.location?.trim() || undefined;
      }
      if (formData.website !== (profile.website || '')) {
        updateData.website = formData.website?.trim() || undefined;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        setErrors({ general: 'No changes detected' });
        return;
      }

      const response = await usersAPI.updateProfile(updateData);
      
      // Fetch updated profile to get complete data
      const profileResponse = await usersAPI.getCurrentUserProfile();
      
      setShowSuccess(true);
      
      if (onProfileUpdate) {
        onProfileUpdate(profileResponse.data);
      }

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.status === 400) {
        if (error.response.data?.detail?.includes('Email already registered')) {
          errorMessage = 'This email address is already registered to another account.';
        } else {
          errorMessage = 'Invalid profile data. Please check your input and try again.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'You must be logged in to update your profile.';
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [formData, profile, validateForm, onProfileUpdate]);

  const handleCancel = useCallback(() => {
    // Reset form to original values
    setFormData({
      name: profile.name,
      email: profile.email,
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
    });
    setErrors({});
    
    if (onCancel) {
      onCancel();
    }
  }, [profile, onCancel]);

  const handleFieldChange = useCallback((field: keyof UserUpdate) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }, [errors]
  );

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
          <Edit />
        </Avatar>
        <Typography variant="h5" component="h2">
          Edit Profile
        </Typography>
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name || ''}
              onChange={handleFieldChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
              required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={handleFieldChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              required
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={formData.bio || ''}
              onChange={handleFieldChange('bio')}
              error={!!errors.bio}
              helperText={errors.bio || `${(formData.bio || '').length}/500 characters`}
              disabled={isLoading}
              placeholder="Tell others about yourself..."
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location || ''}
              onChange={handleFieldChange('location')}
              error={!!errors.location}
              helperText={errors.location}
              disabled={isLoading}
              placeholder="City, Country"
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website || ''}
              onChange={handleFieldChange('website')}
              error={!!errors.website}
              helperText={errors.website}
              disabled={isLoading}
              placeholder="https://your-website.com"
              InputProps={{
                startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProfileForm; 