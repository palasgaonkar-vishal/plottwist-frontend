import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext, Home } from '@mui/icons-material';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // Split pathname into segments and filter empty ones
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Define readable names for routes
  const routeNames: { [key: string]: string } = {
    dashboard: 'Dashboard',
    books: 'Books',
    favorites: 'Favorites',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    reviews: 'Reviews',
    recommendations: 'Recommendations',
  };

  // Don't show breadcrumbs on home page or if only one segment
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MUIBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {/* Home breadcrumb */}
        <Link
          component={RouterLink}
          to="/dashboard"
          color="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>

        {/* Dynamic breadcrumbs for path segments */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = routeNames[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <Typography color="text.primary" key={to}>
              {displayName}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              color="inherit"
              key={to}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 