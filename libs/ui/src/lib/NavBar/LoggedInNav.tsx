'use client';

import { mdiMenu, mdiWalletOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';
import AccountDropdown from './AccountDropdown';
import { useRouter } from 'next/navigation';

interface LoggedInNavProps {
  onMobileMenuOpen: () => void;
  onLogout: () => void;
  walletAddress?: string;
}

const LoggedInNav = ({
  onMobileMenuOpen,
  onLogout,
  walletAddress = 'P-cami...enkl8',
}: LoggedInNavProps) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleVerifyWallet = () => {
    router.push('/verify-wallet');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="-ml-4 flex items-center gap-4">
      {/* Wallet Address Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
        <Icon
          path={mdiWalletOutline}
          size={1}
          className="text-slate-950 dark:text-slate-100"
        />
        <Typography className="text-slate-500">{walletAddress}</Typography>
      </div>

      <AccountDropdown
        walletAddress={walletAddress}
        onVerifyWallet={handleVerifyWallet}
        onSettings={handleSettings}
        onThemeToggle={toggleTheme}
        onLogout={onLogout}
        theme={theme}
      />

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

export default LoggedInNav;
