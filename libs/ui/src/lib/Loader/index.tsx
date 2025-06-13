import clsx from 'clsx';
import { LoaderProps } from './Loader.types';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
} as const;

export const Loader = ({
  size = 'md',
  className,
  color = 'primary',
}: LoaderProps) => {
  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-slate-500',
    white: 'border-white',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-solid',
        'border-t-transparent',
        sizes[size],
        colorClasses[color],
        className
      )}
      data-testid="loader"
      role="status"
      aria-label="Loading"
    />
  );
}; 