import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from './index';
import { ThemeProvider } from '../../context/ThemeContext';

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

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Tooltip', () => {
  it('renders trigger element', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
      { wrapper: TestWrapper }
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
      { wrapper: TestWrapper }
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('applies correct position classes', async () => {
    render(
      <Tooltip content="Tooltip content" position="bottom">
        <button>Hover me</button>
      </Tooltip>,
      { wrapper: TestWrapper }
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('top-full');
    });
  });
}); 