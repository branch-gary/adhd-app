import type { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
      };
      fontWeight: {
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeight: {
        small: number;
        medium: number;
        large: number;
      };
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      circle: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    transitions: {
      fast: string;
      medium: string;
      slow: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      wide: string;
    };
  }
} 