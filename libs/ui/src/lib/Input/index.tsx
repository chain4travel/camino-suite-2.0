import React, { InputHTMLAttributes, MouseEvent, TextareaHTMLAttributes, forwardRef } from 'react';

import clsx from 'clsx';

type BaseProps = {
  label?: string;
  error?: string;
  helpText?: string;
  rightIcon?: React.ReactNode;
  isSuccess?: boolean;
  onIconClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  iconAriaLabel?: string;
  iconDisabled?: boolean;
  variant?: 'input' | 'textarea';
  rows?: number;
};

export type InputProps = BaseProps &
  (
    | ({ variant?: 'input' } & InputHTMLAttributes<HTMLInputElement>)
    | ({ variant: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

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
    rows = 3,
    ...props
  }, ref) => {
    const baseClasses = clsx(
      'w-full px-4 py-2.5 rounded-lg font-normal text-sm transition-colors',
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-700',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'text-gray-900 dark:text-white',
      'focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500',
      {
        'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20': error,
        'border-green-500 dark:border-green-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20 dark:focus:ring-green-500/20': isSuccess,
        'pr-12': rightIcon && variant === 'input',
      },
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {variant === 'textarea' ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              rows={rows}
              className={baseClasses}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={baseClasses}
              {...(props as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
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
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              )}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && (
          <p className="flex items-center gap-1 mt-1 text-sm text-red-500 dark:text-red-400">
            <span role="img" aria-label="warning" className="inline-block w-4 h-4">
              ⚠️
            </span>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
