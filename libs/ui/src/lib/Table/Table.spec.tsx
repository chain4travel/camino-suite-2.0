import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from './index';

describe('Table', () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age', align: 'right' as const },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => <span data-testid="custom-cell">{row.status}</span>,
    },
  ];

  const data = [
    { id: 1, name: 'John', age: 30, status: 'Active' },
    { id: 2, name: 'Jane', age: 25, status: 'Inactive' },
  ];

  it('renders headers correctly', () => {
    render(<Table columns={columns} data={data} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    render(<Table columns={columns} data={data} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getAllByTestId('custom-cell')[0]).toHaveTextContent('Active');
  });

  it('handles empty data', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies alignment classes correctly', () => {
    render(<Table columns={columns} data={data} />);
    
    const ageCell = screen.getByText('30').closest('td');
    expect(ageCell).toHaveClass('text-right');
  });

  it('handles row click', () => {
    const onRowClick = jest.fn();
    render(<Table columns={columns} data={data} onRowClick={onRowClick} />);
    
    fireEvent.click(screen.getByText('John'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('applies custom className', () => {
    render(<Table columns={columns} data={data} className="custom-class" />);
    const table = screen.getByRole('table').parentElement;
    expect(table).toHaveClass('custom-class');
  });
}); 