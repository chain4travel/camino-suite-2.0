import type { Meta, StoryObj } from '@storybook/react';

import Input from '.';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helpText: { control: 'text' },
    disabled: { control: 'boolean' },
    isSuccess: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder text',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
  },
};

export const WithHelpText: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    helpText: 'This is a help text',
  },
};

export const WithError: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    error: 'This field is required',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    isSuccess: true,
    value: 'Correct value',
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    rightIcon: (
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    disabled: true,
  },
};

export const WithClickableIcon: Story = {
  args: {
    label: 'Copy Text',
    placeholder: 'Click the copy icon',
    value: 'Text to copy',
    rightIcon: (
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    onIconClick: () => alert('Icon clicked!'),
    iconAriaLabel: 'Copy to clipboard',
  },
};

export const WithDisabledIcon: Story = {
  args: {
    ...WithClickableIcon.args,
    iconDisabled: true,
  },
};

export const TextArea: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    variant: 'textarea',
    rows: 4,
  },
};

export const TextAreaWithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    variant: 'textarea',
    error: 'Message is required',
    rows: 4,
  },
};

export const TextAreaWithHelpText: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    variant: 'textarea',
    helpText: 'Maximum 500 characters',
    rows: 4,
  },
};

export const ValidationCode: Story = {
  args: {
    label: 'Validation Code',
    placeholder: '000-000-000',
    variant: 'validation-code',
    helpText: 'You can find this code on your phone',
  },
};

export const RequiredField: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter value',
    required: true,
  },
};
