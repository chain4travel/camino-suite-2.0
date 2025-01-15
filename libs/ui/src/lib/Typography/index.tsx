import { TypographyProps, Variant } from './Typography.types';

import React from 'react';
import { clsx } from 'clsx';

const variantClasses: Record<Variant, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-medium',
  body1: 'text-base font-normal',
  body2: 'text-sm font-normal',
  caption: 'text-xs font-light',
  overline: 'text-xs font-light uppercase tracking-wider',
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  as: Component = 'span',
  className,
  color,
  children,
  ...rest
}) => {
  const classes = clsx(
    'text-slate-950 dark:text-slate-100 font-inter',
    variantClasses[variant],
    className
  );

  return (
    <Component className={classes} style={{ color }} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
