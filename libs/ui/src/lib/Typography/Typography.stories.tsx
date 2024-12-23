import type { Meta, StoryObj } from '@storybook/react';

import Typography from './index';

const meta: Meta<typeof Typography> = {
  component: Typography,
  title: 'Common/Typography',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Typography style variant',
    },
    children: {
      description: 'Typography text',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
    as: {
      description: 'Typography component type',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      }
    },
    className: {
      description: 'Typography component class name',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
        }
    },
    color: {
      description: 'Typography text color (use tailwind color)',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    children: 'Typography',
  },
};
