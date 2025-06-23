// Now we can import everything else
import '@testing-library/jest-dom';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import NavBar from '.';

// Mock React first, before any imports
const mockSetState = jest.fn();
const mockUseState = jest
  .fn()
  .mockImplementation((init) => [init, mockSetState]);

// Add type augmentation for jest-dom
interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
}

declare global {
  interface Matchers<R> extends CustomMatchers<R> {}
}

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

// Mock dependencies
jest.mock('../PlatformSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-switcher">PlatformSwitcher</div>,
}));

jest.mock('../NetworkSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="network-switcher">NetworkSwitcher</div>,
}));

jest.mock('./LoggedInNav', () => ({
  __esModule: true,
  default: ({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) => (
    <div data-testid="logged-in-nav">
      <button onClick={onMobileMenuOpen} aria-label="menu">
        Menu
      </button>
    </div>
  ),
}));

jest.mock('./LoggedOutNav', () => ({
  __esModule: true,
  default: ({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) => (
    <div data-testid="logged-out-nav">
      <button onClick={onMobileMenuOpen} aria-label="menu">
        Menu
      </button>
    </div>
  ),
}));

jest.mock('./ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

jest.mock('@headlessui/react', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => children,
  DialogPanel: ({ children }: { children: React.ReactNode }) => children,
  Transition: ({ children }: { children: React.ReactNode }) => children,
  TransitionChild: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('./Drawer', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div role="dialog" data-testid="mobile-menu">
        <button onClick={onClose}>Close</button>
        Menu Content
      </div>
    ) : null,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/wallet',
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithTheme = (
  component: React.ReactElement
): ReturnType<typeof render> => {
  return render(component);
};

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseState.mockReset();
  });

  const setupMockState = (isAuthenticated = true, setIsMobileMenuOpen = mockSetState) => {
    // Clear any previous mock implementations
    mockUseState.mockReset();
    
    // Set up new mock implementations
    return mockUseState
      .mockImplementationOnce(() => [isAuthenticated, mockSetState]) // isAuthenticated
      .mockImplementationOnce(() => [false, mockSetState]) // isNetworkModalOpen
      .mockImplementationOnce(() => [false, setIsMobileMenuOpen]) // isMobileMenuOpen
      .mockImplementationOnce(() => [null, mockSetState]) // editingNetwork
      .mockImplementationOnce(() => [[], mockSetState]) // customNetworks
      .mockImplementationOnce(() => [null, mockSetState]) // activeNetwork
      .mockImplementationOnce(() => ['P-cami...enkl8', mockSetState]); // walletAddress
  };

  it('renders platform switcher', () => {
    setupMockState();
    renderWithTheme(<NavBar />);
    expect(screen.getByTestId('platform-switcher')).toBeInTheDocument();
  });

  it('renders network switcher', () => {
    setupMockState();
    renderWithTheme(<NavBar />);
    expect(screen.getByTestId('network-switcher')).toBeInTheDocument();
  });

  it('renders logged in nav when authenticated', () => {
    setupMockState(true);
    renderWithTheme(<NavBar />);
    expect(screen.getByTestId('logged-in-nav')).toBeInTheDocument();
  });

});
