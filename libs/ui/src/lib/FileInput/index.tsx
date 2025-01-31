'use client';

import React, { forwardRef } from 'react';

import { FileInputProps } from './FileInput.types';
import clsx from 'clsx';

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      label,
      error,
      helpText,
      accept,
      required,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onChange) {
        onChange(file);
      }
    };

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
          <input
            ref={ref}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            id="file-input"
            {...props}
          />
          <label
            htmlFor="file-input"
            className={clsx(
              'block w-full px-4 py-2.5 rounded-lg font-normal text-sm transition-colors cursor-pointer',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-900 dark:text-white text-center',
              'hover:border-blue-500 dark:hover:border-blue-500',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500',
              {
                'border-red-500 dark:border-red-500': error,
              },
              className
            )}
          >
            {value?.name || props.placeholder || 'Select file...'}
          </label>
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
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;
