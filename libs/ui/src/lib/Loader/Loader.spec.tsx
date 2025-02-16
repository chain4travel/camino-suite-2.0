import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loader } from './index';

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

describe('Loader', () => {
  it('renders loader with default props', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loader');

    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('w-6 h-6');
    expect(loader).toHaveClass('border-blue-500');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Loader size="sm" />);
    expect(screen.getByTestId('loader')).toHaveClass('w-4 h-4');

    rerender(<Loader size="md" />);
    expect(screen.getByTestId('loader')).toHaveClass('w-6 h-6');

    rerender(<Loader size="lg" />);
    expect(screen.getByTestId('loader')).toHaveClass('w-8 h-8');

    rerender(<Loader size="xl" />);
    expect(screen.getByTestId('loader')).toHaveClass('w-12 h-12');
  });

  it('applies different colors correctly', () => {
    const { rerender } = render(<Loader color="primary" />);
    expect(screen.getByTestId('loader')).toHaveClass('border-blue-500');

    rerender(<Loader color="secondary" />);
    expect(screen.getByTestId('loader')).toHaveClass('border-slate-500');

    rerender(<Loader color="white" />);
    expect(screen.getByTestId('loader')).toHaveClass('border-white');
  });

  it('applies custom className correctly', () => {
    render(<Loader className="custom-class" />);
    expect(screen.getByTestId('loader')).toHaveClass('custom-class');
  });

  it('has correct ARIA attributes', () => {
    render(<Loader />);
    const loader = screen.getByTestId('loader');

    expect(loader).toHaveAttribute('role', 'status');
    expect(loader).toHaveAttribute('aria-label', 'Loading');
  });
});
