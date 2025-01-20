import { CamBtnProps } from './CamBtn.types';
import Icon from '@mdi/react';
import clsx from 'clsx';
import { forwardRef } from 'react';

const CamBtn = forwardRef<HTMLButtonElement, CamBtnProps>((props, ref) => {
  const {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    ...rest
  } = props;

  const baseStyles =
    'h-fit inline-flex items-center justify-center font-inter rounded-lg capitalize font-medium transition-colors focus:outline-none';
  const variants = {
    primary: 'text-slate-100 bg-primary hover:bg-primary/90',
    secondary:
      'text-slate-700 bg-transparent border border-slate-600 hover:border-gray-300 dark:text-slate-100 dark:bg-slate-950',
    positive: 'text-slate-100 bg-successLight hover:bg-successLight/90',
    negative: 'text-slate-100 bg-error hover:bg-error/90',
    accent: 'text-slate-100 bg-gradient1 hover:bg-gradient1/90',
    transparent:
      'bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        {
          'opacity-50 cursor-not-allowed': disabled || isLoading,
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {leftIcon && (
        <Icon
          className="mr-2 text-gray-700 dark:text-slate-300 group-enabled:group-hover:text-white dark:group-enabled:group-hover:text-slate-950"
          size={1}
          path={leftIcon as string}
        />
      )}
      {isLoading ? 'Loading...' : children}
      {rightIcon && (
        <Icon
          className="ml-2 text-gray-700 dark:text-slate-300 group-enabled:group-hover:text-white dark:group-enabled:group-hover:text-slate-950"
          size={1}
          path={rightIcon as string}
        />
      )}
    </button>
  );
});

CamBtn.displayName = 'CamBtn';

export default CamBtn;
