import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { store } from './store';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';
import { fixDockerEvents, startEventFixObserver } from './utils/eventFixer';
import './App.css';

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
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // FIXED: Use Redux state token instead of localStorage directly
      console.log('🔍 AUTH DEBUG - Redux accessToken:', !!accessToken);
      console.log('🔍 AUTH DEBUG - localStorage token:', !!localStorage.getItem('accessToken'));
      console.log('🔍 AUTH DEBUG - isAuthenticated:', isAuthenticated);
      console.log('🔍 AUTH DEBUG - isLoading:', isLoading);
      
      // Use the token from Redux state (which loads from localStorage in initialState)
      if (!accessToken) {
        console.log('🔑 No token found, user needs to login');
        return;
      }

      if (isAuthenticated) {
        console.log('🔑 User already authenticated');
        return;
      }

      if (isLoading) {
        console.log('🔑 Authentication in progress, waiting...');
        return;
      }

      console.log('🔑 Validating stored token...');
      
      try {
        const result = await dispatch(getCurrentUser()).unwrap();
        console.log('✅ Token validation successful:', result.email || result.name);
      } catch (error: any) {
        console.warn('❌ Token validation failed:', error);
        
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Force redirect to login if on protected route
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          console.log('🔄 Redirecting to login due to invalid token');
          window.location.href = '/login';
        }
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, isLoading, accessToken]); // FIXED: Added accessToken back as dependency

  useEffect(() => {
    // Fix Docker interaction issues
    fixDockerEvents();
    const observer = startEventFixObserver();
    
    return () => {
      observer.disconnect();
    };
  }, []);

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
              path="/books/:bookId"
              element={
                <ProtectedRoute>
                  <BookDetail />
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
