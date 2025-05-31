import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, Category, RecurrencePattern } from '../types';
import Modal from './Modal';

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.large};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.medium};
`;

const HelpText = styled.div`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSize.small};
  margin-top: 4px;
  line-height: 1.4;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.typography.fontSize.medium};
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.typography.fontSize.medium};
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.large};
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.large};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${props => props.variant === 'primary' 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, #7000ff)`
    : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.variant === 'primary' ? 'transparent' : '#e0e0e0'};
  box-shadow: ${props => props.variant === 'primary' 
    ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
    : 'none'};

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.variant === 'primary'
      ? `linear-gradient(135deg, #5000d6, #6000ef)`
      : '#f5f5f5'};
    box-shadow: ${props => props.variant === 'primary'
      ? '0 6px 16px rgba(0, 0, 0, 0.15)'
      : 'none'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const DaySelector = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
  flex-wrap: wrap;
`;

const DayButton = styled.button<{ selected: boolean }>`
  padding: ${props => props.theme.spacing.small};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : '#ddd'};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  flex: 1;
  min-width: 60px;
  
  &:hover {
    background-color: ${props => props.selected ? '#5000d6' : '#f5f5f5'};
  }
`;

const RecurrenceDescription = styled.div`
  margin-top: ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: ${props => props.theme.colors.secondary};
`;

const AddCategoryForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const ColorPicker = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;

  &:hover {
    transform: scale(1.1);
  }
`;

const EmojiPicker = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
  flex-wrap: wrap;
`;

const EmojiOption = styled.button<{ isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : '#ddd'};
  background-color: white;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  padding: 0;
  font-size: 16px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PREDEFINED_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD93D', // Yellow
  '#95E1D3', // Mint
  '#6C9',    // Green
  '#FF8C42', // Orange
  '#845EC2', // Purple
  '#00B8A9', // Turquoise
  '#F8A5C2', // Pink
  '#63AAF7'  // Blue
];

const COMMON_EMOJIS = [
  '🏠', '🧹', '📚', '💪', '🍳', '🚿', 
  '🌿', '🐱', '💊', '🎮', '💻', '🎨',
  '🏃', '🛒', '📝', '🔧', '🎵', '🚗'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INTERVALS = [1, 2, 3, 4, 5, 6, 7, 14, 30]; // Common intervals

interface EditTaskProps {
  task: Task;
  categories: Category[];
  onSave: (editedTask: Task) => void;
  onCancel: () => void;
  onAddCategory?: (newCategory: Omit<Category, 'id'>) => Category;
}

const EditTask: React.FC<EditTaskProps> = ({ 
  task, 
  categories, 
  onSave, 
  onCancel,
  onAddCategory 
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [selectedDays, setSelectedDays] = useState<number[]>(task.recurrence.daysOfWeek || []);
  const [dayOfMonth, setDayOfMonth] = useState<number>(task.recurrence.dayOfMonth || 1);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: PREDEFINED_COLORS[0],
    icon: COMMON_EMOJIS[0]
  });

  useEffect(() => {
    setEditedTask(task);
    setSelectedDays(task.recurrence.daysOfWeek || []);
    setDayOfMonth(task.recurrence.dayOfMonth || 1);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...editedTask,
      recurrence: {
        ...editedTask.recurrence,
        daysOfWeek: editedTask.recurrence.frequency === 'weekly' ? selectedDays : undefined,
        dayOfMonth: editedTask.recurrence.frequency === 'monthly' ? dayOfMonth : undefined
      }
    };
    onSave(updatedTask);
  };

  const handleFrequencyChange = (value: string) => {
    const [frequency, interval] = value.split('-');
    setEditedTask({
      ...editedTask,
      recurrence: {
        ...editedTask.recurrence,
        frequency: frequency as RecurrencePattern['frequency'],
        interval: interval ? parseInt(interval) : 1
      }
    });
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddCategory) {
      const category = onAddCategory(newCategory);
      setEditedTask({
        ...editedTask,
        categoryId: category.id
      });
      setIsAddingCategory(false);
    }
  };

  return (
    <>
      <EditForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder="What do you need to do?"
            required
          />
          <HelpText>Keep it short and clear - this is what you'll see in your task list</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            id="notes"
            type="text"
            value={editedTask.notes || ''}
            onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
            placeholder="Add any extra details you want to remember"
          />
          <HelpText>Include any additional context or steps you might need later</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={editedTask.categoryId}
            onChange={(e) => {
              if (e.target.value === 'new') {
                setIsAddingCategory(true);
              } else {
                setEditedTask({ ...editedTask, categoryId: e.target.value });
              }
            }}
            required
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
            <option value="new">+ Create New Category</option>
          </Select>
          <HelpText>Group similar tasks together to stay organized</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="frequency">How often does this repeat?</Label>
          <Select
            id="frequency"
            value={`${editedTask.recurrence.frequency}${editedTask.recurrence.interval > 1 ? '-' + editedTask.recurrence.interval : ''}`}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            required
          >
            <option value="daily">Every day</option>
            {INTERVALS.slice(1).map(interval => (
              <option key={`daily-${interval}`} value={`daily-${interval}`}>
                Every {interval} days
              </option>
            ))}
            <option value="weekly">Every week</option>
            {INTERVALS.slice(1, 4).map(interval => (
              <option key={`weekly-${interval}`} value={`weekly-${interval}`}>
                Every {interval} weeks
              </option>
            ))}
            <option value="monthly">Every month</option>
            {INTERVALS.slice(1, 3).map(interval => (
              <option key={`monthly-${interval}`} value={`monthly-${interval}`}>
                Every {interval} months
              </option>
            ))}
          </Select>
          <HelpText>Choose how frequently you need to do this task</HelpText>

          {editedTask.recurrence.frequency === 'weekly' && (
            <>
              <Label>Which days of the week?</Label>
              <DaySelector>
                {DAYS_OF_WEEK.map((day, index) => (
                  <DayButton
                    key={day}
                    type="button"
                    selected={selectedDays.includes(index)}
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </DayButton>
                ))}
              </DaySelector>
              <HelpText>Select one or more days when this task should appear</HelpText>
            </>
          )}

          {editedTask.recurrence.frequency === 'monthly' && (
            <>
              <Label htmlFor="dayOfMonth">Which day of the month?</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
              />
              <HelpText>Choose a day between 1-31 when this task should appear each month</HelpText>
            </>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="estimatedMinutes">How long will it take? (minutes)</Label>
          <Input
            id="estimatedMinutes"
            type="number"
            min="1"
            max="240"
            value={editedTask.estimatedMinutes || ''}
            onChange={(e) => setEditedTask({
              ...editedTask,
              estimatedMinutes: e.target.value ? parseInt(e.target.value) : undefined
            })}
            placeholder="e.g., 15"
          />
          <HelpText>Estimate the time needed - this helps with planning your day</HelpText>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save Task</Button>
        </ButtonGroup>
      </EditForm>

      {isAddingCategory && (
        <Modal
          isOpen={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
          title="Add New Category"
        >
          <AddCategoryForm onSubmit={handleAddCategory}>
            <FormGroup>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Icon</Label>
              <EmojiPicker>
                {COMMON_EMOJIS.map(emoji => (
                  <EmojiOption
                    key={emoji}
                    type="button"
                    isSelected={newCategory.icon === emoji}
                    onClick={() => setNewCategory({ ...newCategory, icon: emoji })}
                  >
                    {emoji}
                  </EmojiOption>
                ))}
              </EmojiPicker>
            </FormGroup>

            <FormGroup>
              <Label>Color</Label>
              <ColorPicker>
                {PREDEFINED_COLORS.map(color => (
                  <ColorOption
                    key={color}
                    type="button"
                    color={color}
                    isSelected={newCategory.color === color}
                    onClick={() => setNewCategory({ ...newCategory, color: color })}
                  >
                    {newCategory.color === color ? '✓' : ''}
                  </ColorOption>
                ))}
              </ColorPicker>
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={() => setIsAddingCategory(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Category
              </Button>
            </ButtonGroup>
          </AddCategoryForm>
        </Modal>
      )}
    </>
  );
};

export default EditTask; 