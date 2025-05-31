import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#6200EA',    // A vibrant purple that's energetic but not overwhelming
    secondary: '#03DAC6',  // A bright teal for accents
    text: '#2C3E50',      // A softer black for better readability
    background: '#F5F5F5', // A soft white background
    success: '#81C784',    // A gentle green for success states
    error: '#E57373',      // A softer red for errors
    warning: '#FFB74D',    // A muted orange for warnings
    info: '#64B5F6',       // A calm blue for information
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '20px',
      xxlarge: '24px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      small: 1.2,
      medium: 1.5,
      large: 1.8,
    },
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    circle: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    medium: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};

export default theme; 