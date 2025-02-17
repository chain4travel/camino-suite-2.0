import React from 'react';
import clsx from 'clsx';
import Typography from '../Typography';
import { TableProps, TableSize, Column } from './Table.types';
import { TypographyProps } from '../Typography/Typography.types';

const tableSizes: Record<
  TableSize,
  { padding: string; typography: TypographyProps['variant'] }
> = {
  sm: { padding: 'px-4 py-2', typography: 'body2' },
  md: { padding: 'px-6 py-4', typography: 'body1' },
  lg: { padding: 'px-8 py-6', typography: 'h6' },
};

export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  className,
  onRowClick,
  showHeader = true,
  emptyMessage = 'No data available',
  size = 'md',
  variant = 'default',
  showDividers = true,
  showHover = true,
  layout = 'auto',
}: TableProps<T>) => {
  const { padding, typography } = tableSizes[size];

  const renderCell = (value: unknown) => {
    if (value === null || value === undefined) return null;
    return <Typography variant={typography}>{String(value)}</Typography>;
  };

  const getColumnClass = (column: Column<T>) => {
    if (column.layout === 'fixed' || layout === 'fixed') {
      return column.width;
    }

    if (column.layout === 'spaceBetween' || layout === 'spaceBetween') {
      return 'flex-1';
    }

    return column.width;
  };

  return (
    <div
      className={clsx(
        'w-full rounded-lg',
        variant === 'default' && 'bg-gray-200/50 dark:bg-slate-800/50',
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {showHeader && (
            <thead className={clsx(showDividers && 'border-b border-slate-700')}>
              <tr
                className={clsx(
                  layout === 'spaceBetween' && 'flex justify-between'
                )}
              >
                {columns.map((column: Column<T>) => (
                  <th
                    key={column.key as string}
                    className={clsx(
                      padding,
                      getColumnClass(column),
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      !column.align && 'text-left'
                    )}
                  >
                    {column.header && (
                      <Typography variant="body2" className="!text-slate-400">
                        {column.header}
                      </Typography>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={clsx(showDividers && 'divide-y divide-slate-700')}>
            {data.map((row: T, index: number) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'transition-colors',
                  layout === 'spaceBetween' && 'flex justify-between',
                  showHover && 'hover:bg-gray-300/50 dark:hover:bg-slate-800/50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column: Column<T>) => (
                  <td
                    key={column.key as string}
                    className={clsx(
                      padding,
                      getColumnClass(column),
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      !column.align && 'text-left'
                    )}
                  >
                    {column.render
                      ? column.render(row)
                      : renderCell(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className={clsx('text-center', padding)}>
          <Typography
            variant="body1"
            className="text-slate-500 dark:text-slate-400"
          >
            {emptyMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};
