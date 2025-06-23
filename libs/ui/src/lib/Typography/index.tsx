import { TypographyProps, Variant } from './Typography.types';

import React from 'react';
import { clsx } from 'clsx';

const variantClasses: Record<Variant, string> = {
  h1: 'text-2xl lg:text-4xl font-bold',
  h2: 'text-xl lg:text-3xl font-bold',
  h3: 'text-lg lg:text-2xl font-bold',
  h4: 'text-base lg:text-xl font-semibold',
  h5: 'text-sm lg:text-base font-semibold',
  h6: 'text-xs lg:text-sm font-medium',
  body1: 'text-sm lg:text-base font-normal',
  body2: 'text-xs lg:text-sm font-normal',
  caption: 'text-xs lg:text-sm font-light',
  overline: 'text-xs lg:text-sm font-light uppercase tracking-wider',
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
