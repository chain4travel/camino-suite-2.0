'use client';

import React, { forwardRef } from 'react';

import { MnemonicInputProps } from './MnemonicInput.types';
import clsx from 'clsx';

const MnemonicInput = forwardRef<HTMLDivElement, MnemonicInputProps>(
  (
    {
      className,
      phrases,
      onChange,
      showPhrase = false,
      error,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const handlePhraseChange = (index: number, value: string) => {
      if (!onChange) return;

      // Check if the input contains multiple words
      if (value.includes(' ')) {
        const words = value.trim().split(/\s+/);

        // If we have exactly 24 words, distribute them
        if (words.length === 24) {
          onChange(words);
          return;
        }

        // If we have more words than remaining spaces, only take what we need
        const remainingSlots = 24 - index;
        const wordsToUse = words.slice(0, remainingSlots);

        const newPhrases = [...phrases];
        wordsToUse.forEach((word, i) => {
          if (index + i < 24) {
            newPhrases[index + i] = word;
          }
        });

        onChange(newPhrases);
        return;
      }

      // Handle single word input
      const newPhrases = [...phrases];
      newPhrases[index] = value;
      onChange(newPhrases);
    };

    return (
      <div
        ref={ref}
        className={clsx('grid grid-cols-2 sm:grid-cols-4 gap-4', className)}
        {...props}
      >
        {phrases.map((phrase, index) => (
          <div key={index} className="flex">
            <div className="relative w-full">
              <div className="absolute text-sm text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-slate-400">
                {index + 1}.
              </div>
              <input
                value={phrase}
                type={showPhrase ? 'text' : 'password'}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                disabled={disabled}
                aria-label={`Phrase ${index + 1}`}
                className={clsx(
                  'w-full pl-10 pr-3 py-2.5 text-center',
                  'bg-slate-100 dark:bg-slate-950',
                  'text-gray-900 dark:text-white',
                  'text-sm font-normal',
                  'border border-gray-200 dark:border-gray-700/50 rounded-lg',
                  'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                  'placeholder:text-slate-400 dark:placeholder:text-gray-600',
                  {
                    'border-red-500 focus:ring-red-500': error,
                    'opacity-50 cursor-not-allowed': disabled,
                  }
                )}
                autoComplete="off"
                spellCheck={false}
                placeholder={showPhrase ? '' : '••••••'}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

MnemonicInput.displayName = 'MnemonicInput';

export default MnemonicInput;
