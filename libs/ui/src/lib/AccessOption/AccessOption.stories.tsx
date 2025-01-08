import type { Meta, StoryObj } from '@storybook/react';
import { mdiKey, mdiShieldKey, mdiTextBoxOutline, mdiWallet } from '@mdi/js';

import { AccessOption } from './index';

const meta: Meta<typeof AccessOption> = {
  component: AccessOption,
  title: 'Components/AccessOption',
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#020617' }, // slate-950
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccessOption>;

export const Default: Story = {
  args: {
    icon: mdiShieldKey,
    text: 'Private Key',
  },
};

export const WithCustomIcon: Story = {
  args: {
    icon: mdiWallet,
    text: 'Connect Wallet',
  },
};

export const Disabled: Story = {
  args: {
    icon: mdiKey,
    text: 'Access Key',
    disabled: true,
  },
};

export const WithOnClick: Story = {
  args: {
    icon: mdiTextBoxOutline,
    text: 'Click Me',
    onClick: () => alert('Clicked!'),
  },
};

export const DarkMode: Story = {
  args: {
    icon: mdiShieldKey,
    text: 'Dark Mode Example',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
