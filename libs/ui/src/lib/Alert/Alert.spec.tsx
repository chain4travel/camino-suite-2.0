import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Alert from './Alert';
import React from 'react';

describe('Alert', () => {
  it('renders alert with default variant', () => {
    render(
      <Alert description="Test message" />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders alert with title', () => {
    render(
      <Alert title="Test Title" description="Test message" />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies correct classes for different variants', () => {
    const { rerender } = render(
      <Alert variant="positive" description="Test message" />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-successDark-5');

    rerender(
      <Alert variant="warning" description="Test message" />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-warning-5');
  });
});
