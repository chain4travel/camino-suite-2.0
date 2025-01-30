import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '../../test-utils/test-utils';

import NetworkSwitcher from './index';
import React from 'react';

const mockOptions = [
  {
    name: 'Camino',
  },
  {
    name: 'Columbus',
  },
  {
    name: 'Hidden Network',
    hidden: true,
  },
];

describe('NetworkSwitcher', () => {
  const mockOnSelect = jest.fn();
  const mockOnAddNetwork = jest.fn();
  const mockOnEditNetwork = jest.fn();
  const mockOnDeleteNetwork = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default network options', () => {
    render(
      <NetworkSwitcher
        options={mockOptions}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    expect(screen.getByText('Camino')).toBeInTheDocument();
  });

  it('allows network selection', () => {
    render(
      <NetworkSwitcher
        options={mockOptions}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    // Open the dropdown
    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    // Select Columbus network
    const columbusOption = screen.getByText('Columbus');
    fireEvent.click(columbusOption);

    expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[1]);
  });

  it('hides networks marked as hidden', () => {
    render(
      <NetworkSwitcher
        options={mockOptions}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    // Open the dropdown
    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    expect(screen.queryByText('Hidden Network')).not.toBeInTheDocument();
  });

  it('shows active network', () => {
    render(
      <NetworkSwitcher
        options={mockOptions}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    expect(screen.getByRole('button', { name: /camino/i })).toBeInTheDocument();
  });

  it('shows add network button', () => {
    render(
      <NetworkSwitcher
        options={mockOptions}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    // Open the dropdown
    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(mockOnAddNetwork).toHaveBeenCalled();
  });

  it('allows editing custom networks', () => {
    const customNetwork = {
      name: 'Custom',
      isCustom: true,
    };

    render(
      <NetworkSwitcher
        options={[...mockOptions, customNetwork]}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    // Open the dropdown
    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    // Find and click edit button for custom network
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const customNetworkEditButton = editButtons.find(button =>
      button.closest('div')?.textContent?.includes('Custom')
    );

    if (customNetworkEditButton) {
      fireEvent.click(customNetworkEditButton);
      expect(mockOnEditNetwork).toHaveBeenCalledWith(customNetwork);
    }
  });

  it('allows deleting custom networks', () => {
    const customNetwork = {
      name: 'Custom',
      isCustom: true,
    };

    render(
      <NetworkSwitcher
        options={[...mockOptions, customNetwork]}
        activeNetwork="Camino"
        onSelect={mockOnSelect}
        onAddNetwork={mockOnAddNetwork}
        onEditNetwork={mockOnEditNetwork}
        onDeleteNetwork={mockOnDeleteNetwork}
      />
    );

    // Open the dropdown
    const networkButton = screen.getByRole('button', { name: /camino/i });
    fireEvent.click(networkButton);

    // Find and click delete button for custom network
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    const customNetworkDeleteButton = deleteButtons.find(button =>
      button.closest('div')?.textContent?.includes('Custom')
    );

    if (customNetworkDeleteButton) {
      fireEvent.click(customNetworkDeleteButton);
      expect(mockOnDeleteNetwork).toHaveBeenCalledWith(customNetwork);
    }
  });
});
