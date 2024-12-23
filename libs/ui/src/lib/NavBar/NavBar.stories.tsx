import type { Meta, StoryObj } from '@storybook/react';

import Navbar from './index';

const meta: Meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-full py-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: () => <Navbar />,
};
