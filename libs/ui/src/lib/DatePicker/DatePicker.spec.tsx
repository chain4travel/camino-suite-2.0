import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DatePicker } from './DatePicker';
import React from 'react'

// Mock clsx
jest.mock('clsx', () => {
  const clsxFn = (...args: unknown[]) => {
    const classes = args.filter(Boolean).map((arg) => {
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        return Object.entries(arg as Record<string, boolean>)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return arg;
    });
    return classes.flat().join(' ');
  };

  return {
    __esModule: true,
    default: clsxFn,
    clsx: clsxFn,
  };
});

describe('DatePicker', () => {
  it('renders with label and description', () => {
    render(
      <DatePicker
        label="Test Label"
        description="Test Description"
        placeholder="Select date"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    const testDate = new Date('2025-02-20T18:28:00');
    render(<DatePicker value={testDate} />);

    expect(screen.getByText('Feb 20, 2025, 6:28 PM')).toBeInTheDocument();
  });



  it('calls onChange when date is selected', () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} />);
    
    const picker = screen.getByRole('button');
    fireEvent.click(picker);

    const dayButton = screen.getByText('15');
    fireEvent.click(dayButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<DatePicker className="custom-class" />);
    expect(screen.getByTestId('datepicker')).toHaveClass('custom-class');
  });
}); 