import { ReactNode } from "react";

export interface UTXO {
  id: string;
  type: string;
  threshold: number;
  owners: string;
  balance: string;
}

export interface Chain {
  name: string;
  utxos: UTXO[];
}

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