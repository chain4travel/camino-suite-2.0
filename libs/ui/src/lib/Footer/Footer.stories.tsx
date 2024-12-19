import { Meta, StoryObj } from '@storybook/react';
import Footer from '.';

const meta: Meta<typeof Footer> = {
  component: Footer,
  title: 'Layout/Footer',
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story: typeof Footer) => (
      <div className="flex items-center justify-center w-full">
        <Story />
      </div>
    ),
  ],
};
