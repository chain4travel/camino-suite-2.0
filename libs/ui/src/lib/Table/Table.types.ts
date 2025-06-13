import { ReactNode } from 'react';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableVariant = 'default' | 'transparent';
export type TableLayout = 'auto' | 'fixed' | 'spaceBetween';

export interface Column<T> {
  /**
   * Unique key for the column
   */
  key: keyof T;
  /**
   * Header text for the column (optional)
   */
  header?: string;
  /**
   * Alignment of the column content
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Custom render function for the column
   */
  render?: (row: T) => ReactNode;
  /**
   * Width of the column (e.g., 'w-1/4', 'w-32', etc.)
   */
  width?: string;
  /**
   * Layout behavior for the column
   * @default 'auto'
   */
  layout?: TableLayout;
}

export interface TableProps<T> {
  /**
   * Array of column definitions
   */
  columns: Column<T>[];
  /**
   * Array of data to display
   */
  data: T[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: T) => void;
  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Custom empty state message
   * @default 'No data available'
   */
  emptyMessage?: string;
  /**
   * Size variant of the table
   * @default 'md'
   */
  size?: TableSize;
  /**
   * Visual variant of the table
   * @default 'default'
   */
  variant?: TableVariant;
  /**
   * Whether to show dividers between rows
   * @default true
   */
  showDividers?: boolean;
  /**
   * Whether to show hover effect on rows
   * @default true
   */
  showHover?: boolean;
  /**
   * Layout behavior for the table
   * @default 'auto'
   */
  layout?: TableLayout;
} 