import type { Meta, StoryObj } from '@storybook/react';

import CamBadge from '.';

const meta: Meta<typeof CamBadge> = {
  component: CamBadge,
  title: 'Components/CamBadge',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CamBadge>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        <CamBadge variant="default" text="DEFAULT" size="sm" />
        <CamBadge variant="primary" text="PRIMARY" size="sm" />
        <CamBadge variant="positive" text="POSITIVE" size="sm" />
        <CamBadge variant="warning" text="WARNING" size="sm" />
        <CamBadge variant="negative" text="NEGATIVE" size="sm" />
        <CamBadge variant="verified" text="VERIFIED" size="sm" />
        <CamBadge variant="new" text="NEW" />
        <CamBadge variant="approved" text="APPROVED" />
        <CamBadge variant="access-denied" text="ACCESS DENIED" />
      </div>
      <div className="flex flex-wrap gap-2">
        <CamBadge variant="default" text="DEFAULT" size="md" />
        <CamBadge variant="primary" text="PRIMARY" size="md" />
        <CamBadge variant="positive" text="POSITIVE" size="md" />
        <CamBadge variant="warning" text="WARNING" size="md" />
        <CamBadge variant="negative" text="NEGATIVE" size="md" />
        <CamBadge variant="verified" text="VERIFIED" size="md" />
        <CamBadge variant="new" text="NEW" size="md" />
        <CamBadge variant="approved" text="APPROVED" size="md" />
        <CamBadge variant="access-denied" text="ACCESS DENIED" size="md" />
      </div>
    </div>
  ),
};
