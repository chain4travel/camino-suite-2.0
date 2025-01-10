import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import CamBtn from '.';
import Icon from '@mdi/react';
import React from 'react';
import { mdiAccount } from '@mdi/js';

// Mock clsx
jest.mock('clsx', () => ({
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

describe('CamBtn', () => {
  const getClasses = (element: HTMLElement) => element.className.split(' ');

  it('renders button with default props', () => {
    render(<CamBtn>Click me</CamBtn>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click me');
    expect(getClasses(button)).toContain('bg-primary');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<CamBtn variant="secondary">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('border-slate-600');

    rerender(<CamBtn variant="positive">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('bg-successLight');

    rerender(<CamBtn variant="negative">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('bg-error');

    rerender(<CamBtn variant="accent">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient1');

    rerender(<CamBtn variant="transparent">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<CamBtn size="sm">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1 text-sm');

    rerender(<CamBtn size="md">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-base');

    rerender(<CamBtn size="lg">Button</CamBtn>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-4 text-lg');
  });

  it('renders loading state', () => {
    render(<CamBtn isLoading>Click me</CamBtn>);
    expect(screen.getByRole('button')).toHaveTextContent('Loading...');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders disabled state', () => {
    render(<CamBtn disabled>Click me</CamBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with icons', () => {
    const icon = <Icon path={mdiAccount} size={1} />;
    render(
      <CamBtn leftIcon={icon} rightIcon={icon}>
        With Icons
      </CamBtn>
    );

    const button = screen.getByRole('button');
    expect(button.querySelector('.mr-2')).toBeInTheDocument();
    expect(button.querySelector('.ml-2')).toBeInTheDocument();
  });


  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<CamBtn onClick={handleClick}>Click me</CamBtn>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<CamBtn ref={ref}>Button</CamBtn>);
    expect(ref).toHaveBeenCalled();
  });
});
