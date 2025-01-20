import { ButtonHTMLAttributes } from "react";

export type Variant =
  | 'primary'
  | 'secondary'
  | 'positive'
  | 'negative'
  | 'accent'
  | 'transparent';
export type Size = 'sm' | 'md' | 'lg';

export interface CamBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
