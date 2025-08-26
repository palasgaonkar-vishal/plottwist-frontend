import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: (() => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 INIT DEBUG - Loading accessToken from localStorage:', !!token);
      console.log('🔍 INIT DEBUG - Token length:', token ? token.length : 0);
      return token;
    } catch (error) {
      console.warn('🔍 INIT DEBUG - localStorage not available during initialization:', error);
      return null;
    }
  })(),
  refreshToken: (() => {
    try {
      const token = localStorage.getItem('refreshToken');
      console.log('🔍 INIT DEBUG - Loading refreshToken from localStorage:', !!token);
      return token;
    } catch (error) {
      console.warn('🔍 INIT DEBUG - localStorage not available during initialization:', error);
      return null;
    }
  })(),
  isLoading: false,
  error: null,
  // FIXED: Set authenticated to true if both tokens exist
  isAuthenticated: (() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const hasTokens = !!(accessToken && refreshToken);
      console.log('🔍 INIT DEBUG - Setting initial isAuthenticated:', hasTokens);
      return hasTokens;
    } catch (error) {
      console.warn('🔍 INIT DEBUG - localStorage not available for auth check:', error);
      return false;
    }
  })(),
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authAPI.refresh({ refresh_token: refreshToken });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        await authAPI.logout({ refresh_token: refreshToken });
      }
    } catch (error: any) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    }
    return null;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      let token = state.auth.accessToken;
      
      // FIXED: Fallback to localStorage if Redux state doesn't have token
      if (!token) {
        token = localStorage.getItem('accessToken');
        console.log('🔄 GET_USER DEBUG - Using localStorage token as fallback:', !!token);
      }
      
      if (!token) {
        throw new Error('No access token available');
      }
      
      const response = await authAPI.getCurrentUser();
      console.log('✅ GET_USER DEBUG - User data retrieved:', !!response.data);
      
      // FIXED: Return token along with user data for proper state sync
      return {
        user: response.data,
        accessToken: token,
        refreshToken: localStorage.getItem('refreshToken')
      };
    } catch (error: any) {
      console.log('❌ GET_USER DEBUG - Failed to get current user:', error.response?.data?.detail || error.message);
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      console.log('🚪 LOGOUT DEBUG - Clearing authentication state and tokens');
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('✅ LOGOUT DEBUG - Tokens cleared from localStorage');
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('🔍 LOGIN DEBUG - Received tokens:', {
          access_token: !!action.payload.access_token,
          refresh_token: !!action.payload.refresh_token,
          user: !!action.payload.user
        });
        
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', action.payload.access_token);
        localStorage.setItem('refreshToken', action.payload.refresh_token);
        
        console.log('✅ LOGIN DEBUG - Tokens stored in localStorage');
        console.log('🔍 LOGIN DEBUG - Verify storage:', {
          storedAccessToken: !!localStorage.getItem('accessToken'),
          storedRefreshToken: !!localStorage.getItem('refreshToken')
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('🔍 REGISTER DEBUG - Registration successful, storing tokens:', {
          access_token: !!action.payload.access_token,
          refresh_token: !!action.payload.refresh_token,
          user: !!action.payload.user
        });
        
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', action.payload.access_token);
        localStorage.setItem('refreshToken', action.payload.refresh_token);
        
        console.log('✅ REGISTER DEBUG - Tokens stored in localStorage');
        console.log('🔍 REGISTER DEBUG - User is now authenticated:', true);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        localStorage.setItem('accessToken', action.payload.access_token);
        localStorage.setItem('refreshToken', action.payload.refresh_token);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log('✅ GET_USER DEBUG - Successfully validated user:', !!action.payload.user);
        state.isLoading = false;
        state.user = action.payload.user;
        
        // FIXED: Sync tokens in Redux state if they were loaded from localStorage
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
          console.log('🔄 GET_USER DEBUG - Synced accessToken to Redux state');
        }
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
          console.log('🔄 GET_USER DEBUG - Synced refreshToken to Redux state');
        }
        
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.log('❌ GET_USER DEBUG - Token validation failed, clearing tokens:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        // Clear auth state if token is invalid/expired
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('🧹 GET_USER DEBUG - Tokens cleared due to validation failure');
      });
  },
});

export const { clearError, logout, setTokens } = authSlice.actions;
export default authSlice.reducer; 