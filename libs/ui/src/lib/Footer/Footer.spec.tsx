import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Footer from '.';
import React from 'react';

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise((resolve) => resolve(undefined)),
    },
  }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('Footer', () => {
  it('renders successfully', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays copyright text', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });


  it('renders with correct styling', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    const classes = footer.className.split(' ');
    expect(classes).toContain('w-full');
    expect(classes).toContain('px-6');
    expect(classes).toContain('py-10');
    expect(classes).toContain('border-t');
    expect(classes).toContain('border-slate-400');
    expect(classes).toContain('bg-white');
    expect(classes).toContain('text-black');
  });

});
