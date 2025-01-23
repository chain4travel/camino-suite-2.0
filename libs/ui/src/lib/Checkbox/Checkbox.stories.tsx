import type { Meta, StoryObj } from '@storybook/react';

import Checkbox from '.';
import React from 'react';
import Typography from '../Typography';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col w-full gap-4 p-8 rounded-lg dark:bg-slate-950">
      <div className="flex flex-col gap-4">
        <Typography variant="h2">Checkbox States</Typography>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="default" />
            <label htmlFor="default" className="text-slate-700 dark:text-slate-300">
              Default
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checked" defaultChecked />
            <label htmlFor="checked" className="text-slate-700 dark:text-slate-300">
              Checked
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled" disabled />
            <label htmlFor="disabled" className="text-slate-700 dark:text-slate-300">
              Disabled
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled-checked" disabled defaultChecked />
            <label htmlFor="disabled-checked" className="text-slate-700 dark:text-slate-300">
              Disabled Checked
            </label>
          </div>
        </div>
      </div>
    </div>
  ),
};
