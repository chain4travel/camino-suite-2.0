import type { Meta, StoryObj } from '@storybook/react';
import { mdiAccount, mdiArrowRight } from '@mdi/js';

import CamBtn from '.';
import Icon from '@mdi/react';

const meta: Meta<typeof CamBtn> = {
  title: 'Components/CamBtn',
  component: CamBtn,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'positive', 'negative', 'accent', 'transparent'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CamBtn>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      {/* Light Theme */}
      <div className="p-8 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">Light Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-wrap gap-2">
              <CamBtn variant="primary" size={size}>Button</CamBtn>
              <CamBtn variant="secondary" size={size}>Button</CamBtn>
              <CamBtn variant="positive" size={size}>Button</CamBtn>
              <CamBtn variant="negative" size={size}>Button</CamBtn>
              <CamBtn variant="accent" size={size}>Button</CamBtn>
              <CamBtn variant="transparent" size={size}>Button</CamBtn>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Theme */}
      <div className="p-8 rounded-lg bg-slate-950">
        <h3 className="mb-4 text-lg font-semibold text-white">Dark Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-wrap gap-2">
              <CamBtn variant="primary" size={size}>Button</CamBtn>
              <CamBtn variant="secondary" size={size}>Button</CamBtn>
              <CamBtn variant="positive" size={size}>Button</CamBtn>
              <CamBtn variant="negative" size={size}>Button</CamBtn>
              <CamBtn variant="accent" size={size}>Button</CamBtn>
              <CamBtn variant="transparent" size={size}>Button</CamBtn>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div className="p-8 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="grid grid-cols-3 gap-4">
          <CamBtn variant="primary" isLoading>Loading</CamBtn>
          <CamBtn variant="primary" disabled>Disabled</CamBtn>
          <CamBtn variant="primary" fullWidth>Full Width</CamBtn>
        </div>
      </div>

      {/* Icons */}
      <div className="p-8 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">With Icons</h3>
        <div className="grid grid-cols-2 gap-4">
          <CamBtn 
            variant="primary" 
            leftIcon={<Icon path={mdiAccount} size={1} />}
          >
            Left Icon
          </CamBtn>
          <CamBtn 
            variant="primary" 
            rightIcon={<Icon path={mdiArrowRight} size={1} />}
          >
            Right Icon
          </CamBtn>
        </div>
      </div>
    </div>
  ),
};
