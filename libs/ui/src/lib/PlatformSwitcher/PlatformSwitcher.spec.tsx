import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';

import PlatformSwitcher from './index';
import React from 'react';
import { OptionType } from './PlatformSwitcher.types';


// Mock all dependencies before importing the component
jest.mock('@mdi/js', () => ({
  mdiChevronDown: 'mocked-icon-path',
}));

jest.mock('@mdi/react', () => ({
  Icon: () => <span>Icon</span>,
}));

jest.mock('../../logos/CaminoLogo', () => ({
  __esModule: true,
  default: () => <div data-testid="camino-logo">Logo</div>,
}));

jest.mock('../Typography', () => ({
  __esModule: true,
  default: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid={`typography-${variant}`}>{children}</span>
  ),
}));

jest.mock('../Dropdown', () => ({
  __esModule: true,
  default: ({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="dropdown">
      <div data-testid="dropdown-trigger">{trigger}</div>
      <div data-testid="dropdown-content">{children}</div>
    </div>
  ),
}));

// Fix MenuItem mock with proper typing
jest.mock('@headlessui/react', () => ({
  MenuItem: ({ children }: { children: ({ active }: { active: boolean }) => React.ReactNode }) => {
    return children({ active: false });
  },
}));

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PlatformSwitcher', () => {
  const mockOptions: OptionType[] = [
    {
      name: 'Wallet',
      url: '/wallet',
      description: 'Wallet Description',
      private: false,
    },
    {
      name: 'Explorer',
      url: '/explorer',
      description: 'Explorer Description',
      private: false,
    },
  ];

  const mockOnSelect = jest.fn();

  it('renders correctly with options', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        activeApp="Wallet"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByTestId('typography-h3')).toHaveTextContent('Wallet');
  });

  it('calls onSelect when an option is clicked', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        activeApp="Wallet"
        onSelect={mockOnSelect}
      />
    );

    const menuItems = screen.getAllByTestId('typography-h6');
    const explorerOption = menuItems.find(item => item.textContent === 'Explorer');
    fireEvent.click(explorerOption!);
    expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[1]);
  });

  it('shows active app correctly', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        activeApp="Explorer"
        onSelect={mockOnSelect}
      />
    );

    const activeElement = screen.getByTestId('typography-h3');
    expect(activeElement).toHaveTextContent('Explorer');
  });

  it('renders with initial active app', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        onSelect={mockOnSelect}
        activeApp="Wallet"
      />
    );
    const headerText = screen.getByTestId('typography-h3');
    expect(headerText).toHaveTextContent('Wallet');
  });

  it('shows dropdown content', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        onSelect={mockOnSelect}
        activeApp="Wallet"
      />
    );
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    const menuItems = screen.getAllByTestId('typography-h6');
    expect(menuItems[1]).toHaveTextContent('Explorer');
  });

  it('renders with CaminoLogo', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        onSelect={mockOnSelect}
        activeApp="Wallet"
      />
    );
    expect(screen.getByTestId('camino-logo')).toBeInTheDocument();
  });
});
