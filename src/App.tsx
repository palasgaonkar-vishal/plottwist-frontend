import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { store } from './store';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Header from './components/Navigation/Header';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize user data if authenticated
    if (isAuthenticated && accessToken) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, accessToken]);

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        {/* Main content with top margin to account for fixed header */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 7, sm: 8 }, // Padding top to account for AppBar height
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            
            {/* Authentication routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            {/* Redirect /home to / */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <CssBaseline />
        <AppContent />
      </CustomThemeProvider>
    </Provider>
  );
}

export default App;
