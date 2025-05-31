import { Category, Task, SampleData } from '../types';

const sampleCategories: Category[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    color: '#FF6B6B',
    icon: '🍳',
    description: 'Kitchen and cooking related tasks'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    color: '#4ECDC4',
    icon: '🚿',
    description: 'Bathroom cleaning and maintenance'
  },
  {
    id: 'pets',
    name: 'Pets',
    color: '#FFD93D',
    icon: '🐱',
    description: 'Pet care and maintenance'
  },
  {
    id: 'health',
    name: 'Health',
    color: '#95E1D3',
    icon: '💊',
    description: 'Personal health and medication'
  },
  {
    id: 'plants',
    name: 'Plants',
    color: '#6C9',
    icon: '🌿',
    description: 'Plant care and watering'
  },
  {
    id: 'exercise',
    name: 'Exercise',
    color: '#FF8C42',
    icon: '💪',
    description: 'Fitness and workout routines'
  },
  {
    id: 'study',
    name: 'Study',
    color: '#845EC2',
    icon: '📚',
    description: 'Learning and skill development'
  },
  {
    id: 'selfcare',
    name: 'Self Care',
    color: '#F8A5C2',
    icon: '🧘‍♀️',
    description: 'Mental health and relaxation'
  }
];

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Feed the cats',
    completed: false,
    categoryId: 'pets',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 5
  },
  {
    id: '2',
    title: 'Clean litter box',
    completed: false,
    categoryId: 'pets',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 10
  },
  {
    id: '3',
    title: 'Take medication',
    completed: false,
    categoryId: 'health',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    notes: 'Take with food',
    estimatedMinutes: 1
  },
  {
    id: '4',
    title: 'Water indoor plants',
    completed: false,
    categoryId: 'plants',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [0, 3], // Sunday and Wednesday
      startDate: todayStr
    },
    estimatedMinutes: 15
  },
  {
    id: '5',
    title: 'Deep clean bathroom',
    completed: false,
    categoryId: 'bathroom',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [6], // Saturday
      startDate: todayStr
    },
    estimatedMinutes: 30
  },
  {
    id: '6',
    title: 'Clean kitchen counters',
    completed: false,
    categoryId: 'kitchen',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 10
  },
  {
    id: '7',
    title: 'Take out kitchen trash',
    completed: false,
    categoryId: 'kitchen',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1, 4], // Monday and Thursday
      startDate: todayStr
    },
    estimatedMinutes: 5
  },
  {
    id: '8',
    title: 'Clean coffee maker',
    completed: false,
    categoryId: 'kitchen',
    recurrence: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
      startDate: todayStr
    },
    estimatedMinutes: 20,
    notes: 'Use vinegar solution'
  },
  {
    id: '9',
    title: 'Morning yoga',
    completed: false,
    categoryId: 'exercise',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 20,
    notes: 'Follow the morning flow routine'
  },
  {
    id: '10',
    title: 'Study programming',
    completed: false,
    categoryId: 'study',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      startDate: todayStr
    },
    estimatedMinutes: 60,
    notes: 'Focus on TypeScript and React'
  },
  {
    id: '11',
    title: 'Meditation session',
    completed: false,
    categoryId: 'selfcare',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 15,
    notes: 'Use the Calm app'
  },
  {
    id: '12',
    title: 'Strength training',
    completed: false,
    categoryId: 'exercise',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1, 4], // Monday and Thursday
      startDate: todayStr
    },
    estimatedMinutes: 45,
    notes: 'Focus on upper body'
  },
  {
    id: '13',
    title: 'Language practice',
    completed: false,
    categoryId: 'study',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 30,
    notes: 'Duolingo streak'
  },
  {
    id: '14',
    title: 'Journal writing',
    completed: false,
    categoryId: 'selfcare',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 15,
    notes: 'Reflect on daily achievements'
  },
  {
    id: '15',
    title: 'Weekly meal prep',
    completed: false,
    categoryId: 'kitchen',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [0], // Sunday
      startDate: todayStr
    },
    estimatedMinutes: 120,
    notes: 'Prepare lunches for the week'
  },
  {
    id: '16',
    title: 'Take vitamins',
    completed: false,
    categoryId: 'health',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 1
  },
  {
    id: '17',
    title: 'Clean kitchen surfaces',
    completed: false,
    categoryId: 'kitchen',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 10
  },
  {
    id: '18',
    title: 'Water outdoor plants',
    completed: false,
    categoryId: 'plants',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [2, 5], // Tuesday and Friday
      startDate: todayStr
    },
    estimatedMinutes: 20
  },
  {
    id: '19',
    title: 'Monthly budget review',
    completed: false,
    categoryId: 'study',
    recurrence: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
      startDate: todayStr
    },
    estimatedMinutes: 45,
    notes: 'Review expenses and adjust budget'
  },
  {
    id: '20',
    title: 'Deep breathing exercises',
    completed: false,
    categoryId: 'selfcare',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      startDate: todayStr
    },
    estimatedMinutes: 10,
    notes: 'Box breathing technique'
  }
];

export const sampleData: SampleData = {
  categories: sampleCategories,
  tasks: sampleTasks
};

export const loadSampleData = (): SampleData => {
  return sampleData;
}; 