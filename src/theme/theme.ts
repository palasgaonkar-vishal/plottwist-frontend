import { createTheme, ThemeOptions } from '@mui/material/styles';
import { green, yellow, grey } from '@mui/material/colors';

// Custom color palette
const customColors = {
  pastelGreen: {
    50: '#f0f9f0',
    100: '#dcf2dc',
    200: '#c1e8c1',
    300: '#9dd99d',
    400: '#7cc57c',
    500: '#5cb85c',
    600: '#4a934a',
    700: '#3e7a3e',
    800: '#336633',
    900: '#2b562b',
  },
  warmYellow: {
    50: '#fffef7',
    100: '#fffbeb',
    200: '#fff5c7',
    300: '#ffed94',
    400: '#ffdc5e',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ff8f00',
    800: '#e65100',
    900: '#bf360c',
  },
};

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: customColors.pastelGreen[400],
      light: customColors.pastelGreen[200],
      dark: customColors.pastelGreen[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: customColors.warmYellow[500],
      light: customColors.warmYellow[300],
      dark: customColors.warmYellow[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafffe',
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
    action: {
      hover: customColors.pastelGreen[50],
    },
    divider: grey[200],
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          border: `1px solid ${grey[100]}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: customColors.pastelGreen[300],
      light: customColors.pastelGreen[200],
      dark: customColors.pastelGreen[500],
      contrastText: '#000000',
    },
    secondary: {
      main: customColors.warmYellow[400],
      light: customColors.warmYellow[300],
      dark: customColors.warmYellow[600],
      contrastText: '#000000',
    },
    background: {
      default: '#0a0f0a',
      paper: '#1a1f1a',
    },
    text: {
      primary: '#ffffff',
      secondary: grey[300],
    },
    action: {
      hover: 'rgba(157, 217, 157, 0.08)',
    },
    divider: grey[700],
  },
  typography: lightThemeOptions.typography,
  shape: lightThemeOptions.shape,
  components: {
    ...lightThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          border: `1px solid ${grey[800]}`,
        },
      },
    },
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Theme context type
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export default { lightTheme, darkTheme }; 