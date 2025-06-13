'use client';

import { mdiMenu, mdiWalletOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';

interface LoggedOutNavProps {
  onMobileMenuOpen: () => void;
  onLogin: () => void;
}

const LoggedOutNav = ({ onMobileMenuOpen, onLogin }: LoggedOutNavProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <button onClick={onLogin}>
        <Typography className="flex gap-1">
          <Icon path={mdiWalletOutline} size={1} /> Login
        </Typography>
      </button>

      <button
        className="md:hidden"
        onClick={onMobileMenuOpen}
        aria-label="menu"
      >
        <Icon
          path={mdiMenu}
          size={1}
          className={
            theme === 'light'
              ? '[&>path]:!fill-slate-950'
              : '[&>path]:!fill-slate-100'
          }
        />
      </button>
    </div>
  );
};

export default LoggedOutNav; 