import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>Welcome to Our React App</Title>
      <Description>
        This is a modern React application built with TypeScript, React Router, and styled-components.
        Feel free to explore and modify it according to your needs!
      </Description>
    </HomeContainer>
  );
};

export default Home; 