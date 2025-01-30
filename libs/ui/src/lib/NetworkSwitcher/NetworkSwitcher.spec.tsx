import { fireEvent, render, screen } from '@testing-library/react';

import { NetworkOption } from './NetworkSwitcher.types';
import NetworkSwitcher from './index';
import React from 'react';

describe('NetworkSwitcher', () => {
  const mockNetworks: NetworkOption[] = [
    {
      name: 'Camino',
      description: 'Camino Mainnet'
    },
    {
      name: 'Columbus',
      description: 'Columbus Testnet'
    },
    {
      name: 'Kopernikus',
      description: 'Kopernikus Testnet'
    }
  ];

  const mockOnSelect = jest.fn();
  const mockOnAddNetwork = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnAddNetwork.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <NetworkSwitcher
        options={mockNetworks}
        onSelect={mockOnSelect}
        activeNetwork="Camino"
        onAddNetwork={mockOnAddNetwork}
      />
    );
    expect(screen.getByText('Camino')).toBeInTheDocument();
  });

  it('displays the active network', () => {
    render(
      <NetworkSwitcher
        options={mockNetworks}
        onSelect={mockOnSelect}
        activeNetwork="Columbus"
        onAddNetwork={mockOnAddNetwork}
      />
    );
    expect(screen.getByText('Columbus')).toBeInTheDocument();
  });

  it('filters out hidden networks', () => {
    const networksWithHidden = [
      ...mockNetworks,
      {
        name: 'Hidden Network',
        description: 'This should not show',
        hidden: true
      }
    ];

    render(
      <NetworkSwitcher
        options={networksWithHidden}
        onSelect={mockOnSelect}
        activeNetwork="Camino"
        onAddNetwork={mockOnAddNetwork}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText('Camino'));

    expect(screen.queryByText('Hidden Network')).not.toBeInTheDocument();
  });

  it('calls onSelect when a network is selected', () => {
    render(
      <NetworkSwitcher
        options={mockNetworks}
        onSelect={mockOnSelect}
        activeNetwork="Camino"
        onAddNetwork={mockOnAddNetwork}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText('Camino'));

    // Click on Columbus
    fireEvent.click(screen.getByText('Columbus'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockNetworks[1]);
  });

  it('updates when activeNetwork prop changes', () => {
    const { rerender } = render(
      <NetworkSwitcher
        options={mockNetworks}
        onSelect={mockOnSelect}
        activeNetwork="Camino"
        onAddNetwork={mockOnAddNetwork}
      />
    );

    expect(screen.getByText('Camino')).toBeInTheDocument();

    rerender(
      <NetworkSwitcher
        options={mockNetworks}
        onSelect={mockOnSelect}
        activeNetwork="Columbus"
        onAddNetwork={mockOnAddNetwork}
      />
    );

    expect(screen.getByText('Columbus')).toBeInTheDocument();
  });
});
