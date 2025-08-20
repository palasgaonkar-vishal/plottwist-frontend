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

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the project root
2. Start all services:
   ```bash
   docker-compose up -d
   ```
3. The frontend will be available at `http://localhost:3000`

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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

## 🚀 Deployment

Deployment configuration will be added in Task 011.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📄 License

This project is part of the PlotTwist book review platform.
