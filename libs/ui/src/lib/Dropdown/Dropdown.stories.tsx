import type { Meta, StoryObj } from '@storybook/react';
import {
  mdiAccount,
  mdiChevronDown,
  mdiCog,
  mdiDotsVertical,
  mdiFilter,
  mdiLogout,
  mdiMenu,
  mdiPlus,
} from '@mdi/js';

import Dropdown from '.';
import { Icon } from '@mdi/react';
import { MenuItem } from '@headlessui/react';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const items = [
  {
    label: 'Account',
    value: 'account',
    startIcon: mdiAccount,
  },
  {
    label: 'Settings',
    value: 'settings',
    startIcon: mdiCog,
  },
  {
    label: 'Logout',
    value: 'logout',
    startIcon: mdiLogout,
  },
];

// Common styles for custom menu items
const customItemStyles = {
  base: `
    flex w-full items-center gap-2 px-4 py-2 text-sm
    text-gray-900 dark:text-white
    transition-colors duration-200
  `,
  active: 'bg-gray-50 dark:bg-slate-800',
  inactive: 'hover:bg-gray-50 dark:hover:bg-slate-800',
};

export const Default: Story = {
  args: {
    trigger: 'Menu',
    items,
  },
};

export const WithStartIcon: Story = {
  args: {
    trigger: 'Menu',
    items,
    startIcon: mdiMenu,
  },
};

export const WithoutEndIcon: Story = {
  args: {
    trigger: 'Menu',
    items,
    endIcon: undefined,
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: (
      <div className="flex items-center gap-2">
        <Icon path={mdiPlus} size={0.9} />
        <span>Custom Trigger</span>
      </div>
    ),
    items,
    endIcon: undefined,
  },
};

export const Disabled: Story = {
  args: {
    trigger: 'Disabled Menu',
    items,
    disabled: true,
  },
};

export const TopPlacement: Story = {
  args: {
    trigger: 'Top Menu',
    items,
    placement: 'top-start',
  },
};

export const WithDividers: Story = {
  args: {
    trigger: 'With Dividers',
    items,
    showDividers: true,
  },
};

export const CustomChildren: Story = {
  render: () => (
    <Dropdown trigger="Custom Menu">
      <MenuItem>
        {({ active }) => (
          <button
            className={`${customItemStyles.base} ${
              active ? customItemStyles.active : customItemStyles.inactive
            }`}
          >
            <Icon path={mdiAccount} size={0.9} className="text-gray-500" />
            <span>Custom Item 1</span>
          </button>
        )}
      </MenuItem>
      <div className="h-px my-1 bg-slate-200 dark:bg-slate-700" />
      <MenuItem>
        {({ active }) => (
          <button
            className={`${customItemStyles.base} ${
              active ? customItemStyles.active : customItemStyles.inactive
            }`}
          >
            <Icon path={mdiCog} size={0.9} className="text-gray-500" />
            <span>Custom Item 2</span>
          </button>
        )}
      </MenuItem>
    </Dropdown>
  ),
};

export const CustomItemRenderer: Story = {
  args: {
    trigger: 'Custom Renderer',
    items: [
      {
        label: 'Custom Item 1',
        value: '1',
        renderItem: () => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-blue-500">Primary Text</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Secondary description
            </span>
          </div>
        ),
      },
      {
        label: 'Custom Item 2',
        value: '2',
        renderItem: () => (
          <div className="flex items-center justify-between w-full">
            <span className="text-gray-900 dark:text-white">With Badge</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              New
            </span>
          </div>
        ),
      },
    ],
    showDividers: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {/* Default */}
      <Dropdown trigger="Default" items={items} />

      {/* With Start Icon */}
      <Dropdown
        trigger="With Start Icon"
        items={items}
        startIcon={mdiMenu}
      />

      {/* Without End Icon */}
      <Dropdown
        trigger="No End Icon"
        items={items}
        endIcon={undefined}
      />

      {/* With End Icon */}
      <Dropdown
        trigger="With End Icon"
        items={items}
        endIcon={mdiMenu}
      />

      {/* Custom Icon Combo */}
      <Dropdown
        trigger="Custom Icons"
        items={items}
        startIcon={mdiFilter}
        endIcon={mdiChevronDown}
      />

      {/* Icon Only */}
      <Dropdown
        trigger={<Icon path={mdiDotsVertical} size={1} />}
        items={items}
        endIcon={undefined}
      />

      {/* Disabled */}
      <Dropdown
        trigger="Disabled"
        items={items}
        disabled
      />

      {/* Custom Styles */}
      <Dropdown
        trigger="Custom Style"
        items={items}
        menuButtonClassName="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        menuItemClassName="hover:bg-blue-50 dark:hover:bg-blue-900/50"
      />

      {/* With Custom Children */}
      <Dropdown trigger="Custom Children">
        <MenuItem>
          {({ active }) => (
            <button
              className={`${customItemStyles.base} ${
                active ? customItemStyles.active : customItemStyles.inactive
              }`}
            >
              <Icon path={mdiAccount} size={0.9} className="text-gray-500" />
              <span>Custom Child Item</span>
            </button>
          )}
        </MenuItem>
      </Dropdown>

      {/* Different Placements */}
      <div className="flex gap-4">
        <Dropdown
          trigger="Bottom Start"
          items={items}
          placement="bottom-start"
        />
        <Dropdown
          trigger="Bottom End"
          items={items}
          placement="bottom-end"
        />
        <Dropdown
          trigger="Top Start"
          items={items}
          placement="top-start"
        />
        <Dropdown
          trigger="Top End"
          items={items}
          placement="top-end"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This story showcases all variants of the Dropdown component together.',
      },
    },
  },
};
