import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  MenuBook,
  DarkMode,
  LightMode,
  AccountCircle,
  Logout,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { useThemeMode } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isDark, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleBooks = () => {
    navigate('/books');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleReviews = () => {
    navigate('/profile'); // Reviews are shown in Profile page under "My Reviews" tab
  };

  const handleRecommendations = () => {
    navigate('/recommendations');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleBrandClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <MenuBook sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            onClick={handleBrandClick}
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            PlotTwist
          </Typography>
        </Box>

        {/* Navigation Links */}
        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button 
              color="inherit" 
              onClick={handleDashboard}
              sx={{ textTransform: 'none' }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={handleBooks}
              sx={{ textTransform: 'none' }}
            >
              Books
            </Button>
            <Button 
              color="inherit" 
              onClick={handleFavorites}
              sx={{ textTransform: 'none' }}
            >
              Favorites
            </Button>
            <Button 
              color="inherit" 
              onClick={handleReviews}
              sx={{ textTransform: 'none' }}
            >
              Reviews
            </Button>
            <Button 
              color="inherit" 
              onClick={handleRecommendations}
              sx={{ textTransform: 'none' }}
            >
              Recommendations
            </Button>
          </Box>
        )}

        {!isAuthenticated && <Box sx={{ flexGrow: 1 }} />}

        {/* Theme Toggle */}
        <IconButton 
          color="inherit" 
          onClick={toggleTheme}
          sx={{ mr: 1 }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Authentication Section */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Welcome, {user?.name}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={handleLogin}
              sx={{ textTransform: 'none' }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={handleRegister}
              sx={{ 
                textTransform: 'none',
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
                  borderColor: 'secondary.light',
                  bgcolor: 'rgba(255, 193, 7, 0.04)',
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 