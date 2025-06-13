import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { Tabs } from './index';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const Template = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const isDarkMode = useTheme().theme === 'dark';

  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <div
        className={clsx(
          'bg-white p-4 rounded-lg',
          isDarkMode && '!bg-slate-950'
        )}
      >
        <h3 className="mb-4 font-medium">Default Tabs</h3>
        <div className="space-y-8">
          {['sm', 'md', 'lg'].map((size) => (
            <Tabs
              key={size}
              size={size as 'sm' | 'md' | 'lg'}
              tabs={[
                { id: 'tab1', label: 'Tab 1' },
                { id: 'tab2', label: 'Tab 2' },
                { id: 'tab3', label: 'Tab 3' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          ))}
        </div>
      </div>

      <div
        className={clsx(
          'bg-white p-4 rounded-lg',
          isDarkMode && '!bg-slate-950'
        )}
      >
        <h3 className="mb-4 font-medium">Icon Tabs</h3>
        <div className="space-y-8">
          {['sm', 'md', 'lg'].map((size) => (
            <Tabs
              key={size}
              size={size as 'sm' | 'md' | 'lg'}
              variant="icon"
              tabs={[
                { id: 'home', label: 'Home', icon: mdiHome },
                { id: 'profile', label: 'Profile', icon: mdiAccount },
                { id: 'settings', label: 'Settings', icon: mdiCog },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          ))}
        </div>
      </div>

      <div
        className={clsx(
          'bg-white p-4 rounded-lg',
          isDarkMode && '!bg-slate-950'
        )}
      >
        <h3 className="mb-4 font-medium">Full Width Tabs</h3>
        <Tabs
          fullWidth
          tabs={[
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: Template,
};
