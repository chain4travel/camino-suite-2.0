'use client';

import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { wordlists } from 'bip39';
import clsx from 'clsx';

interface MnemonicInputProps {
  className?: string;
  phrases: string[];
  onChange?: (phrases: string[]) => void;
  showPhrase?: boolean;
  error?: boolean;
  disabled?: boolean;
}

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
    const [usePasswordType, setUsePasswordType] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const isProgrammaticFocus = useRef(false);

    useEffect(() => {
      const testEl = document.createElement('div');
      testEl.style.cssText = '-webkit-text-security: disc;';
      if (!testEl.style.webkitTextSecurity) {
        setUsePasswordType(true);
      }
    }, []);

    const isValidWord = (word: string): boolean => {
      if (!word.trim()) return true; // Empty is valid (not filled yet)
      return wordlists.EN.includes(word.toLowerCase().trim());
    };

    const focusInput = (index: number, selectAll: boolean = true) => {
      const input = inputRefs.current[index];
      if (input) {
        isProgrammaticFocus.current = true;
        input.focus();
        if (selectAll) {
          input.select();
        }
        setTimeout(() => {
          isProgrammaticFocus.current = false;
        }, 0);
      }
    };

    const findNextEmptyInput = (startIndex: number): number => {
      for (let i = startIndex; i < 24; i++) {
        if (!phrases[i]?.trim()) {
          return i;
        }
      }
      return -1;
    };

    const handlePhraseChange = (index: number, value: string) => {
      if (!onChange) return;

      if (value.includes(' ')) {
        const words = value
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);

        if (words.length === 24) {
          onChange(words);
          setTimeout(() => {
            const firstInvalidIndex = words.findIndex(
              (word, i) => !isValidWord(word)
            );
            focusInput(firstInvalidIndex !== -1 ? firstInvalidIndex : 23, true);
          }, 0);
          return;
        }

        const newPhrases = [...phrases];
        const remainingSlots = 24 - index;
        const wordsToUse = words.slice(0, remainingSlots);

        wordsToUse.forEach((word, i) => {
          if (index + i < 24) {
            newPhrases[index + i] = word.toLowerCase().trim();
          }
        });

        onChange(newPhrases);

        setTimeout(() => {
          const nextEmptyIndex = findNextEmptyInput(index + wordsToUse.length);
          if (nextEmptyIndex !== -1) {
            focusInput(nextEmptyIndex, true);
          } else if (index + wordsToUse.length < 24) {
            focusInput(index + wordsToUse.length, true);
          }
        }, 0);
        return;
      }

      // Handle single word input
      const cleanValue = value.toLowerCase().trim();
      const newPhrases = [...phrases];
      newPhrases[index] = cleanValue;
      onChange(newPhrases);

      if (value.endsWith(' ') && cleanValue && index < 23) {
        setTimeout(() => {
          focusInput(index + 1, true);
        }, 0);
      }
    };

    const handleFocus = (
      index: number,
      e: React.FocusEvent<HTMLInputElement>
    ) => {
      if (!isProgrammaticFocus.current) {
        return;
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === 'Backspace' && !phrases[index] && index > 0) {
        e.preventDefault();
        focusInput(index - 1, false);
      }

      if (e.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1, false);
      }

      if (e.key === 'ArrowRight' && index < 23) {
        focusInput(index + 1, false);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const nextEmptyIndex = findNextEmptyInput(index + 1);
        if (nextEmptyIndex !== -1) {
          focusInput(nextEmptyIndex, true);
        } else if (index < 23) {
          focusInput(index + 1, true);
        }
      }
    };

    const getInputClassName = (phrase: string, index: number) => {
      const hasError = error || (phrase && !isValidWord(phrase));
      const isEmpty = !phrase?.trim();

      return clsx(
        'w-full pl-10 pr-3 py-2.5 text-center',
        'bg-slate-100 dark:bg-slate-950',
        'text-gray-900 dark:text-white',
        'text-sm font-normal',
        'border rounded-lg transition-colors duration-200',
        'focus:outline-none focus:ring-1',
        'placeholder:text-slate-400 dark:placeholder:text-gray-600',
        // Password masking fallback
        {
          'font-mono tracking-wider': !showPhrase && usePasswordType,
        },
        // Border and focus states
        {
          'border-gray-200 dark:border-gray-700/50 focus:ring-blue-500 focus:border-blue-500':
            !hasError && isEmpty,
          'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20':
            hasError,
          'border-green-500 bg-green-50 dark:bg-green-950/20':
            phrase && isValidWord(phrase) && !isEmpty,
          'opacity-50 cursor-not-allowed': disabled,
        }
      );
    };

    const getInputType = () => {
      if (showPhrase) return 'text';
      return usePasswordType ? 'password' : 'text';
    };

    const getInputStyle = () => {
      if (showPhrase || usePasswordType) return {};

      // Use CSS text-security for better UX
      return {
        WebkitTextSecurity: 'disc',
        textSecurity: 'disc',
      } as React.CSSProperties;
    };

    return (
      <div
        ref={ref}
        className={clsx('grid grid-cols-2 sm:grid-cols-4 gap-4', className)}
        {...props}
      >
        {phrases.map((phrase, index) => {
          const hasWordError = phrase && !isValidWord(phrase);

          return (
            <div key={index} className="flex">
              <div className="relative w-full">
                <div className="absolute text-sm text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-slate-400 pointer-events-none z-10">
                  {index + 1}.
                </div>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={phrase}
                  type={getInputType()}
                  style={getInputStyle()}
                  onChange={(e) => handlePhraseChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => handleFocus(index, e)}
                  disabled={disabled}
                  aria-label={`Phrase ${index + 1}`}
                  aria-invalid={hasWordError}
                  className={getInputClassName(phrase, index)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={showPhrase ? '' : '••••••'}
                  data-testid={`mnemonic-input-${index}`}
                />
                {/* Validation indicator */}
                {phrase && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isValidWord(phrase) ? (
                      <div className="w-2 h-2 bg-successDark rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-error rounded-full" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

MnemonicInput.displayName = 'MnemonicInput';

export default MnemonicInput;
