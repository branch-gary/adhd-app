import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, Category, RecurrencePattern } from '../types';
import Modal from './Modal';

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSize.medium};
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSize.medium};
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.large};
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  background-color: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.variant === 'primary' ? 'transparent' : '#ddd'};

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#5000d6' : '#f5f5f5'};
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
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            id="notes"
            type="text"
            value={editedTask.notes || ''}
            onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
          />
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
            <option value="new">+ Add New Category</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="frequency">Recurrence Pattern</Label>
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

          {editedTask.recurrence.frequency === 'weekly' && (
            <>
              <Label>Days of Week</Label>
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
            </>
          )}

          {editedTask.recurrence.frequency === 'monthly' && (
            <>
              <Label htmlFor="dayOfMonth">Day of Month</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
              />
            </>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="estimatedMinutes">Time Estimate (minutes)</Label>
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
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
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