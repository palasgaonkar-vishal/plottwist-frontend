# PlotTwist Frontend

A modern React-based frontend for the PlotTwist book review platform with AI-powered recommendations.

## 🚀 Features Implemented

### ✅ **Core Features**
- **User Authentication**: Complete login/register system with JWT token management
- **Book Discovery**: Advanced book browsing with search, filters, and pagination
- **Review System**: Write, edit, and manage book reviews with star ratings
- **User Profiles**: Comprehensive user profiles with statistics and edit functionality
- **Favorites System**: Heart-icon favorite buttons throughout the application
- **Recommendation Engine**: AI-powered book recommendations with feedback system
- **Responsive Design**: Mobile-first approach with Material-UI components

### 🎨 **UI/UX Features**
- **Modern Design**: Clean, intuitive interface with custom Material-UI theme
- **Dark/Light Mode**: Theme switching with user preference persistence
- **Interactive Components**: Hover effects, loading states, and smooth animations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Error Handling**: Comprehensive error boundaries with user-friendly messages
- **Performance**: Optimized with React.memo, useCallback, and code splitting

## 📱 Pages & Components

### **Authentication Pages**
- **Login Page** (`/login`): User authentication with form validation
- **Register Page** (`/register`): New user registration with comprehensive validation
- **Protected Routes**: Automatic redirection based on authentication status

### **Main Application Pages**
- **Home/Landing** (`/`): Welcome page with feature overview
- **Dashboard** (`/dashboard`): Personalized user dashboard with quick stats and actions
- **Books Browsing** (`/books`): Advanced book discovery with filters and search
- **Book Detail** (`/books/:id`): Detailed book view with reviews and favoriting
- **Profile** (`/profile`): User profile management with statistics and review history
- **Favorites** (`/favorites`): User's favorited books with pagination
- **Recommendations** (`/recommendations`): AI-powered book recommendations
- **404 Page**: Custom not found page with navigation options

### **Core Components**

#### **Navigation**
- **Header**: Dynamic navigation with authentication-aware menu
- **Breadcrumbs**: Dynamic breadcrumb navigation for better UX
- **Protected Route**: Route protection based on authentication status

#### **Book Components**
- **BookCard**: Reusable book display component with grid/list views
- **BookCover**: Smart book cover display with fallback handling
- **SearchBar**: Real-time search with debouncing and focus management
- **Pagination**: Advanced pagination with customizable items per page

#### **Review Components**
- **StarRating**: Interactive 5-star rating component with hover effects
- **ReviewForm**: Modal and inline review creation/editing with validation
- **ReviewCard**: Individual review display with user information
- **ReviewList**: Paginated review listing with sorting options

#### **User Components**
- **ProfileForm**: User profile editing with real-time validation
- **FavoriteButton**: Heart-icon favorite toggle with instant feedback

#### **Recommendation Components**
- **RecommendationCard**: Individual recommendation display with feedback
- **RecommendationSection**: Organized recommendation categories

## 🛠️ Technical Stack

### **Core Technologies**
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: Predictable state management with RTK Query
- **React Router**: Client-side routing with nested routes
- **Material-UI**: Component library with custom theming

### **Development Tools**
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting for consistency
- **Jest**: Unit testing framework with React Testing Library
- **Axios**: HTTP client with interceptors for API communication

### **Build & Performance**
- **Webpack**: Module bundling with code splitting
- **React Scripts**: Development and build tooling
- **Source Maps**: Development debugging support
- **Bundle Analysis**: Performance monitoring and optimization

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Books/           # Book-related components
│   ├── Navigation/      # Navigation components
│   ├── Reviews/         # Review system components
│   ├── Recommendations/ # Recommendation components
│   └── User/           # User profile components
├── pages/              # Page components and routing
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for state management
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── contexts/           # React context providers
├── theme/              # Material-UI theme configuration
├── utils/              # Utility functions and helpers
└── tests/              # Test files and utilities
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/palasgaonkar-vishal/plottwist-frontend.git
   cd plottwist-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- --testPathPattern=Login
```

### Test Coverage
Key areas covered:
- Authentication components and flows
- Star rating interactions
- Review form validation
- Protected route behavior
- API service functions
- Redux store operations

## 🎨 Theme & Styling

### Custom Material-UI Theme
- **Primary Color**: Pastel green (#81C784)
- **Secondary Color**: Warm yellow (#FFB74D)
- **Typography**: Roboto font family with custom variants
- **Spacing**: 8px base unit with consistent margins/padding
- **Breakpoints**: Mobile-first responsive design

### Dark Mode Support
- Automatic theme switching with user preference persistence
- Consistent dark/light mode across all components
- Theme toggle in the navigation header

## 🔗 API Integration

### Axios Configuration
- Base URL configuration for backend API
- Request/response interceptors for JWT token management
- Automatic token refresh on expiration
- Error handling and retry logic

### API Services
- **authAPI**: User authentication and registration
- **booksAPI**: Book browsing, search, and details
- **reviewsAPI**: Review CRUD operations
- **usersAPI**: User profile management
- **favoritesAPI**: Favorites management
- **recommendationsAPI**: AI recommendations and feedback

## 🚀 Production Deployment

### AWS EC2 Deployment
The frontend is configured for production deployment on AWS EC2:

1. **Infrastructure Setup**
   ```bash
   cd ../infrastructure/terraform/
   terraform init
   terraform apply
   ```

2. **CI/CD Pipeline**
   - GitHub Actions automatically deploy on push to `main`
   - Includes testing, security scanning, and performance audits
   - Lighthouse performance monitoring

3. **Manual Deployment**
   ```bash
   # SSH to production server
   ssh ubuntu@your-ec2-instance
   
   # Deploy latest changes
   sudo -u ubuntu /opt/plottwist/deploy.sh
   ```

### Docker Deployment
```bash
# Build Docker image
docker build -t plottwist-frontend .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

#### Production Environment Variables
```env
REACT_APP_API_URL=https://api.yourdomain.com
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

## 📊 Performance Features

### Optimization Techniques
- **Code Splitting**: Lazy loading of routes and components
- **Memoization**: React.memo and useCallback for performance
- **Debouncing**: Search input debouncing (300ms)
- **Image Optimization**: Efficient book cover loading
- **Bundle Optimization**: Webpack optimization for smaller bundles

### Performance Monitoring
- **Lighthouse Audits**: Automated performance testing
- **Bundle Analysis**: Size monitoring and optimization
- **React DevTools**: Performance profiling support
- **Error Boundaries**: Graceful error handling

## 🔒 Security Features

### Authentication Security
- **JWT Token Management**: Secure token storage and refresh
- **Route Protection**: Authentication-based access control
- **Automatic Logout**: Session management and expiration
- **CSRF Protection**: Cross-site request forgery prevention

### Data Protection
- **Input Validation**: Client-side validation with backend verification
- **XSS Prevention**: Sanitized user inputs and outputs
- **Secure Headers**: Security headers via proxy configuration
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: xs, sm, md, lg, xl responsive breakpoints
- **Touch Interactions**: Touch-friendly buttons and gestures
- **Performance**: Optimized for mobile devices
- **Accessibility**: Mobile screen reader support

### Cross-Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Polyfills**: ES6+ feature support for older browsers
- **Testing**: Cross-browser testing and validation

## 🧪 Quality Assurance

### Development Standards
- **TypeScript**: 100% type safety with strict mode
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: End-to-end user journey testing
- **Visual Regression**: UI consistency testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks guidelines
- Write TypeScript with strict typing
- Add tests for new components and features
- Update documentation for significant changes
- Ensure accessibility compliance

## 🎯 Current Status

**Task Implementation Status:**
- ✅ **Task 001**: Project Setup and Infrastructure
- ✅ **Task 004**: Frontend Authentication and Routing
- ✅ **Task 005**: Book Browsing and Search Frontend
- ✅ **Task 007**: Review and Rating System Frontend
- ✅ **Task 008**: User Profile and Favorites System
- ✅ **Task 011**: Deployment Infrastructure

**Key Features Completed:**
- Complete user authentication system with JWT
- Advanced book browsing with real-time search and filters
- Full review and rating system with interactive components
- User profiles with statistics and edit functionality
- Favorites system with instant feedback
- AI recommendation interface with feedback collection
- Production-ready deployment infrastructure
- Comprehensive responsive design

**Pages Ready for Production:**
- Landing page with feature overview
- Authentication flows (login/register)
- Book discovery and detail pages
- User dashboard with personalized content
- Profile management with statistics
- Favorites collection with pagination
- AI-powered recommendations with feedback

## 📞 Support

For issues or questions:
1. Check the component documentation and examples
2. Review the [troubleshooting guide](../infrastructure/README.md#troubleshooting)
3. Submit an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**PlotTwist Frontend - Ready for Production** 🚀
