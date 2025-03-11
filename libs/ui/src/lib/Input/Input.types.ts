import React, { MouseEvent } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
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
  required?: boolean;
}
