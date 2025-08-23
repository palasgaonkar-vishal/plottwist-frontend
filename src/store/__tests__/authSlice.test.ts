import authReducer, {
  clearError,
  logout,
  setTokens,
  loginUser,
  registerUser,
} from '../slices/authSlice';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('authSlice', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const previousState = { ...initialState, error: 'Some error' };
    expect(authReducer(previousState, clearError())).toEqual({
      ...previousState,
      error: null,
    });
  });

  test('should handle logout', () => {
    const previousState = {
      ...initialState,
      user: { id: 1, email: 'test@example.com', name: 'Test User', is_active: true, is_verified: true },
      accessToken: 'token123',
      refreshToken: 'refresh123',
      isAuthenticated: true,
    };
    
    expect(authReducer(previousState, logout())).toEqual(initialState);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  test('should handle setTokens', () => {
    const tokens = { accessToken: 'newToken', refreshToken: 'newRefresh' };
    expect(authReducer(initialState, setTokens(tokens))).toEqual({
      ...initialState,
      accessToken: 'newToken',
      refreshToken: 'newRefresh',
      isAuthenticated: true,
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'newToken');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'newRefresh');
  });

  test('should handle loginUser.pending', () => {
    expect(authReducer(initialState, loginUser.pending('', { email: '', password: '' }))).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    });
  });

  test('should handle loginUser.fulfilled', () => {
    const payload = {
      user: { id: 1, email: 'test@example.com', name: 'Test User', is_active: true, is_verified: true },
      access_token: 'token123',
      refresh_token: 'refresh123',
    };

    expect(authReducer(initialState, loginUser.fulfilled(payload, '', { email: '', password: '' }))).toEqual({
      ...initialState,
      isLoading: false,
      user: payload.user,
      accessToken: 'token123',
      refreshToken: 'refresh123',
      isAuthenticated: true,
    });
  });

  test('should handle loginUser.rejected', () => {
    const errorMessage = 'Invalid credentials';
    expect(authReducer(initialState, loginUser.rejected(null, '', { email: '', password: '' }, errorMessage))).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage,
      isAuthenticated: false,
    });
  });

  test('should handle registerUser.pending', () => {
    expect(authReducer(initialState, registerUser.pending('', { name: '', email: '', password: '' }))).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    });
  });

  test('should handle registerUser.fulfilled', () => {
    const payload = {
      user: { id: 1, email: 'test@example.com', name: 'Test User', is_active: true, is_verified: true },
      access_token: 'token123',
      refresh_token: 'refresh123',
    };

    expect(authReducer(initialState, registerUser.fulfilled(payload, '', { name: '', email: '', password: '' }))).toEqual({
      ...initialState,
      isLoading: false,
      user: payload.user,
      accessToken: 'token123',
      refreshToken: 'refresh123',
      isAuthenticated: true,
    });
  });

  test('should handle registerUser.rejected', () => {
    const errorMessage = 'Email already exists';
    expect(authReducer(initialState, registerUser.rejected(null, '', { name: '', email: '', password: '' }, errorMessage))).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage,
      isAuthenticated: false,
    });
  });
}); 