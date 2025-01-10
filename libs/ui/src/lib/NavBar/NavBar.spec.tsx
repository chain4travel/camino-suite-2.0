import '@testing-library/jest-dom';

import NavBar from '.';
import React from 'react';
import { render } from '@testing-library/react';

// Mock PlatformSwitcher
jest.mock('../PlatformSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-switcher">PlatformSwitcher</div>,
}));

// Mock CaminoLogo


describe('NavBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavBar />);
    expect(baseElement).toBeTruthy();
  });

  it('should render platform switcher', () => {
    const { getByTestId } = render(<NavBar />);
    expect(getByTestId('platform-switcher')).toBeInTheDocument();
  });
});
