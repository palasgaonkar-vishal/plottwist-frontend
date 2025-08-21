# PlotTwist Frontend

React TypeScript frontend for the PlotTwist book review platform with Material-UI design system.

## 🚀 Features

- **React 18** with TypeScript for type safety
- **Material-UI** with custom pastel green theme and dark mode
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **Axios** for API communication
- **Responsive design** for desktop and mobile

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for development)

## 🛠️ Development Setup

### Option 1: Frontend-Only Development

This setup runs only the frontend, useful when working with a separately running backend:

```bash
# Clone this repository
git clone git@github.com:palasgaonkar-vishal/plottwist-frontend.git
cd plottwist-frontend

# Install dependencies
npm install

# Start development server
npm start

# Or using Docker
docker-compose -f docker-compose.dev.yml up -d

# The frontend will be available at http://localhost:3000
```

### Option 2: Full-Stack Development (Recommended)

For full-stack development, clone both repositories and use the full-stack setup:

```bash
# Create a workspace directory
mkdir plottwist-workspace
cd plottwist-workspace

# Clone both repositories
git clone git@github.com:palasgaonkar-vishal/plottwist-backend.git
git clone git@github.com:palasgaonkar-vishal/plottwist-frontend.git

# Download the full-stack docker-compose file
curl -O https://raw.githubusercontent.com/palasgaonkar-vishal/plottwist-backend/main/docker-compose.fullstack.yml
curl -O https://raw.githubusercontent.com/palasgaonkar-vishal/plottwist-backend/main/init-db.sql

# Start all services
docker-compose -f docker-compose.fullstack.yml up -d

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - Database: localhost:5432
```

### Option 3: Local Development (Without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Note:** For the frontend to work properly, you'll need the backend API running at `http://localhost:8000`.

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage --watchAll=false
```

## 🏗️ Build

Create production build:
```bash
npm run build
```

## 🎨 Theme

The application uses a custom Material-UI theme with:
- **Primary colors**: Pastel greens
- **Secondary colors**: Warm yellow accents
- **Background**: Light green tint for soothing experience
- **Dark mode**: Full support for light/dark theme switching

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components (added in later tasks)
├── pages/              # Page components (added in later tasks)
├── store/              # Redux store configuration (added in later tasks)
├── services/           # API service functions (added in later tasks)
├── hooks/              # Custom React hooks (added in later tasks)
├── utils/              # Utility functions (added in later tasks)
├── types/              # TypeScript type definitions (added in later tasks)
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🔌 API Integration

The frontend communicates with the backend API at:
- **Development**: `http://localhost:8000`
- **Production**: Will be configured in deployment

## 📱 Features to be Added

- User authentication and registration
- Book browsing and search
- Review creation and management
- User profiles and favorites
- AI-powered book recommendations
- Dark/light theme toggle

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🚀 Deployment

Deployment configuration will be added in Task 011.

## 📄 License

This project is part of the PlotTwist book review platform.
