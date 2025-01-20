import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import AccessOption  from '.';
import React from 'react'
import { mdiKey } from '@mdi/js';

describe('AccessOption', () => {
  it('renders with provided text', () => {
    render(<AccessOption icon={mdiKey} text="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<AccessOption icon={mdiKey} text="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <AccessOption icon={mdiKey} text="Test" className="test-class" />
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('forwards additional props to button element', () => {
    render(<AccessOption icon={mdiKey} text="Test" data-testid="test-button" />);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<AccessOption icon={mdiKey} text="Test" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <AccessOption icon={mdiKey} text="Test" onClick={handleClick} disabled />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
