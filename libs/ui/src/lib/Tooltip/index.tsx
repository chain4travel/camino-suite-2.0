'use client';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClick?: () => void;
}

export const Tooltip = ({
  children,
  content,
  className,
  position = 'top',
  onClick,
  ...props
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={clsx('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={onClick}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 px-2 py-1 text-sm text-white bg-slate-900 rounded whitespace-nowrap',
            'after:absolute after:border-4 after:border-transparent',
            positionClasses[position],
            position === 'top' &&
              'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-slate-900',
            position === 'bottom' &&
              'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-slate-900',
            position === 'left' &&
              'after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-slate-900',
            position === 'right' &&
              'after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-slate-900'
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
