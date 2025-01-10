'use client';

import { BadgeSize, BadgeVariant, CamBadgeProps } from './CamBadge.types';
import React, { forwardRef } from 'react';

import clsx from 'clsx';

const getBadgeStyles = (variant: BadgeVariant) => {
  const styles = {
    primary: 'bg-blue-500/20 text-blue-500',
    positive: 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400',
    negative: 'bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400',
    verified: 'bg-cyan-400 text-slate-800',
    default: 'bg-slate-800 text-slate-300',
    new: 'bg-blue-500 text-white',
    approved: 'bg-green-500 text-white',
    'access-denied': 'bg-red-500 text-white'
  };

  return styles[variant];
};

const getSizeStyles = (size: BadgeSize) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return sizes[size];
};

const CamBadge = forwardRef<HTMLSpanElement, CamBadgeProps>(
  ({ variant = 'default', size = 'sm', className = '', text, ...props }, ref) => {
    const badgeClasses = clsx(
      'h-fit inline-flex items-center rounded-md font-medium uppercase',
      getSizeStyles(size),
      getBadgeStyles(variant),
      className
    );

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {text}
      </span>
    );
  }
);

CamBadge.displayName = 'CamBadge';

export default CamBadge;
