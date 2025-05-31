import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const Choice = styled.button`
  padding: ${props => props.theme.spacing.large};
  background: white;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.medium};

  &:hover {
    background: ${props => props.theme.colors.background};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ChoiceIcon = styled.span`
  font-size: 24px;
`;

const ChoiceContent = styled.div`
  flex: 1;
`;

const ChoiceTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.large};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const ChoiceDescription = styled.p`
  margin: ${props => props.theme.spacing.small} 0 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.medium};
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.medium};
  right: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.circle};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (choice: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if this is the first time loading the app
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setProgress(0);
    } else {
      setProgress(100);
    }
  }, []);

  const handleChoice = (choice: string) => {
    localStorage.setItem('onboardingCompleted', 'true');
    setProgress(100);
    onComplete(choice);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Your ADHD-Friendly Task Manager!"
    >
      <ProgressIndicator>{progress}% Complete</ProgressIndicator>
      <ChoiceContainer>
        <Choice onClick={() => handleChoice('easy')}>
          <ChoiceIcon>🌱</ChoiceIcon>
          <ChoiceContent>
            <ChoiceTitle>Start with something easy</ChoiceTitle>
            <ChoiceDescription>
              Begin with a simple daily task to build momentum and confidence.
            </ChoiceDescription>
          </ChoiceContent>
        </Choice>

        <Choice onClick={() => handleChoice('plan')}>
          <ChoiceIcon>🎯</ChoiceIcon>
          <ChoiceContent>
            <ChoiceTitle>Help me build my plan</ChoiceTitle>
            <ChoiceDescription>
              Get guided assistance in creating a structured task system that works for you.
            </ChoiceDescription>
          </ChoiceContent>
        </Choice>

        <Choice onClick={() => handleChoice('skip')}>
          <ChoiceIcon>⚡</ChoiceIcon>
          <ChoiceContent>
            <ChoiceTitle>Skip to my list</ChoiceTitle>
            <ChoiceDescription>
              Jump right in and start organizing your tasks your way.
            </ChoiceDescription>
          </ChoiceContent>
        </Choice>
      </ChoiceContainer>
    </Modal>
  );
};

export default OnboardingModal; 