import React from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.small};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CalendarStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${props => props.theme.spacing.small};
`;

const DateButton = styled.button<{ isSelected: boolean; isToday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => 
    props.isSelected ? props.theme.colors.primary : 
    props.isToday ? props.theme.colors.primary + '10' : 
    'transparent'
  };
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => 
      props.isSelected ? props.theme.colors.primary : 
      props.theme.colors.primary + '20'
    };
  }
`;

const DayName = styled.span<{ isToday: boolean; isSelected: boolean }>`
  font-size: 12px;
  font-weight: ${props => props.isToday || props.isSelected ? 600 : 400};
  margin-bottom: 4px;
  opacity: ${props => props.isSelected ? 1 : 0.8};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
`;

const DateNumber = styled.span<{ isToday: boolean; isSelected: boolean }>`
  font-size: 18px;
  font-weight: ${props => props.isToday || props.isSelected ? 600 : 500};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
`;

const MonthLabel = styled.span<{ isSelected: boolean }>`
  font-size: 12px;
  opacity: ${props => props.isSelected ? 1 : 0.7};
  margin-top: 4px;
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
`;

interface HorizontalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  selectedDate,
  onDateSelect
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDayName = (date: Date) => {
    const isToday = date.getTime() === today.getTime();
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatMonthLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
  };

  const isSelected = (date: Date) => {
    return date.getTime() === selectedDate.getTime();
  };

  return (
    <CalendarContainer>
      <CalendarStrip>
        {dates.map(date => (
          <DateButton
            key={date.toISOString()}
            isSelected={isSelected(date)}
            isToday={isToday(date)}
            onClick={() => onDateSelect(date)}
          >
            <DayName isToday={isToday(date)} isSelected={isSelected(date)}>
              {formatDayName(date)}
            </DayName>
            <DateNumber isToday={isToday(date)} isSelected={isSelected(date)}>
              {date.getDate()}
            </DateNumber>
            <MonthLabel isSelected={isSelected(date)}>
              {formatMonthLabel(date)}
            </MonthLabel>
          </DateButton>
        ))}
      </CalendarStrip>
    </CalendarContainer>
  );
};

export default HorizontalCalendar; 