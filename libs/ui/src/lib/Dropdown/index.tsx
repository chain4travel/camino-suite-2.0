'use client';

import {
  MenuItem as HeadlessMenuItem,
  Menu,
  MenuButton,
  MenuItems,
} from '@headlessui/react';
import React, { forwardRef } from 'react';

import { DropdownProps } from './Dropdown.types';
import { Icon } from '@mdi/react';
import clsx from 'clsx';
import { mdiChevronDown } from '@mdi/js';

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {
    trigger,
    items,
    children,
    className,
    menuButtonClassName,
    menuItemsClassName,
    menuItemClassName,
    startIcon,
    endIcon = mdiChevronDown,
    onSelect,
    placement = 'bottom-start',
    disabled = false,
    showDividers = false,
    ...divProps
  } = props;

  const menuItemsClasses = clsx(
    'absolute z-50 mt-2 min-w-[180px] origin-top-right rounded-lg border overflow-hidden',
    'bg-white dark:bg-slate-900',
    'border-gray-200 dark:border-slate-700',
    'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
    {
      'left-0': placement.includes('start'),
      'right-0': placement.includes('end'),
      'bottom-full mb-2': placement.includes('top'),
      'top-full mt-2': placement.includes('bottom'),
    },
    menuItemsClassName
  );

  const buttonClasses = clsx(
    'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium',
    'bg-white dark:bg-slate-900',
    'border border-gray-200 dark:border-slate-700',
    'text-gray-900 dark:text-white',
    'transition-colors duration-200',
    {
      'cursor-not-allowed opacity-50': disabled,
      'hover:bg-gray-50 dark:hover:bg-slate-800': !disabled,
    },
    menuButtonClassName
  );

  const itemClasses = clsx(
    'flex w-full items-center gap-2 px-4 py-2 text-sm',
    'text-gray-900 dark:text-white',
    'transition-colors duration-200',
    'hover:bg-gray-50 dark:hover:bg-slate-800',
    'focus:bg-gray-50 dark:focus:bg-slate-800',
    'focus:outline-none',
    menuItemClassName
  );

  return (
    <div
      ref={ref}
      className={clsx('relative inline-block text-left', className)}
      {...divProps}
    >
      <Menu>
        <MenuButton disabled={disabled} className={buttonClasses}>
          {startIcon && (
            <Icon
              path={startIcon}
              size={0.9}
              className="text-gray-500 dark:text-slate-400"
            />
          )}
          {trigger}
          {endIcon && (
            <Icon
              path={endIcon}
              size={0.9}
              className="text-gray-500 dark:text-slate-400"
            />
          )}
        </MenuButton>

        <MenuItems className={menuItemsClasses}>
          {children || (items?.map((item, index) => (
            <div key={index}>
              <HeadlessMenuItem>
                {({ active }) => (
                  <button
                    className={clsx(itemClasses, {
                      'bg-gray-50 dark:bg-slate-800': active,
                    })}
                    onClick={() => onSelect?.(item)}
                    disabled={item.disabled}
                  >
                    {item.renderItem ? (
                      item.renderItem()
                    ) : (
                      <>
                        {item.startIcon && (
                          <Icon
                            path={item.startIcon}
                            size={0.9}
                            className="text-gray-500 dark:text-slate-400"
                          />
                        )}
                        {item.label}
                        {item.endIcon && (
                          <Icon
                            path={item.endIcon}
                            size={0.9}
                            className="text-gray-500 dark:text-slate-400 self-center"
                          />
                        )}
                      </>
                    )}
                  </button>
                )}
              </HeadlessMenuItem>
              {showDividers && index < (items?.length || 0) - 1 && (
                <div className="h-px bg-slate-700" />
              )}
            </div>
          )))}
        </MenuItems>
      </Menu>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export type { DropdownProps } from './Dropdown.types';
export default Dropdown;
