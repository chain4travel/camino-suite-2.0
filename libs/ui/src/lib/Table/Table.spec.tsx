import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from './index';
import clsx from 'clsx';

// Define the type for the row
interface RowData {
  id: number;
  name: string;
  age: number;
  status: string;
  [key: string]: unknown;
}

// Mock clsx
jest.mock('clsx', () => {
  const clsxFn = (...args: unknown[]) => {
    const classes = args.filter(Boolean).map((arg) => {
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        return Object.entries(arg as Record<string, boolean>)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return arg;
    });
    return classes.flat().join(' ');
  };

  return {
    __esModule: true,
    default: clsxFn,
    clsx: clsxFn,
  };
});

describe('Table', () => {
  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'age' as const, header: 'Age', align: 'right' as const },
    {
      key: 'status' as const,
      header: 'Status',
      render: (row: RowData) => <span data-testid="custom-cell">{row.status}</span>,
    },
  ];

  const data: RowData[] = [
    { id: 1, name: 'John', age: 30, status: 'Active' },
    { id: 2, name: 'Jane', age: 25, status: 'Inactive' },
  ];

  it('renders headers correctly', () => {
    render(<Table<RowData> columns={columns} data={data} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    render(<Table<RowData> columns={columns} data={data} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getAllByTestId('custom-cell')[0]).toHaveTextContent('Active');
  });

  it('handles empty data', () => {
    render(<Table<RowData> columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies alignment classes correctly', () => {
    render(<Table<RowData> columns={columns} data={data} />);
    
    const ageCell = screen.getByText('30').closest('td');
    expect(ageCell).toHaveClass('text-right');
  });

  it('handles row click', () => {
    const onRowClick = jest.fn();
    render(<Table<RowData> columns={columns} data={data} onRowClick={onRowClick} />);
    
    fireEvent.click(screen.getByText('John'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
}); 