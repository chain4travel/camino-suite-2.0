import type { Meta, StoryObj } from '@storybook/react';

import MnemonicInput from '.';
import { useState } from 'react';

const meta: Meta<typeof MnemonicInput> = {
  title: 'Components/MnemonicInput',
  component: MnemonicInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MnemonicInput>;

const MnemonicInputDemo = () => {
  const [phrases, setPhrases] = useState<string[]>(Array(24).fill(''));
  return <MnemonicInput phrases={phrases} onChange={setPhrases} />;
};

export const Default: Story = {
  render: () => <MnemonicInputDemo />,
};

export const WithError: Story = {
  args: {
    phrases: Array(24).fill(''),
    error: 'Invalid mnemonic phrase',
  },
};

export const Hidden: Story = {
  args: {
    phrases: Array(24).fill('test'),
    showPhrase: false,
  },
};

export const Visible: Story = {
  args: {
    phrases: Array(24).fill('test'),
    showPhrase: true,
  },
};

export const Disabled: Story = {
  args: {
    phrases: Array(24).fill(''),
    disabled: true,
  },
};
