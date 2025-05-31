import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: ${props => props.theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  * {
    box-sizing: border-box;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;

export default GlobalStyle; 