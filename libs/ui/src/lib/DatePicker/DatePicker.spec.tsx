import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';

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

  it('opens calendar on click', () => {
    render(<DatePicker />);
    
    const picker = screen.getByRole('button');
    fireEvent.click(picker);

    expect(screen.getByText('February 2024')).toBeInTheDocument(); // Assumes current date
    expect(screen.getAllByText('M')).toHaveLength(2); // Two M's in weekdays
  });

  it('does not open calendar when disabled', () => {
    render(<DatePicker disabled />);
    
    const picker = screen.getByRole('button');
    fireEvent.click(picker);

    expect(screen.queryByText('February 2024')).not.toBeInTheDocument();
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