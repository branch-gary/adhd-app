import React from 'react';
import styled from 'styled-components';
import { Category } from '../types';

const SidebarContainer = styled.aside`
  background-color: #fafafa;
  border-right: 1px solid #ebebeb;
  padding: 0;
  width: 305px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 24px ${props => props.theme.spacing.medium};
  border-bottom: 1px solid #ebebeb;
`;

const AppTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🎯';
    font-size: 24px;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.medium};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
    
    &:hover {
      background-color: #ccc;
    }
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li<{ isSelected: boolean; color: string }>`
  padding: 8px 16px;
  margin: 2px 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.isSelected ? '#ffffff' : '#202020'};
  background-color: ${props => props.isSelected ? props.color : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? props.color : '#eee'};
    transform: translateX(2px);
  }
`;

const CategoryIcon = styled.span`
  margin-right: 12px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const CategoryCount = styled.span`
  margin-left: auto;
  font-size: 12px;
  opacity: 0.7;
  background: ${props => props.theme.colors.background};
  padding: 2px 8px;
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
`;

const ViewSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const SectionTitle = styled.h2`
  font-size: 12px;
  text-transform: uppercase;
  color: #808080;
  margin: 24px 0 8px 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.medium};
  border-top: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: 1px solid ${props => props.isActive ? props.theme.colors.primary : '#ddd'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isActive ? props.theme.colors.primary + '10' : '#f5f5f5'};
  }
`;

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categories: Category[];
  taskCounts?: { [key: string]: number };
  showCompletedTasks: boolean;
  onToggleCompletedTasks: () => void;
}

const defaultViews = [
  { 
    id: 'today', 
    name: 'Today', 
    icon: '📅',
    color: '#058527'
  },
  { 
    id: 'upcoming', 
    name: 'Upcoming', 
    icon: '📆',
    color: '#246fe0'
  },
  { 
    id: 'all', 
    name: 'All Tasks', 
    icon: '📋',
    color: '#246fe0'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  categories,
  taskCounts = {},
  showCompletedTasks,
  onToggleCompletedTasks
}) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <AppTitle>ADHD Tasks</AppTitle>
      </SidebarHeader>
      
      <SidebarContent>
        <ViewSection>
          {defaultViews.map(view => (
            <CategoryItem
              key={view.id}
              isSelected={selectedCategory === view.id}
              onClick={() => onCategorySelect(view.id)}
              color={view.color}
            >
              <CategoryIcon>{view.icon}</CategoryIcon>
              {view.name}
              {taskCounts[view.id] > 0 && (
                <CategoryCount>{taskCounts[view.id]}</CategoryCount>
              )}
            </CategoryItem>
          ))}
        </ViewSection>

        <ViewSection>
          <SectionTitle>Categories</SectionTitle>
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              isSelected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
              color={category.color}
            >
              <CategoryIcon>{category.icon}</CategoryIcon>
              {category.name}
              {taskCounts[category.id] > 0 && (
                <CategoryCount>{taskCounts[category.id]}</CategoryCount>
              )}
            </CategoryItem>
          ))}
        </ViewSection>
      </SidebarContent>

      <SidebarFooter>
        <ToggleButton
          isActive={showCompletedTasks}
          onClick={onToggleCompletedTasks}
        >
          {showCompletedTasks ? '🎯 Hide Completed' : '✨ Show Completed'}
        </ToggleButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 