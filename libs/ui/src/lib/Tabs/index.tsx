import clsx from 'clsx';
import { Icon } from '@mdi/react';
import Typography from '../Typography';
import { useTheme } from '../../context/ThemeContext';
import { TabsProps } from './Tabs.types';

const tabSizes = {
  sm: 'px-2 py-2',
  md: 'px-3 py-2.5',
  lg: 'px-4 py-3',
} as const;

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}: TabsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const containerClasses = clsx(
    'flex gap-1 border-b border-slate-700',
    fullWidth && 'w-full',
    className
  );

  const tabClasses = (tab: TabsProps['tabs'][number]) => clsx(
    'rounded-t-lg transition-colors relative hover:bg-gray-200/50 dark:hover:bg-slate-800/50 whitespace-nowrap',
    tabSizes[size],
    'focus:outline-none',
    tab.disabled && 'opacity-50 cursor-not-allowed',
    tab.id === activeTab &&
      'after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-t-full',
    variant === 'icon' && 'flex items-center gap-2',
    fullWidth && 'flex-1'
  );

  return (
    <div 
      className={containerClasses} 
      data-testid="tabs-container"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={tab.id === activeTab}
          aria-controls={`${tab.id}-panel`}
          className={tabClasses(tab)}
        >
          {tab.icon && (
            <Icon
              path={tab.icon}
              size={size === 'sm' ? 0.8 : size === 'lg' ? 1 : 0.9}
              className="text-slate-950 dark:text-slate-100"
            />
          )}
          <Typography
            variant={size === 'sm' ? 'body2' : 'body1'}
            className={clsx(
              'transition-colors capitalize',
              tab.id === activeTab
                ? isDarkMode
                  ? '!text-white'
                  : '!text-slate-900'
                : isDarkMode
                ? '!text-neutral-400 hover:!text-white'
                : '!text-slate-500 hover:!text-slate-900'
            )}
          >
            {tab.label}
          </Typography>
        </button>
      ))}
    </div>
  );
};
