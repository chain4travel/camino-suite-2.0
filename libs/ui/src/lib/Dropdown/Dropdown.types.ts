import { HTMLAttributes, ReactNode } from 'react';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  startIcon?: string;
  endIcon?: string;
  renderItem?: () => ReactNode;
}

// Create a type for the custom props
interface CustomDropdownProps {
  trigger: ReactNode;
  items?: DropdownItem[];
  children?: ReactNode;
  className?: string;
  menuButtonClassName?: string;
  menuItemsClassName?: string;
  menuItemClassName?: string;
  startIcon?: string;
  endIcon?: string;
  onSelect?: (item: DropdownItem) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  showDividers?: boolean;
}

// Extend HTMLAttributes<HTMLDivElement> while omitting any conflicting prop names
export type DropdownProps = CustomDropdownProps & Omit<HTMLAttributes<HTMLDivElement>, keyof CustomDropdownProps>;