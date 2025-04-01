'use client';

import {
  mdiChevronDown,
  mdiCog,
  mdiLogout,
  mdiShieldCheck,
  mdiWhiteBalanceSunny,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useTheme } from '../../context/ThemeContext';
import Dropdown from '../Dropdown';
import Typography from '../Typography';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@headlessui/react';

interface AccountDropdownProps {
  walletAddress: string;
  onVerifyWallet: () => void;
  onSettings: () => void;
  onThemeToggle: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

const AccountDropdown = ({
  walletAddress,
  onVerifyWallet,
  onSettings,
  onThemeToggle,
  onLogout,
  theme,
}: AccountDropdownProps) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: mdiShieldCheck,
      label: 'Verify Wallet',
      onClick: onVerifyWallet,
    },
    {
      icon: mdiCog,
      label: 'Settings',
      onClick: onSettings,
    },
    {
      icon: mdiWhiteBalanceSunny,
      label: theme === 'light' ? 'Dark' : 'Light',
      onClick: onThemeToggle,
    },
    {
      icon: mdiLogout,
      label: 'Logout',
      onClick: onLogout,
    },
  ];

  return (
    <Dropdown
      trigger={<Typography>Account</Typography>}
      menuButtonClassName="-ml-4 !bg-transparent !border-0 hover:!bg-transparent dark:hover:!bg-transparent"
      menuItemsClassName="absolute mt-4 origin-top-right border w-fit rounded-xl border-slate-700 bg-slate-950"
      placement="bottom-end"
    >
      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <div key={item.label} className="relative group">
          <MenuItem>
            {({ active }) => (
              <div className="flex items-center w-full">
                <button
                  role="menuitem"
                  onClick={item.onClick}
                  className={`
                    flex-1 px-4 py-3 flex gap-4 items-center
                    ${active ? 'bg-white/10' : ''}
                    `}
                >
                  <Icon
                    path={item.icon}
                    size={0.8}
                    className="text-slate-950 dark:text-slate-100"
                  />
                  <Typography>{item.label}</Typography>
                </button>
              </div>
            )}
          </MenuItem>
        </div>
      ))}
    </Dropdown>
  );
};

export default AccountDropdown;
