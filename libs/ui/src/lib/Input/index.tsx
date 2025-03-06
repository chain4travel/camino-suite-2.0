'use client';

import React, { forwardRef } from 'react';

import Icon from '@mdi/react';
import { InputProps } from './Input.types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { mdiAlertOutline } from '@mdi/js';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, variant = 'input', rows = 4, ...props }, ref) => {
    const { t } = useTranslation();

    const inputClasses = clsx(
      'w-full px-4 py-2.5 rounded-lg font-normal text-sm transition-colors',
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-700',
      'text-gray-900 dark:text-white',
      'hover:border-blue-500 dark:hover:border-blue-500',
      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500',
      {
        'border-red-500 dark:border-red-500': error,
      },
      className
    );

    const InputElement = variant === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <InputElement
          ref={ref as any}
          rows={variant === 'textarea' ? rows : undefined}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1 mt-1 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
