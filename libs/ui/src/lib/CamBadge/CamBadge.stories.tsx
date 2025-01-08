import type { Meta, StoryObj } from '@storybook/react';

import CamBadge from '.';

const meta: Meta<typeof CamBadge> = {
  component: CamBadge,
  title: 'Components/CamBadge',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CamBadge>;

export const Default: Story = {
  args: {
    text: 'DEFAULT',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    text: 'PRIMARY',
    variant: 'primary',
  },
};

export const Positive: Story = {
  args: {
    text: 'POSITIVE',
    variant: 'positive',
  },
};

export const Warning: Story = {
  args: {
    text: 'WARNING',
    variant: 'warning',
  },
};

export const Negative: Story = {
  args: {
    text: 'NEGATIVE',
    variant: 'negative',
  },
};

export const Verified: Story = {
  args: {
    text: 'VERIFIED',
    variant: 'verified',
  },
};

export const New: Story = {
  args: {
    text: 'NEW',
    variant: 'new',
  },
};

export const Approved: Story = {
  args: {
    text: 'APPROVED',
    variant: 'approved',
  },
};

export const AccessDenied: Story = {
  args: {
    text: 'ACCESS DENIED',
    variant: 'access-denied',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CamBadge variant="default" text="DEFAULT" />
      <CamBadge variant="primary" text="PRIMARY" />
      <CamBadge variant="positive" text="POSITIVE" />
      <CamBadge variant="warning" text="WARNING" />
      <CamBadge variant="negative" text="NEGATIVE" />
      <CamBadge variant="verified" text="VERIFIED" />
      <CamBadge variant="new" text="NEW" />
      <CamBadge variant="approved" text="APPROVED" />
      <CamBadge variant="access-denied" text="ACCESS DENIED" />
    </div>
  ),
};
