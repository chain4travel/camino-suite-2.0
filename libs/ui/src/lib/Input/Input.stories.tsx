import type { Meta, StoryObj } from '@storybook/react';
import { mdiAccount, mdiContentCopy } from '@mdi/js';

import Icon from '@mdi/react';
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

export const AllVariant: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-[1200px]">
      <Input label="Default" placeholder="Enter value" />
      <Input label="With Label" placeholder="Enter value" />
      <Input
        label="With Help Text"
        placeholder="Enter value"
        helpText="This is a help text"
      />
      <Input
        label="With Error"
        placeholder="Enter value"
        error="This field is required"
      />
      <Input
        label="With Success"
        placeholder="Enter value"
        isSuccess
        value="Correct value"
      />
      <Input
        label="With Right Icon"
        placeholder="Enter value"
        rightIcon={mdiAccount}
      />
      <Input label="Disabled" placeholder="Enter value" disabled />
      <Input
        label="With Clickable Icon"
        placeholder="Enter value"
        value="Text to copy"
        rightIcon={mdiContentCopy}
        onIconClick={() => alert('Icon clicked!')}
        iconAriaLabel="Copy to clipboard"
      />
      <Input
        label="With Disabled Icon"
        placeholder="Enter value"
        value="Text to copy"
        rightIcon={mdiContentCopy}
        iconDisabled
      />
      <Input label="Text Area" placeholder="Enter value" variant="textarea" />
      <Input
        label="Validation Code"
        placeholder="000-000-000"
        variant="validation-code"
        helpText="You can find this code on your phone"
      />
      <Input label="Required Field" placeholder="Enter value" required />
    </div>
  ),
};

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
    rightIcon: mdiContentCopy,
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
    rightIcon: mdiContentCopy,
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
  },
};

export const TextAreaWithError: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    variant: 'textarea',
    error: 'Message is required',
  },
};

export const TextAreaWithHelpText: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    variant: 'textarea',
    helpText: 'Maximum 500 characters',
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
