import * as React from 'react';

import { CheckboxProps } from './Checkbox.types';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, className = '', disabled = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        id={id}
        disabled={disabled}
        className={`h-4 w-4 rounded border-slate-300 bg-transparent text-primary
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
