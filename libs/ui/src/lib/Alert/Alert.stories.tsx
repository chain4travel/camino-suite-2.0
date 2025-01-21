import type { Meta, StoryObj } from '@storybook/react';

import Alert from './Alert';

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'Components/Alert',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

const args = {
  title: 'Information',
  description:
    'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col w-full max-w-5xl gap-2 p-4 rounded-lg dark:bg-slate-950">
      <div className="grid grid-cols-2 gap-2">
        <Alert variant="default" {...args} title="" />
        <Alert variant="default" {...args} />
        <Alert variant="primary" {...args} title="" />
        <Alert variant="primary" {...args} />
        <Alert variant="positive" {...args} title="" />
        <Alert variant="positive" {...args} />
        <Alert variant="warning" {...args} title="" />
        <Alert variant="warning" {...args} />
        <Alert variant="negative" {...args} title="" />
        <Alert variant="negative" {...args} />
      </div>
    </div>
  ),
};
