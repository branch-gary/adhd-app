import React, { useState } from 'react';
import styled from 'styled-components';
import { Task, Category } from '../types';
import { getRecurrenceDescription, isTaskCompletedOn } from '../utils/taskUtils';
import EditTask from './EditTask';
import Modal from './Modal';

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
  max-width: 800px;
  margin: 0 auto;
`;

const TaskItem = styled.div<{ categoryColor: string; isCompleted: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: ${props => props.theme.spacing.medium};
  background-color: white;
  border-radius: 8px;
  border-left: 3px solid ${props => props.categoryColor};
  gap: ${props => props.theme.spacing.medium};
  transition: all 0.2s ease;
  opacity: ${props => props.isCompleted ? 0.7 : 1};
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #fafafa;
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 40px;
    right: 16px;
    height: 1px;
    background-color: ${props => props.theme.colors.text};
    opacity: ${props => props.isCompleted ? 0.2 : 0};
    transition: opacity 0.2s ease;
  }
`;

const Checkbox = styled.div<{ checked: boolean; color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? props.color : '#ddd'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: ${props => props.checked ? props.color : 'transparent'};
  flex-shrink: 0;
  margin-top: 2px;
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    opacity: ${props => props.checked ? 1 : 0};
  }

  &:hover {
    border-color: ${props => props.color};
    background-color: ${props => props.checked ? props.color : props.color + '10'};
  }
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; // For text truncation
`;

const TaskTitle = styled.span<{ completed: boolean }>`
  font-size: 14px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? props.theme.colors.secondary : props.theme.colors.text};
  line-height: 1.4;
`;

const TaskMetadata = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  flex-wrap: wrap;
`;

const MetadataItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: #f5f5f5;
  border-radius: 12px;
  white-space: nowrap;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  ${TaskItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: ${props => props.theme.colors.primary};
  }
`;

const CategoryBadge = styled.span<{ color: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateText = styled.p`
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.small};
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  width: fit-content;
  margin: 0 0 ${props => props.theme.spacing.large};

  &:hover {
    background-color: #5000d6;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (editedTask: Task) => void;
  onAddTask: (task: Task) => void;
  categories: { [key: string]: { color: string; name: string; icon: string } };
  showCategory?: boolean;
  currentCategory?: string;
  onAddCategory?: (newCategory: Omit<Category, 'id'>) => Category;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask,
  onEditTask,
  onAddTask,
  categories,
  showCategory = true,
  currentCategory,
  onAddCategory
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const today = new Date();

  const handleEditSave = (editedTask: Task) => {
    onEditTask(editedTask);
    setEditingTaskId(null);
  };

  const handleAddSave = (newTask: Task) => {
    onAddTask(newTask);
    setIsAddingTask(false);
  };

  return (
    <>
      <Modal
        isOpen={editingTaskId !== null}
        onClose={() => setEditingTaskId(null)}
        title="Edit Task"
      >
        {editingTaskId && (
          <EditTask
            task={tasks.find(t => t.id === editingTaskId)!}
            categories={Object.entries(categories).map(([id, cat]) => ({
              id,
              name: cat.name,
              color: cat.color,
              icon: cat.icon
            }))}
            onSave={handleEditSave}
            onCancel={() => setEditingTaskId(null)}
            onAddCategory={onAddCategory}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        title="Add New Task"
      >
        <EditTask
          task={{
            id: '',
            title: '',
            completed: false,
            categoryId: currentCategory || Object.keys(categories)[0],
            recurrence: {
              frequency: 'daily',
              interval: 1,
              startDate: new Date().toISOString().split('T')[0]
            }
          }}
          categories={Object.entries(categories).map(([id, cat]) => ({
            id,
            name: cat.name,
            color: cat.color,
            icon: cat.icon
          }))}
          onSave={handleAddSave}
          onCancel={() => setIsAddingTask(false)}
          onAddCategory={onAddCategory}
        />
      </Modal>

      <AddTaskButton onClick={() => setIsAddingTask(true)}>
        <span>＋</span> Add Recurring Task
      </AddTaskButton>

      <TaskListContainer>
        {tasks.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📝</EmptyStateIcon>
            <EmptyStateTitle>No tasks to show</EmptyStateTitle>
            <EmptyStateText>
              Add some recurring tasks to get started
            </EmptyStateText>
          </EmptyState>
        ) : (
          tasks.map(task => {
            const isCompleted = isTaskCompletedOn(task, today);

            return (
              <TaskItem 
                key={task.id} 
                categoryColor={categories[task.categoryId]?.color || '#ddd'}
                isCompleted={isCompleted}
                onClick={() => setEditingTaskId(task.id)}
              >
                <Checkbox
                  checked={isCompleted}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  color={categories[task.categoryId]?.color || '#ddd'}
                />
                <TaskContent>
                  <TaskTitle completed={isCompleted}>
                    {task.title}
                  </TaskTitle>
                  <TaskMetadata>
                    {showCategory && (
                      <CategoryBadge color={categories[task.categoryId]?.color || '#ddd'}>
                        {categories[task.categoryId]?.icon}
                        {categories[task.categoryId]?.name}
                      </CategoryBadge>
                    )}
                    <MetadataItem>
                      🔄 {getRecurrenceDescription(task.recurrence)}
                    </MetadataItem>
                    {task.estimatedMinutes && (
                      <MetadataItem>
                        ⌛ {task.estimatedMinutes} min
                      </MetadataItem>
                    )}
                  </TaskMetadata>
                </TaskContent>
                <TaskActions onClick={(e) => e.stopPropagation()}>
                  <ActionButton onClick={() => onDeleteTask(task.id)} title="Delete task">
                    ×
                  </ActionButton>
                </TaskActions>
              </TaskItem>
            );
          })
        )}
      </TaskListContainer>
    </>
  );
};

export default TaskList; 