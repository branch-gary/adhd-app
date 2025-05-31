import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import Upcoming from './Upcoming';
import { Task, Category, UserPreferences } from '../types';
import { loadSampleData } from '../data/sampleData';
import { getTasksForDate, isTaskCompletedOn, createCompletionRecord } from '../utils/taskUtils';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #fafafa;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TasksContent = styled.div`
  padding: ${props => props.theme.spacing.large};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.secondary};
  font-size: 14px;
  margin: 8px 0 0 0;
`;

const NoTasksMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.secondary};
  font-size: 14px;
`;

interface TasksProps {
  initialTasks?: Task[];
  initialCategories?: Category[];
}

const Tasks: React.FC<TasksProps> = ({ initialTasks = [], initialCategories = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [preferences, setPreferences] = useState<UserPreferences>({
    useSampleData: initialTasks.length === 0,
    showCompletedTasks: false
  });

  // Load initial data only if no initial tasks provided
  useEffect(() => {
    if (preferences.useSampleData && tasks.length === 0) {
      const data = loadSampleData();
      setTasks(data.tasks);
      setCategories(data.categories);
    }
  }, [preferences.useSampleData, tasks.length]);

  // Create a map of categories for easier lookup
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = {
      color: category.color,
      name: category.name,
      icon: category.icon,
      description: category.description
    };
    return acc;
  }, {} as { [key: string]: { color: string; name: string; icon: string; description?: string } });

  const getFilteredTasks = () => {
    const today = new Date();
    
    let filteredTasks = tasks;
    
    // Filter by category
    if (selectedCategory !== 'today' && selectedCategory !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.categoryId === selectedCategory);
    }
    
    // For "Today" view, only show tasks due today
    if (selectedCategory === 'today') {
      filteredTasks = getTasksForDate(filteredTasks, today);
    }
    
    // Filter completed tasks based on preferences
    if (!preferences.showCompletedTasks) {
      filteredTasks = filteredTasks.filter(task => !isTaskCompletedOn(task, today));
    }
    
    return filteredTasks;
  };

  const handleAddTask = (newTask: Task) => {
    const taskWithId = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTasks([...tasks, taskWithId]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return createCompletionRecord(task, new Date(), !isTaskCompletedOn(task, new Date()));
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editedTask.id ? editedTask : task
      )
    );
  };

  const handleToggleCompletedTasks = () => {
    setPreferences(prev => ({
      ...prev,
      showCompletedTasks: !prev.showCompletedTasks
    }));
  };

  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    const categoryId = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    const categoryWithId: Category = {
      ...newCategory,
      id: categoryId
    };
    setCategories(prev => [...prev, categoryWithId]);
    return categoryWithId;
  };

  const getPageTitle = () => {
    if (selectedCategory === 'today') {
      return "Today's Tasks";
    }
    if (selectedCategory === 'all') {
      return 'All Tasks';
    }
    return categoryMap[selectedCategory]?.name || 'Tasks';
  };

  const getPageDescription = () => {
    if (selectedCategory === 'today') {
      return 'Focus on what needs to be done today';
    }
    if (selectedCategory === 'all') {
      return 'View all your recurring tasks';
    }
    return categoryMap[selectedCategory]?.description || '';
  };

  const renderContent = () => {
    if (selectedCategory === 'upcoming') {
      return (
        <Upcoming
          tasks={tasks}
          categories={categoryMap}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onAddTask={handleAddTask}
          onAddCategory={handleAddCategory}
          showCompletedTasks={preferences.showCompletedTasks}
        />
      );
    }

    return (
      <TasksContent>
        <PageHeader>
          <PageTitle>{getPageTitle()}</PageTitle>
          <PageDescription>{getPageDescription()}</PageDescription>
        </PageHeader>

        <TaskList
          tasks={getFilteredTasks()}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onAddTask={handleAddTask}
          categories={categoryMap}
          currentCategory={selectedCategory === 'today' || selectedCategory === 'all' ? categories[0]?.id : selectedCategory}
          onAddCategory={handleAddCategory}
        />
      </TasksContent>
    );
  };

  return (
    <PageContainer>
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categories}
        showCompletedTasks={preferences.showCompletedTasks}
        onToggleCompletedTasks={handleToggleCompletedTasks}
        taskCounts={categories.reduce((acc, category) => {
          acc[category.id] = tasks.filter(task => task.categoryId === category.id).length;
          return acc;
        }, {} as { [key: string]: number })}
      />
      <MainContent>
        {renderContent()}
      </MainContent>
    </PageContainer>
  );
};

export default Tasks; 