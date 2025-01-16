import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import MnemonicInput from './index';
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

describe('MnemonicInput', () => {
  it('renders all 24 inputs', () => {
    render(<MnemonicInput phrases={Array(24).fill('')} />);
    const inputs = screen.getAllByDisplayValue('');
    expect(inputs).toHaveLength(24);
  });

  it('shows numbers from 1 to 24', () => {
    render(<MnemonicInput phrases={Array(24).fill('')} />);
    for (let i = 1; i <= 24; i++) {
      expect(screen.getByText(`${i}.`)).toBeInTheDocument();
    }
  });

  it('handles phrase changes', () => {
    const handleChange = jest.fn();
    render(<MnemonicInput phrases={Array(24).fill('')} onChange={handleChange} showPhrase />);

    const firstInput = screen.getAllByDisplayValue('')[0];
    fireEvent.change(firstInput, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    render(<MnemonicInput phrases={Array(24).fill('test')} showPhrase={false} />);
    const inputs = screen.getAllByDisplayValue('test');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'password');
    });
  });

});
