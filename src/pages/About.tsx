import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Content = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  line-height: 1.5;
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>About Us</Title>
      <Content>
        <p>
          This is an example React application that demonstrates the use of modern web development tools
          and practices, including:
        </p>
        <ul>
          <li>React with TypeScript for type-safe development</li>
          <li>React Router for navigation</li>
          <li>styled-components for component-based styling</li>
          <li>Responsive design principles</li>
        </ul>
      </Content>
    </AboutContainer>
  );
};

export default About; 