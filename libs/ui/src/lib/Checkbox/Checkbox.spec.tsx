import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import Checkbox from '.';
import React from 'react';

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox id="test" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Checkbox id="test" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Checkbox id="test" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('can be checked', () => {
    render(<Checkbox id="test" checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
