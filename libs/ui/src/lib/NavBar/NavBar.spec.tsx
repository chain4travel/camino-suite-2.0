import '@testing-library/jest-dom';

import { render, screen } from '../../test-utils/test-utils';

import NavBar from '.';
import React from 'react';

// Mock PlatformSwitcher
jest.mock('../PlatformSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-switcher">PlatformSwitcher</div>,
}));

// Mock CaminoLogo


describe('NavBar', () => {
  it('renders successfully', () => {
    render(<NavBar />);

    // Basic assertions to verify the component renders
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows mobile menu button on small screens', () => {
    render(<NavBar />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('shows theme toggle button', () => {
    render(<NavBar />);

    const themeButton = screen.getByRole('button', { name: /light|dark/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('shows login link', () => {
    render(<NavBar />);

    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
