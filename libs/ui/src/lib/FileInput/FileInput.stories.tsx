import type { Meta, StoryObj } from '@storybook/react';

import FileInput from './index';

const meta: Meta<typeof FileInput> = {
  title: 'Components/FileInput',
  component: FileInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: {
    placeholder: 'Select file...',
    accept: '.json,.keystore',
  },
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Upload File',
  },
};

export const Required: Story = {
  args: {
    ...WithLabel.args,
    required: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Invalid file format',
  },
};

export const WithHelpText: Story = {
  args: {
    ...Default.args,
    helpText: 'Only .json and .keystore files are allowed',
  },
};
