import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './index';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
  }
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-8 items-center justify-center p-20">
      <Tooltip content="Top tooltip" position="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>
      </Tooltip>
    </div>
  )
};

export const LongContent: Story = {
  args: {
    content: 'This is a tooltip with a very long content that should wrap nicely',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover for long tooltip</button>
  }
}; 