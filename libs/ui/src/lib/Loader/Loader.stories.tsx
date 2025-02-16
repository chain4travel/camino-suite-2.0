import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './index';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
      <Loader size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loader color="primary" />
      <Loader color="secondary" />
      <div className="bg-slate-900 p-4">
        <Loader color="white" />
      </div>
    </div>
  ),
};

export const CustomClassName: Story = {
  args: {
    className: 'border-red-500',
  },
};
