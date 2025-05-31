import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import theme from './theme';
import Tasks from './pages/Tasks';
import OnboardingModal from './components/OnboardingModal';
import { Category, Task } from './types';
import { loadSampleData } from './data/sampleData';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

function App() {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isOnboardingModalOpen) {
      const data = loadSampleData();
      setTasks(data.tasks);
      setCategories(data.categories);
    }
  }, [isOnboardingModalOpen]);

  const handleOnboardingChoice = (choice: string) => {
    const data = loadSampleData();
    
    if (choice === 'easy') {
      // Start with just one simple daily task
      const firstCategory = data.categories[0];
      const simpleTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Drink a glass of water',
        categoryId: firstCategory.id,
        completed: false,
        recurrence: {
          frequency: 'daily' as const,
          interval: 1,
          startDate: new Date().toISOString().split('T')[0]
        },
        estimatedMinutes: 1
      };
      setCategories([firstCategory]);
      setTasks([simpleTask]);
    } else if (choice === 'plan') {
      // Start with a curated set of tasks
      setCategories(data.categories.slice(0, 2));
      setTasks(data.tasks.slice(0, 3));
    } else {
      // Load all sample data
      setCategories(data.categories);
      setTasks(data.tasks);
    }

    setIsOnboardingModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
          onComplete={handleOnboardingChoice}
        />
        <Routes>
          <Route
            path="/"
            element={<Tasks initialTasks={tasks} initialCategories={categories} />}
          />
          <Route
            path="/tasks"
            element={<Tasks initialTasks={tasks} initialCategories={categories} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
