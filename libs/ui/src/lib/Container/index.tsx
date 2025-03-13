'use client';
import React from 'react';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={clsx(
        'w-full h-full container mx-auto max-w-container gap-4 lg:px-4 py-6',
        className
      )}
    >
      {children}
    </div>
  );
}; 