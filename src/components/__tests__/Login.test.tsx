import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/Login';
import authReducer from '../../store/slices/authSlice';
import { CustomThemeProvider } from '../../contexts/ThemeContext';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CustomThemeProvider>
          {component}
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('displays validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('displays validation error for short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
  });

  test('clears field errors when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Trigger validation error
    await user.click(submitButton);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    // Start typing to clear error
    await user.type(emailInput, 'test');
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  test('displays loading state during login', () => {
    const store = createTestStore({ isLoading: true });
    renderWithProviders(<Login />, store);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays server error message', () => {
    const store = createTestStore({ error: 'Invalid credentials' });
    renderWithProviders(<Login />, store);
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('has link to register page', () => {
    renderWithProviders(<Login />);
    
    const registerLink = screen.getByText(/don't have an account\? sign up/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
}); 