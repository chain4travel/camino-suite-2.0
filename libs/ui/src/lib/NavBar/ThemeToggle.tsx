'use client';

import { mdiWhiteBalanceSunny } from '@mdi/js';
import Icon from '@mdi/react';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="flex items-center gap-1 text-sm capitalize"
      onClick={toggleTheme}
    >
      <Icon
        path={mdiWhiteBalanceSunny}
        size={1}
        className={
          theme === 'light'
            ? '[&>path]:!fill-slate-950'
            : '[&>path]:!fill-slate-100'
        }
      />
      <Typography>{theme}</Typography>
    </button>
  );
};

export default ThemeToggle; 