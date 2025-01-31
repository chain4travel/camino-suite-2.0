import type { Meta, StoryObj } from '@storybook/react';

import { NetworkOption } from './NetworkSwitcher.types';
import NetworkSwitcher from '.';

const meta: Meta<typeof NetworkSwitcher> = {
  component: NetworkSwitcher,
  title: 'Components/NetworkSwitcher',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NetworkSwitcher>;

const networks = [
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

export const Default: Story = {
  args: {
    options: networks,
    activeNetwork: 'Camino',
    onSelect: (network: NetworkOption) => {
      console.log('Selected network:', network);
    },
    onAddNetwork: () => {
      console.log('Add network clicked');
    },
    onEditNetwork: (network: NetworkOption) => {
      console.log('Edit network:', network);
    },
    onDeleteNetwork: (network: NetworkOption) => {
      console.log('Delete network:', network);
    },
  },
};

export const WithHiddenOption: Story = {
  args: {
    options: [
      ...networks,
      {
        name: 'Hidden Network',
        description: 'This network is hidden',
        hidden: true
      }
    ],
    activeNetwork: 'Camino',
    onSelect: (network: NetworkOption) => {
      console.log('Selected network:', network);
    },
    onAddNetwork: () => {
      console.log('Add network clicked');
    },
    onEditNetwork: (network: NetworkOption) => {
      console.log('Edit network:', network);
    },
    onDeleteNetwork: (network: NetworkOption) => {
      console.log('Delete network:', network);
    },
  },
};
