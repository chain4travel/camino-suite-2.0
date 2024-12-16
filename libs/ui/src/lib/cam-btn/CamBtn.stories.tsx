import type { Meta, StoryObj } from '@storybook/react';
import { CamBtn } from './CamBtn';

const meta: Meta<typeof CamBtn> = {
  component: CamBtn,
  title: 'components/CamBtn',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Button style variant',
    },
    children: {
      description: 'Button text',
      type: { name: 'string', required: false },
      control: {
        type: 'text',
      },
    },
    onClick: { action: 'clicked' },
  },
};
export default meta;
type Story = StoryObj<typeof CamBtn>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'button',
    disabled: false
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export const Positive: Story = {
  args: {
    ...Primary.args,
    variant: 'positive',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export const Negative: Story = {
  args: {
    ...Primary.args,
    variant: 'negative',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export const Accent: Story = {
  args: {
    ...Primary.args,
    variant: 'accent',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export const Transparent: Story = {
  args: {
    ...Primary.args,
    variant: 'transparent',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

// disabled
export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
