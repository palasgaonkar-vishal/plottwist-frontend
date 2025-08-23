import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Register from '../../pages/Register';
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

describe('Register Component', () => {
  test('renders registration form', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByText('Join PlotTwist')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
  });

  test('displays validation error for short name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(nameInput, 'A');
    await user.click(submitButton);
    
    expect(screen.getByText('Name must be at least 2 characters long')).toBeInTheDocument();
  });

  test('displays validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('displays validation error for weak password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(passwordInput, 'weakpass');
    await user.click(submitButton);
    
    expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
  });

  test('displays validation error for mismatched passwords', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password456');
    await user.click(submitButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('displays loading state during registration', () => {
    const store = createTestStore({ isLoading: true });
    renderWithProviders(<Register />, store);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays server error message', () => {
    const store = createTestStore({ error: 'Email already exists' });
    renderWithProviders(<Register />, store);
    
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  test('has link to login page', () => {
    renderWithProviders(<Register />);
    
    const loginLink = screen.getByRole('link', { name: /already have an account\? sign in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 