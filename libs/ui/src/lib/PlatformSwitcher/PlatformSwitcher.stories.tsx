import type { Meta, StoryObj } from '@storybook/react';

import PlatformSwitcher from './index';
import { OptionType } from './PlatformSwitcher.types';
import { PLATFORM_SWITCHER } from '@camino/data';

const meta: Meta = {
  title: 'Components/PlatformSwitcher',
  component: PlatformSwitcher,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PlatformSwitcher>;

export const Default: Story = {
  args: {
    options: PLATFORM_SWITCHER,
    onSelect: (option: OptionType) => console.log('Selected option:', option),
    activeApp: 'Select an option',
  },
};
