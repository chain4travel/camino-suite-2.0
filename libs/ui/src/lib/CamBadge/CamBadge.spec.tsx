import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import CamBadge from '.';
import React from 'react';

// Mock clsx
jest.mock('clsx', () => ({
  __esModule: true,
  default: (...args: unknown[]) => {
    const classes = args.filter(Boolean).map(arg => {
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        return Object.entries(arg as Record<string, boolean>)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return arg;
    });
    return classes.flat().join(' ');
  },
}));

describe('CamBadge', () => {
  it('renders badge with default variant and size', () => {
    render(<CamBadge text="Test Badge" />);
    const badge = screen.getByText(/test badge/i);
    expect(badge).toBeInTheDocument();
  });

  it('renders badge with custom variant', () => {
    render(<CamBadge variant="primary" text="Primary Badge" />);
    const badge = screen.getByText(/primary badge/i);
    expect(badge).toBeInTheDocument();
  });

  it('renders badge with medium size', () => {
    render(<CamBadge text="Medium Badge" size="md" />);
    const badge = screen.getByText(/medium badge/i);
    expect(badge).toBeInTheDocument();
  });

  it('forwards additional props', () => {
    render(<CamBadge text="Test Badge" data-testid="test-badge" />);
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });
});
