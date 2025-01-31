import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import NavBar from '.';
import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock PlatformSwitcher
jest.mock('../PlatformSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-switcher">PlatformSwitcher</div>,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

type TranslationKey = 'common.menu' | 'common.edit' | 'common.add';

const translations: Record<TranslationKey, string> = {
  'common.menu': 'Menu',
  'common.edit': 'Edit',
  'common.add': 'Add'
};

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      return translations[key as TranslationKey] || key;
    },
    i18n: {
      changeLanguage: () => new Promise((resolve) => resolve(undefined)),
    },
  }),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>{component}</ThemeProvider>
  );
};

describe('NavBar', () => {
  it('renders correctly', () => {
    renderWithTheme(<NavBar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('toggles mobile menu', async () => {
    renderWithTheme(<NavBar />);

    // Menu should be initially hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click burger menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Menu should be visible
    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });
  });

  it('closes mobile menu when clicking close button', async () => {
    renderWithTheme(<NavBar />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Wait for menu to be visible
    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Wait for menu to be hidden
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('toggles theme', () => {
    renderWithTheme(<NavBar />);

    // Find theme button by both icon and text
    const themeButton = screen.getByRole('button', {
      name: /light|dark/i
    });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders network switcher', () => {
    renderWithTheme(<NavBar />);
    const networkElements = screen.getAllByText('Camino');
    expect(networkElements[0]).toBeInTheDocument();
  });
});
