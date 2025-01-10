import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import PlatformSwitcher from '.';
import React from 'react';

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

const mockOptions = [
  {
    name: 'Wallet',
    description: 'Secure, non-custodial wallet',
    url: '/wallet',
    private: true,
  },
  {
    name: 'Explorer',
    description: 'Network activity and statistics',
    url: '/explorer',
    private: true,
  },
];

describe('PlatformSwitcher', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders with initial active app', () => {
    render(
      <PlatformSwitcher
        options={mockOptions}
        onSelect={onSelect}
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
        onSelect={onSelect}
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
        onSelect={onSelect}
        activeApp="Wallet"
      />
    );
    expect(screen.getByTestId('camino-logo')).toBeInTheDocument();
  });
});
