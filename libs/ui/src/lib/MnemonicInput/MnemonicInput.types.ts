import { HTMLAttributes } from 'react';

export interface MnemonicInputProps {
  className?: string;
  phrases: string[];
  onChange?: (phrases: string[]) => void;
  showPhrase?: boolean;
  error?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
