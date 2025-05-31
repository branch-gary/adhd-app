import { Task, RecurrencePattern } from '../types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Determines if a task should be shown for a given date based on its recurrence pattern
 */
export const isTaskDueOn = (task: Task, date: Date): boolean => {
  const pattern = task.recurrence;
  const targetDate = new Date(date);
  
  // Reset time components for date comparison
  targetDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(pattern.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  // Task hasn't started yet
  if (targetDate < startDate) {
    return false;
  }

  switch (pattern.frequency) {
    case 'daily':
      return true;
      
    case 'weekly':
      if (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0) {
        return false;
      }
      return pattern.daysOfWeek.includes(targetDate.getDay());
      
    case 'monthly':
      if (pattern.dayOfMonth) {
        return targetDate.getDate() === pattern.dayOfMonth;
      }
      if (pattern.weekOfMonth) {
        const weekOfMonth = Math.ceil(targetDate.getDate() / 7);
        return weekOfMonth === pattern.weekOfMonth && 
               (pattern.daysOfWeek?.includes(targetDate.getDay()) ?? false);
      }
      return false;
      
    default:
      return false;
  }
};

/**
 * Gets the next occurrence of a task after a given date
 */
export const getNextOccurrence = (task: Task, afterDate: Date): Date | null => {
  const pattern = task.recurrence;
  let currentDate = new Date(afterDate);
  currentDate.setHours(0, 0, 0, 0);
  
  // Look up to 60 days ahead maximum
  for (let i = 0; i < 60; i++) {
    if (isTaskDueOn(task, currentDate)) {
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return null;
};

/**
 * Gets a friendly description of the recurrence pattern
 */
export const getRecurrenceDescription = (recurrence: RecurrencePattern): string => {
  const intervalText = recurrence.interval > 1 ? ` ${recurrence.interval}` : '';

  switch (recurrence.frequency) {
    case 'daily':
      return `Every${intervalText} day${recurrence.interval > 1 ? 's' : ''}`;

    case 'weekly':
      if (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) {
        return `Every${intervalText} week${recurrence.interval > 1 ? 's' : ''}`;
      }
      const dayNames = recurrence.daysOfWeek.map(day => DAYS_OF_WEEK[day]);
      return `Every${intervalText} ${dayNames.join(', ')}`;

    case 'monthly':
      if (recurrence.dayOfMonth) {
        return `Every${intervalText} month${recurrence.interval > 1 ? 's' : ''} on day ${recurrence.dayOfMonth}`;
      }
      return `Every${intervalText} month${recurrence.interval > 1 ? 's' : ''}`;

    default:
      return 'Custom';
  }
};

/**
 * Checks if a task has been completed for a specific date
 */
export const isTaskCompletedOn = (task: Task, date: Date): boolean => {
  // If no completion history, task is not completed
  if (!task.completionHistory) {
    return false;
  }

  const dateStr = date.toISOString().split('T')[0];
  const completion = task.completionHistory.find(h => h.date === dateStr);
  
  if (!completion) {
    return false;
  }

  return completion.completed;
};

/**
 * Gets tasks due for a specific date
 */
export const getTasksForDate = (tasks: Task[], date: Date): Task[] => {
  return tasks.filter(task => shouldTaskShowOnDate(task, date));
};

/**
 * Gets all upcoming tasks within a date range
 */
export const getUpcomingTasks = (tasks: Task[], startDate: Date, days: number): Task[] => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  
  return tasks.filter(task => {
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (shouldTaskShowOnDate(task, d)) {
        return true;
      }
    }
    return false;
  });
};

/**
 * Creates a completion record for a task
 */
export const createCompletionRecord = (task: Task, date: Date, completed: boolean): Task => {
  const dateString = date.toISOString();
  const history = task.completionHistory || [];
  
  // Remove any existing record for the same date
  const filteredHistory = history.filter(h => h.date.split('T')[0] !== dateString.split('T')[0]);
  
  return {
    ...task,
    lastCompleted: completed ? dateString : task.lastCompleted,
    completionHistory: [
      ...filteredHistory,
      { date: dateString, completed }
    ]
  };
};

export const shouldTaskShowOnDate = (task: Task, date: Date): boolean => {
  const pattern = task.recurrence;
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const startDate = new Date(pattern.startDate);
  
  // Task hasn't started yet
  if (date < startDate) {
    return false;
  }

  // Calculate days since start
  const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  switch (pattern.frequency) {
    case 'daily':
      return daysSinceStart % pattern.interval === 0;

    case 'weekly':
      // Check if it's the right week based on interval
      if (Math.floor(daysSinceStart / 7) % pattern.interval !== 0) {
        return false;
      }
      // Check if it's one of the selected days
      return pattern.daysOfWeek?.includes(dayOfWeek) ?? false;

    case 'monthly':
      // Check if it's the right month based on interval
      const monthsSinceStart = (date.getFullYear() - startDate.getFullYear()) * 12 + date.getMonth() - startDate.getMonth();
      if (monthsSinceStart % pattern.interval !== 0) {
        return false;
      }
      // Check if it's the right day of month
      return pattern.dayOfMonth === dayOfMonth;

    default:
      return false;
  }
}; 