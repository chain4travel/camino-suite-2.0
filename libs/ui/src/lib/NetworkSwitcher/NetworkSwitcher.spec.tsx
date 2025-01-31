import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { NetworkOption } from './NetworkSwitcher.types';
import NetworkSwitcher from './index';
import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';

const defaultOptions: NetworkOption[] = [
  { name: 'Camino' },
  { name: 'Columbus' },
];

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));


const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>{component}</ThemeProvider>
  );
};

describe('NetworkSwitcher', () => {
  it('renders without crashing', () => {
    const handleSelect = jest.fn();
    renderWithTheme(
      <NetworkSwitcher
        options={defaultOptions}
        onSelect={handleSelect}
        onAddNetwork={() => {
          console.log('add network');
        }}
        onEditNetwork={() => {
          console.log('edit network');
        }}
        onDeleteNetwork={() => {
          console.log('delete network');
        }}
        activeNetwork="Camino"
      />
    );
    expect(screen.getAllByText('Camino')[0]).toBeInTheDocument();
  });

  it('displays the active network', () => {
    const handleSelect = jest.fn();
    renderWithTheme(
      <NetworkSwitcher
        options={defaultOptions}
        onSelect={handleSelect}
        onAddNetwork={() => {
          console.log('add network');
        }}
        onEditNetwork={() => {
          console.log('edit network');
        }}
        onDeleteNetwork={() => {
          console.log('delete network');
        }}
        activeNetwork="Columbus"
      />
    );
    expect(screen.getAllByText('Columbus')[0]).toBeInTheDocument();
  });

  it('calls onSelect when a network is selected', () => {
    const handleSelect = jest.fn();

    renderWithTheme(
      <NetworkSwitcher
        options={defaultOptions}
        onSelect={handleSelect}
        onAddNetwork={() => {
          console.log('add network');
        }}
        onEditNetwork={() => {
          console.log('edit network');
        }}
        onDeleteNetwork={() => {
          console.log('delete network');
        }}
        activeNetwork="Camino"
      />
    );

    // Open the dropdown
    const networkButton = screen.getAllByText('Camino')[0];
    fireEvent.click(networkButton.closest('button') as HTMLElement);

    // Find and click the Columbus option
    const columbusOption = screen.getAllByText('Columbus')[0];
    fireEvent.click(columbusOption.closest('button') as HTMLElement);

    expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Columbus'
    }));
  });

  it('updates when activeNetwork prop changes', () => {
    const handleSelect = jest.fn();

    const { rerender } = renderWithTheme(
      <NetworkSwitcher
      options={defaultOptions}
      onSelect={handleSelect}
      onAddNetwork={() => {
        console.log('add network');
      }}
      onEditNetwork={() => {
        console.log('edit network');
      }}
      onDeleteNetwork={() => {
        console.log('delete network');
      }}
      activeNetwork="Camino"
      />
    );

    expect(screen.getByRole('button', { name: /camino/i })).toBeInTheDocument();

    rerender(
      <NetworkSwitcher
      options={defaultOptions}
      onSelect={handleSelect}
      onAddNetwork={() => {
        console.log('add network');
      }}
      onEditNetwork={() => {
        console.log('edit network');
      }}
      onDeleteNetwork={() => {
        console.log('delete network');
      }}
      activeNetwork="Columbus"
    />
    );

    expect(screen.getByRole('button', { name: /columbus/i })).toBeInTheDocument();
  });

  it('shows add network button when onAddNetwork is provided', () => {
    const handleSelect = jest.fn();
    renderWithTheme(
      <NetworkSwitcher
      options={defaultOptions}
      onSelect={handleSelect}
      onAddNetwork={() => {
        console.log('add network');
      }}
      onEditNetwork={() => {
        console.log('edit network');
      }}
      onDeleteNetwork={() => {
        console.log('delete network');
      }}
      activeNetwork="Camino"
      />
    );

    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    expect(screen.getByText(/Add Custom Network/i)).toBeInTheDocument();
  });
});
