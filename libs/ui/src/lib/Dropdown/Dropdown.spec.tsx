import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import Dropdown from './index';
import React from 'react';

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock HeadlessUI components
jest.mock('@headlessui/react', () => ({
  Menu: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="menu" className={className}>{children}</div>
  ),
  MenuButton: ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
    <button data-testid="menu-button" className={className} {...props}>
      {children}
    </button>
  ),
  MenuItems: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="menu-items" className={className}>
      {children}
    </div>
  ),
  MenuItem: ({ children }: { children: ({ active }: { active: boolean }) => React.ReactNode }) =>
    children({ active: false }),
}));

// Mock mdi/js icons
jest.mock('@mdi/js', () => ({
  mdiChevronDown: 'mdiChevronDown',
}));

// Mock Icon with unique data-testids
let iconCounter = 0;
jest.mock('@mdi/react', () => ({
  Icon: ({ path, className }: { path: string; className?: string }) => {
    return (
      <span
        data-testid={`icon-${iconCounter}`}
        data-icon={path}
        className={className}
        role="img"
      />
    );
  },
}));

const mockItems = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2', disabled: true },
  { label: 'Item 3', value: '3', startIcon: 'start-icon' },
  { label: 'Item 4', value: '4', endIcon: 'end-icon' },
];

describe('Dropdown', () => {
  beforeEach(() => {
    iconCounter = 0; // Reset counter before each test
  });

  describe('Rendering', () => {
    it('renders basic dropdown with trigger', () => {
      render(<Dropdown trigger="Test Menu" />);
      expect(screen.getByText('Test Menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    });

    it('renders menu items when provided', () => {
      render(<Dropdown trigger="Menu" items={mockItems} />);
      mockItems.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('renders custom children instead of items', () => {
      render(
        <Dropdown trigger="Custom">
          <div data-testid="custom-content">Custom Content</div>
        </Dropdown>
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles item selection', () => {
      const onSelect = jest.fn();
      render(<Dropdown trigger="Menu" items={mockItems} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('Item 1'));
      expect(onSelect).toHaveBeenCalledWith(mockItems[0]);
    });

    it('does not call onSelect for disabled items', () => {
      const onSelect = jest.fn();
      render(<Dropdown trigger="Menu" items={mockItems} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('Item 2'));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('disables the entire dropdown when disabled prop is true', () => {
      render(<Dropdown trigger="Menu" items={mockItems} disabled />);
      expect(screen.getByTestId('menu-button')).toBeDisabled();
    });
  });

  describe('Styling', () => {

    it('applies custom button className', () => {
      render(<Dropdown trigger="Menu" menuButtonClassName="button-class" endIcon={undefined} />);
      expect(screen.getByTestId('menu-button')).toHaveClass('button-class');
    });

    it('applies custom items className', () => {
      render(<Dropdown trigger="Menu" menuItemsClassName="items-class" endIcon={undefined} />);
      expect(screen.getByTestId('menu-items')).toHaveClass('items-class');
    });
  });

  describe('Custom Rendering', () => {
    it('renders custom item content using renderItem', () => {
      const customItems = [{
        label: 'Custom',
        value: 'custom',
        renderItem: () => <div data-testid="custom-item">Custom Item</div>
      }];

      render(<Dropdown trigger="Menu" items={customItems} />);
      expect(screen.getByTestId('custom-item')).toBeInTheDocument();
    });
  });
});
