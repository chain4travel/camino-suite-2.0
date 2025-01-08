import { render, screen } from '@testing-library/react';

import Input from '.';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Input error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('displays help text when provided', () => {
    render(<Input helpText="Help text" />);
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');

    expect(onChange).toHaveBeenCalled();
  });

  it('applies disabled styles when disabled', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders right icon when provided', () => {
    const iconTestId = 'test-icon';
    render(<Input rightIcon={<div data-testid={iconTestId}>Icon</div>} />);
    expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
  });
});
