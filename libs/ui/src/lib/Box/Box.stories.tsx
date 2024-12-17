import type { Meta, StoryObj } from '@storybook/react';
import Box from '.';

const meta: Meta<typeof Box> = {
  component: Box,
  title: 'components/Box',
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Box content',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Primary: Story = {
  decorators: [
    (Story: typeof Box) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story>Box</Story>
      </div>
    ),
  ],
};
