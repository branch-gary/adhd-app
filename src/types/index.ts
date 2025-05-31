export type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'monthly';
  // Interval (e.g., every X days/weeks/months)
  interval: number;
  // For weekly tasks
  daysOfWeek?: number[];  // 0-6, where 0 is Sunday
  // For monthly tasks
  dayOfMonth?: number;    // 1-31
  // Common fields
  startDate: string;      // ISO date string
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
};

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  recurrence: RecurrencePattern;
  // Tracking completion history
  lastCompleted?: string;  // ISO date string
  completionHistory?: {
    date: string;         // ISO date string
    completed: boolean;
  }[];
  // Optional fields for task context
  notes?: string;
  estimatedMinutes?: number;
}

// Sample data structure for development
export interface SampleData {
  categories: Category[];
  tasks: Task[];
}

// User preferences
export interface UserPreferences {
  useSampleData: boolean;
  showCompletedTasks: boolean;
  defaultCategory?: string;
  reminderTime?: string;  // Time of day for reminders
}

// Helper type for task creation modal
export interface TaskFormData {
  title: string;
  categoryId: string;
  recurrence: {
    frequency: RecurrencePattern['frequency'];
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  notes?: string;
  estimatedMinutes?: number;
} 