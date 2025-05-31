import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './theme/GlobalStyle';
import theme from './theme';
import Tasks from './pages/Tasks';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Tasks />
      </Router>
    </ThemeProvider>
  );
}

export default App;
