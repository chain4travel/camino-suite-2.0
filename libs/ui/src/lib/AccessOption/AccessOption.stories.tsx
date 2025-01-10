import type { Meta, StoryObj } from '@storybook/react';
import { mdiKey, mdiTextBoxOutline, mdiWallet } from '@mdi/js';

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

export const AllVariant: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-[1200px]">
      <AccessOption icon={mdiKey} text="Private Key" />
      <AccessOption icon={mdiWallet} text="Connect Wallet" />
      <AccessOption icon={mdiTextBoxOutline} text="Click Me"  onClick={() => alert('Clicked!')} />
      <AccessOption icon={mdiKey} text="Private Key" disabled />
      <AccessOption icon={mdiWallet} text="Connect Wallet" disabled />
      <AccessOption icon={mdiTextBoxOutline} text="Click Me" disabled />
    </div>
  ),
};
