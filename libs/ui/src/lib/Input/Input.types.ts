import React, { InputHTMLAttributes, MouseEvent } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  rightIcon?: React.ReactNode;
  isSuccess?: boolean;
  onIconClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  iconAriaLabel?: string;
  iconDisabled?: boolean;
  variant?: 'default' | 'validation-code' | 'textarea';
  required?: boolean;
}
