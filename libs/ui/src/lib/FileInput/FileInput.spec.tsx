import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import FileInput from './index';

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

describe('FileInput', () => {
  it('renders correctly', () => {
    render(<FileInput placeholder="Select file..." />);
    expect(screen.getByText('Select file...')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<FileInput label="Upload File" />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<FileInput label="Upload File" required />);
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<FileInput error="Invalid file" />);
    expect(screen.getByText('Invalid file')).toBeInTheDocument();
  });

  it('displays help text', () => {
    render(<FileInput helpText="Help message" />);
    expect(screen.getByText('Help message')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    const handleChange = jest.fn();
    render(<FileInput onChange={handleChange} />);

    const file = new File(['test'], 'test.json', { type: 'application/json' });
    const input = screen.getByLabelText('Select file...');

    fireEvent.change(input, { target: { files: [file] } });
    expect(handleChange).toHaveBeenCalledWith(file);
  });
});
