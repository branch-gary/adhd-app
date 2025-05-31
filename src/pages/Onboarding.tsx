import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Category, Task } from '../types';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.large};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
`;

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xlarge};
  max-width: 600px;
  width: 100%;
  box-shadow: ${props => props.theme.shadows.large};
  color: ${props => props.theme.colors.text};
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxlarge};
  margin-bottom: ${props => props.theme.spacing.large};
  color: ${props => props.theme.colors.primary};
  text-align: center;
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSize.large};
  line-height: ${props => props.theme.typography.lineHeight.large};
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xlarge};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.large};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.typography.fontSize.medium};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  background-color: ${props => props.variant === 'primary' ? props.theme.colors.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.typography.fontSize.medium};
  margin-bottom: ${props => props.theme.spacing.medium};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.typography.fontSize.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.large};
  gap: ${props => props.theme.spacing.small};
`;

const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.secondary};
  opacity: ${props => props.active ? 1 : 0.5};
  transition: all ${props => props.theme.transitions.fast};
`;

interface OnboardingProps {
  onComplete: (category: Category, task: Task) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskFrequency, setTaskFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Create category and task
      const category: Omit<Category, 'id'> = {
        name: categoryName,
        color: '#6200EA', // Using primary color
        icon: '📋',
        description: 'My first category'
      };

      const task: Omit<Task, 'id'> = {
        title: taskName,
        categoryId: '', // Will be set by the parent component
        completed: false,
        recurrence: {
          frequency: taskFrequency,
          interval: 1,
          startDate: new Date().toISOString().split('T')[0] // Add today as the start date
        },
        estimatedMinutes: 30
      };

      // Save onboarding completion
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Navigate to main app
      onComplete(category as Category, task as Task);
      navigate('/tasks');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Title>Welcome to ADHD Tasks! 🎉</Title>
            <Description>
              We've designed this app specifically for ADHD brains. Let's get you started with a quick tour of the features that will help you stay organized and focused.
            </Description>
          </>
        );
      case 2:
        return (
          <>
            <Title>Create Your First Category 📁</Title>
            <Description>
              Categories help you group similar tasks together. What's one area of your life you'd like to organize?
            </Description>
            <Input
              type="text"
              placeholder="e.g., Work, Home, Health"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              autoFocus
            />
          </>
        );
      case 3:
        return (
          <>
            <Title>Add Your First Task ✅</Title>
            <Description>
              Let's add a task to your new category. Start with something small and achievable!
            </Description>
            <Input
              type="text"
              placeholder="e.g., Check email, Take medication"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              autoFocus
            />
          </>
        );
      case 4:
        return (
          <>
            <Title>Set Task Frequency 🔄</Title>
            <Description>
              How often do you want to do this task?
            </Description>
            <Select
              value={taskFrequency}
              onChange={(e) => setTaskFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingContainer>
      <Card>
        <ProgressDots>
          {[...Array(totalSteps)].map((_, i) => (
            <Dot key={i} active={i + 1 === step} />
          ))}
        </ProgressDots>
        {renderStep()}
        <ButtonContainer>
          <Button
            onClick={handleBack}
            disabled={step === 1}
            variant="secondary"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={(step === 2 && !categoryName) || (step === 3 && !taskName)}
            variant="primary"
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
          </Button>
        </ButtonContainer>
      </Card>
    </OnboardingContainer>
  );
};

export default Onboarding; 