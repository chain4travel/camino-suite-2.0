import type { Meta, StoryObj } from '@storybook/react';

import PlatformSwitcher from './index';
import { OptionType } from './PlatformSwitcher.types';

const meta: Meta = {
  title: 'Components/PlatformSwitcher',
  component: PlatformSwitcher,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PlatformSwitcher>;

export const Default: Story = {
  args: {
    options: [
      {
        name: 'Network',
        description: 'Camino network',
        url: '/',
        private: false,
        hidden: true,
      },
      {
        name: 'Wallet',
        description: 'Secure, non-custodial wallet for Camino Assets.',
        url: '/wallet',
        private: false,
      },
      {
        name: 'Explorer',
        description: 'Lookup network activity and statistics.',
        url: '/explorer',
        private: false,
      },
      {
        name: 'DAC',
        description: 'Decentralized Autonomous Consortium',
        url: '/dac',
        private: false,
      },
      {
        name: 'Foundation',
        description: 'Tools for foundation members.',
        url: '/foundation',
        private: true,
        hidden: true,
      },
      {
        name: 'Partners',
        description: 'Partners of the Camino Network.',
        url: '/partners',
        private: false,
      },
      {
        name: 'Settings',
        description: 'Manage your wallet settings.',
        url: '/settings',
        private: true,
        hidden: true,
      },
    ],
    onSelect: (option: OptionType) => console.log('Selected option:', option),
    defaultLabel: 'Select an option',
  },
};
