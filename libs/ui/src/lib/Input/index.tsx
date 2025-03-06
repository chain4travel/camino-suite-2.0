'use client';

import React, { forwardRef } from 'react';
import Icon from '@mdi/react';
import { InputProps } from './Input.types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({
    className,
    label,
    error,
    helpText,
    rightIcon,
    isSuccess,
    onIconClick,
    iconAriaLabel,
    iconDisabled,
    variant = 'input',
    rows = 4,
    required,
    ...props
  }, ref) => {
    const { t } = useTranslation();

    const inputClasses = clsx(
      'w-full px-4 py-2.5 rounded-lg font-normal text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:opacity-20',
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-700',
      'placeholder:text-gray-500 dark:placeholder:text-slate-400',
      'text-gray-900 dark:text-white',
      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500',
      {
        'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20': error,
        'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20': isSuccess,
        'pr-12': rightIcon && variant === 'input',
      },
      className
    );

    const InputElement = variant === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
            {required && (
              <span className="ml-1 font-normal text-gray-500 dark:text-slate-400">
                (required)
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <InputElement
            ref={ref}
            rows={variant === 'textarea' ? rows : undefined}
            className={inputClasses}
            {...props}
          />
          {rightIcon && variant === 'input' && (
            <button
              type="button"
              onClick={onIconClick}
              disabled={iconDisabled}
              aria-label={iconAriaLabel}
              className={clsx(
                'absolute inset-y-0 right-0 flex items-center px-3',
                'hover:opacity-80 transition-opacity',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none'
              )}
            >
              <Icon
                path={rightIcon as string}
                size={1}
                className="text-gray-700 dark:text-slate-300"
              />
            </button>
          )}
        </div>
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
