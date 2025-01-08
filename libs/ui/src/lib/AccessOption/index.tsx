'use client';

import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { Icon } from '@mdi/react';

export interface AccessOptionProps extends ComponentPropsWithoutRef<'button'> {
  icon: string;
  text: string;
}

export const AccessOption = forwardRef<HTMLButtonElement, AccessOptionProps>(
  ({ icon, text, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          group
          flex items-center gap-4 p-6 rounded-xl w-full
          transition-colors duration-200
          bg-white dark:bg-slate-950
          enabled:hover:bg-slate-950 enabled:hover:text-white
          dark:enabled:hover:bg-white dark:enabled:hover:text-slate-950
          border border-gray-200 dark:border-slate-800
          enabled:hover:border-slate-800 dark:enabled:hover:border-gray-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        <Icon
          path={icon}
          size={1.5}
          className="text-gray-700 dark:text-slate-300 group-enabled:group-hover:text-white dark:group-enabled:group-hover:text-slate-950"
        />
        <span className="text-lg font-medium text-gray-900 dark:text-white group-enabled:group-hover:text-white dark:group-enabled:group-hover:text-slate-950">
          {text}
        </span>
      </button>
    );
  }
);

AccessOption.displayName = 'AccessOption';
