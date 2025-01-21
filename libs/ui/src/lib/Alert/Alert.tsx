import {
  mdiAlertOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiInformationOutline
} from '@mdi/js';

import { AlertProps } from './types';
import Icon from '@mdi/react';
import React from 'react';

const variantStyles = {
  default: 'bg-slate-100 border-slate-300 dark:bg-slate-900 dark:border-slate-700',
  primary: 'bg-primary-5 border-primary-50',
  positive: 'bg-successDark-5 border-successDark-50',
  warning: 'bg-warning-5 border-warning-50 dark:border-warning-30',
  negative: 'bg-error-5 border-error-50 dark:border-error-30'
};

const iconMap = {
  default: mdiInformationOutline,
  primary: mdiInformationOutline,
  positive: mdiCheckCircleOutline,
  warning: mdiAlertOutline,
  negative: mdiCloseCircleOutline
};

const iconColors = {
  default: 'text-slate-700 dark:text-slate-300',
  primary: 'text-primary',
  positive: 'text-successDark',
  warning: 'text-warning',
  negative: 'text-error'
};

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = 'default',
  className = '',
  ...props
}) => {
  const iconPath = iconMap[variant];

  return (
    <div
      className={`w-full h-fit flex items-start gap-3 p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <Icon
        path={iconPath}
        size={1}
        className={`mt-0.5 flex-shrink-0 ${iconColors[variant]}`}
      />
      <div className="flex-1">
        {title && (
          <h3 className="mb-1 font-semibold font-inter text-slate-800 dark:text-white">
            {title}
          </h3>
        )}
        <div className="text-sm text-slate-700 dark:text-slate-300 font-inter">
          {description}
        </div>
      </div>
    </div>
  );
};

export default Alert;
