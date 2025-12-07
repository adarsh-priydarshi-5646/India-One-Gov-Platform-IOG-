import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#C8102E',
      light: '#E31837',
      dark: '#A00D24',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#003DA5',
      light: '#0052CC',
      dark: '#002B73',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#0284C7',
    },
    success: {
      main: '#16A34A',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: '#DDDDDD',
  },
  typography: {
    fontFamily: '"Microsoft YaHei", "SimHei", "Noto Sans", "Roboto", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333333',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333333',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#333333',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#333333',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#666666',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '6px 16px',
          fontSize: '0.875rem',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #DDDDDD',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #DDDDDD',
          backgroundColor: '#FFFFFF',
        },
        elevation0: {
          boxShadow: 'none',
          border: 'none',
        },
      },
    },
  },
});
