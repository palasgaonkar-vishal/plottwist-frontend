# PlotTwist Frontend

A modern React frontend for the PlotTwist book review platform, built with TypeScript, Material-UI, Redux Toolkit, and React Router.

## 🚀 Features Implemented

### ✅ Task 001-003 (Completed)
- Project setup with TypeScript and Material-UI
- Custom theme with pastel greens and warm yellow accents
- Development environment configuration

### ✅ Task 004: Frontend Authentication and Routing (Completed)
- **Complete React Router Setup**: Protected and public routes with proper navigation
- **Redux Toolkit State Management**: Comprehensive authentication state with persistent sessions
- **Material-UI Custom Theme**: Light and dark mode support with beautiful pastel design
- **Authentication Components**: Login and Registration forms with advanced validation
- **Navigation System**: Header with authentication state and dynamic navigation
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Form Validation**: Real-time inline validation with user-friendly error messages
- **JWT Token Management**: Automatic token refresh and API request interceptors

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Navigation/
│   │   └── Header.tsx           # Main navigation with auth state
│   ├── Breadcrumbs.tsx          # Dynamic breadcrumb navigation
│   ├── ProtectedRoute.tsx       # Route guard for authenticated users
│   └── PublicRoute.tsx          # Route guard for public pages
├── pages/
│   ├── Home.tsx                 # Landing page with call-to-action
│   ├── Login.tsx                # Login form with validation
│   ├── Register.tsx             # Registration form with validation
│   ├── Dashboard.tsx            # User dashboard (authenticated)
│   ├── Books.tsx                # Books listing (placeholder)
│   ├── Profile.tsx              # User profile management
│   ├── Favorites.tsx            # User favorites (placeholder)
│   └── NotFound.tsx             # 404 error page
├── store/
│   ├── index.ts                 # Redux store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   └── slices/
│       └── authSlice.ts         # Authentication state management
├── services/
│   └── api.ts                   # Axios configuration with interceptors
├── contexts/
│   └── ThemeContext.tsx         # Theme switching context
└── theme/
    └── theme.ts                 # Material-UI custom theme
```

### State Management
- **Redux Toolkit**: Modern Redux with RTK Query for API calls
- **Authentication State**: User info, tokens, loading states, and error handling
- **Theme State**: Light/dark mode persistence with localStorage
- **Form State**: Local component state with validation logic

### API Integration
- **Axios Interceptors**: Automatic JWT token injection and refresh
- **Error Handling**: Comprehensive error handling with user feedback
- **Token Refresh**: Seamless background token renewal
- **Backend Integration**: Full integration with FastAPI backend

## 🎨 Design System

### Theme
- **Primary Colors**: Pastel green (`#7cc57c`) for main actions
- **Secondary Colors**: Warm yellow (`#ffc107`) for accents
- **Typography**: Inter font family with consistent hierarchy
- **Components**: Consistent button styles, form controls, and cards
- **Dark Mode**: Fully supported dark theme with proper contrast

### Form Design
- **Validation**: Real-time validation with clear error messages
- **UX**: Loading states, disabled states, and success feedback
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation

## 🔐 Authentication Features

### Login Form
- Email and password validation
- Real-time error clearing
- Loading states with progress indicators
- Server error handling
- Automatic redirect after success

### Registration Form
- Name, email, and password validation
- Password strength requirements
- Confirm password matching
- Comprehensive error handling
- Account creation with auto-login

### Security Features
- JWT token storage in localStorage
- Automatic token refresh
- Session persistence across browser refresh
- Secure logout with token cleanup
- Protected route guards

## 🛣️ Routing System

### Public Routes
- `/` - Home/Landing page
- `/login` - Login form
- `/register` - Registration form

### Protected Routes (Require Authentication)
- `/dashboard` - User dashboard with quick actions
- `/books` - Book browsing and search
- `/profile` - User profile management
- `/favorites` - User's favorite books

### Route Guards
- **ProtectedRoute**: Redirects to `/login` if not authenticated
- **PublicRoute**: Redirects to `/dashboard` if already authenticated
- **Loading States**: Shows spinner during authentication checks

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend server running on http://localhost:8000

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests (when fixed)
npm test

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## 🧪 Testing

### Test Coverage
- Component unit tests for authentication forms
- Redux slice tests for state management
- Route protection tests
- Form validation tests
- User interaction tests with React Testing Library

### Current Status
- Test files created for all major components
- Some dependency issues with test runner (to be resolved)
- Coverage reports available

## 🔄 API Integration

### Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info
- `GET /health` - Backend health check

### Request/Response Handling
- Automatic JWT token management
- Error boundary with user-friendly messages
- Loading states for all async operations
- Type-safe API calls with TypeScript

## 📱 Responsive Design

### Mobile Support
- Responsive navigation header
- Mobile-optimized forms
- Touch-friendly button sizes
- Adaptive layouts for all screen sizes

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features with React 18
- CSS Grid and Flexbox layouts

## 🔮 Future Enhancements (Next Tasks)

### Task 005: Book Browsing Frontend
- Book search and filtering
- Pagination and infinite scroll
- Book detail views
- Genre browsing

### Task 006-007: Review System
- Book review forms
- Rating systems
- Review management

### Task 008: User Profiles
- Profile editing
- Reading history
- Favorite management

## 🛠️ Development Scripts

```bash
# Development
npm start                 # Start dev server
npm run build            # Build for production
npm test                 # Run tests
npm run eject           # Eject from Create React App

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

## 📞 Backend Integration

### API Base URL
- Development: `http://localhost:8000/api/v1`
- Production: TBD

### Authentication Flow
1. User submits login/registration form
2. Frontend sends request to backend
3. Backend returns JWT tokens
4. Frontend stores tokens and updates state
5. Automatic token refresh before expiration
6. Protected routes accessible with valid tokens

## 🎯 Current Status

**✅ Completed**: Full authentication system with routing and state management  
**🔄 In Progress**: Testing infrastructure fixes  
**📋 Next**: Book browsing and search functionality (Task 005)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**License**: MIT
