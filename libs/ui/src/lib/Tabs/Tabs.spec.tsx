import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs } from './index';
import { mdiHome, mdiAccount } from '@mdi/js';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock clsx
jest.mock('clsx', () => {
  const clsxFn = (...args: unknown[]) => {
    const classes = args.filter(Boolean).map(arg => {
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        return Object.entries(arg as Record<string, boolean>)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return arg;
    });
    return classes.flat().join(' ');
  };
  
  return {
    __esModule: true,
    default: clsxFn,
    clsx: clsxFn
  };
});

jest.mock('@mdi/react', () => ({
  Icon: () => <svg data-testid="mock-icon" />,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Tabs', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' },
    ],
    activeTab: 'tab1',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all tabs', () => {
    render(<Tabs {...defaultProps} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('applies active styles to the active tab', () => {
    render(<Tabs {...defaultProps} />, { wrapper: TestWrapper });
    
    const activeTab = screen.getByText('Tab 1').closest('button');
    const inactiveTab = screen.getByText('Tab 2').closest('button');

    expect(activeTab).toHaveClass('after:bg-blue-500');
    expect(inactiveTab).not.toHaveClass('after:bg-blue-500');
  });

  it('calls onChange when clicking a tab', () => {
    render(<Tabs {...defaultProps} />, { wrapper: TestWrapper });
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(mockOnChange).toHaveBeenCalledWith('tab2');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders disabled tab correctly', () => {
    const tabsWithDisabled = [
      ...defaultProps.tabs,
      { id: 'tab4', label: 'Tab 4', disabled: true },
    ];

    render(
      <Tabs {...defaultProps} tabs={tabsWithDisabled} />,
      { wrapper: TestWrapper }
    );
    
    const disabledTab = screen.getByText('Tab 4').closest('button');
    expect(disabledTab).toBeDisabled();
    expect(disabledTab).toHaveClass('opacity-50');
    
    fireEvent.click(disabledTab as HTMLElement);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders tabs with icons', () => {
    const tabsWithIcons = [
      { id: 'home', label: 'Home', icon: mdiHome },
      { id: 'profile', label: 'Profile', icon: mdiAccount },
    ];

    render(
      <Tabs
        {...defaultProps}
        variant="icon"
        tabs={tabsWithIcons}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-icon')).toHaveLength(2);
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(
      <Tabs {...defaultProps} size="sm" />,
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('Tab 1').closest('button')).toHaveClass('px-2 py-2');

    rerender(<Tabs {...defaultProps} size="md" />);
    expect(screen.getByText('Tab 1').closest('button')).toHaveClass('px-3 py-2.5');

    rerender(<Tabs {...defaultProps} size="lg" />);
    expect(screen.getByText('Tab 1').closest('button')).toHaveClass('px-4 py-3');
  });

  it('applies full width style when fullWidth is true', () => {
    render(
      <Tabs {...defaultProps} fullWidth />,
      { wrapper: TestWrapper }
    );
    
    const container = screen.getByRole('tablist');
    const tabs = container.querySelectorAll('button');
    
    expect(container.className).toContain('w-full');
    tabs.forEach(tab => {
      expect(tab.className).toContain('flex-1');
    });
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-test-class';
    render(
      <Tabs {...defaultProps} className={customClass} />,
      { wrapper: TestWrapper }
    );
    
    const container = screen.getByRole('tablist');
    expect(container).toHaveClass(customClass);
  });

  it('handles empty tabs array gracefully', () => {
    render(
      <Tabs {...defaultProps} tabs={[]} />,
      { wrapper: TestWrapper }
    );
    
    const container = screen.getByTestId('tabs-container');
    expect(container.children).toHaveLength(0);
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <Tabs {...defaultProps} variant="default" />,
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByRole('tablist')).toHaveClass('flex');

    rerender(<Tabs {...defaultProps} variant="icon" />);
    expect(screen.getByRole('tablist')).toHaveClass('flex');
  });
}); 