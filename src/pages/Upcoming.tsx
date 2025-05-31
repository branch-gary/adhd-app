import React, { useState } from 'react';
import styled from 'styled-components';
import HorizontalCalendar from '../components/HorizontalCalendar';
import TaskList from '../components/TaskList';
import { Task, Category } from '../types';
import { getTasksForDate, isTaskCompletedOn } from '../utils/taskUtils';

const PageContainer = styled.div`
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

const DateSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const DateHeader = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin: ${props => props.theme.spacing.medium} 0;
`;

interface UpcomingProps {
  tasks: Task[];
  categories: { [key: string]: { color: string; name: string; icon: string } };
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (task: Task) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => Category;
  showCompletedTasks: boolean;
}

// Helper function to get frequency weight for sorting
const getFrequencyWeight = (frequency: string): number => {
  switch (frequency) {
    case 'monthly': return 1;
    case 'weekly': return 2;
    case 'daily': return 3;
    default: return 4;
  }
};

const Upcoming: React.FC<UpcomingProps> = ({
  tasks,
  categories,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
  onAddCategory,
  showCompletedTasks
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTasksForSelectedDate = () => {
    let filteredTasks = getTasksForDate(tasks, selectedDate);
    
    if (!showCompletedTasks) {
      filteredTasks = filteredTasks.filter(task => !isTaskCompletedOn(task, selectedDate));
    }
    
    // Sort tasks by frequency (monthly -> weekly -> daily) and then by estimated duration
    return filteredTasks.sort((a, b) => {
      // First sort by frequency
      const freqDiff = getFrequencyWeight(a.recurrence.frequency) - getFrequencyWeight(b.recurrence.frequency);
      if (freqDiff !== 0) return freqDiff;
      
      // Then sort by estimated duration (longer tasks first)
      const aMinutes = a.estimatedMinutes || 0;
      const bMinutes = b.estimatedMinutes || 0;
      return bMinutes - aMinutes;
    });
  };

  const formatDateHeader = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Upcoming</PageTitle>
        <PageDescription>Plan ahead and stay organized</PageDescription>
      </PageHeader>

      <HorizontalCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <DateSection>
        <DateHeader>{formatDateHeader(selectedDate)}</DateHeader>
        <TaskList
          tasks={getTasksForSelectedDate()}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onAddTask={onAddTask}
          categories={categories}
          showCategory={true}
          currentCategory={undefined}
          onAddCategory={onAddCategory}
        />
      </DateSection>
    </PageContainer>
  );
};

export default Upcoming; 