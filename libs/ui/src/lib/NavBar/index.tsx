'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import Drawer from './Drawer';
import NetworkModal from '../NetworkModal/NetworkModal';
import { NetworkOption } from '../NetworkSwitcher/NetworkSwitcher.types';
import NetworkSwitcher from '../NetworkSwitcher';
import { PLATFORM_SWITCHER } from '@camino/data';
import PlatformSwitcher from '../PlatformSwitcher';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { OptionType } from '../PlatformSwitcher/PlatformSwitcher.types';
import { useRouter } from 'next/navigation';
import LoggedInNav from './LoggedInNav';
import LoggedOutNav from './LoggedOutNav';
import ThemeToggle from './ThemeToggle';
import { useNetwork } from '../../hooks/useNetwork';
import { AvaNetwork, useWalletStore } from '@camino/store';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuth, logout, address, activeWallet } = useWalletStore();
  const {
    allNetworks,
    selectedNetwork: activeNetwork,
    switchNetwork,
    addNetwork,
  } = useNetwork();
  // Get active platform based on current path
  const getActivePlatform = () => {
    return (
      PLATFORM_SWITCHER.find((platform) => {
        // Remove trailing slash from both paths for comparison
        const cleanPathname = pathname?.replace(/\/$/, '') || '';

        // Check if current path starts with platform url
        return (
          cleanPathname === platform.url ||
          cleanPathname.startsWith(`${platform.url}/`)
        );
      })?.name || ''
    );
  };

  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<NetworkOption | null>(
    null
  );

  const handleAddNetwork = (network: AvaNetwork) => {
    addNetwork(network);
  };

  const handleEditNetwork = (network: AvaNetwork) => {
    if (!editingNetwork) return;
    setEditingNetwork(null);
  };

  const handleDeleteNetwork = (network: NetworkOption) => {
    // setCustomNetworks((prev) => prev.filter((n) => n.name !== network.name));
  };

  const handleModalClose = () => {
    setIsNetworkModalOpen(false);
    setEditingNetwork(null);
  };

  const handleNetworkSelect = (network: AvaNetwork) => {
    switchNetwork(network);
  };

  const handleSwitcherSelect = (option: OptionType) => {
    router.push(option.url);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
  };

  // Add wallet address state
  const walletAddress = useMemo(() => {
    return activeWallet?.getCurrentAddressPlatform();
  }, [address]);

  const handleVerifyWallet = () => {
    router.push('/verify-wallet');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <>
      <nav
        className={clsx(
          'w-full px-2 lg:px-8 py-4 border-b border-slate-700 relative z-50',
          theme === 'light' ? 'bg-white' : 'bg-slate-950'
        )}
      >
        <div className="container flex items-center justify-between mx-auto max-w-container">
          {/* Left side - Platform Switcher */}
          <PlatformSwitcher
            options={PLATFORM_SWITCHER}
            activeApp={getActivePlatform()}
            onSelect={handleSwitcherSelect}
          />

          {/* Right side - Network Switcher and Auth Nav */}
          <div className="items-center hidden gap-4 md:flex">
            {!isAuth && <ThemeToggle />}
            <NetworkSwitcher
              options={allNetworks}
              onSelect={handleNetworkSelect}
              activeNetwork={activeNetwork?.name || ''}
              onAddNetwork={() => setIsNetworkModalOpen(true)}
              onEditNetwork={(network) => {
                setEditingNetwork(network);
                setIsNetworkModalOpen(true);
              }}
              onDeleteNetwork={handleDeleteNetwork}
            />

            {isAuth ? (
              <LoggedInNav
                onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                onLogout={handleLogout}
                walletAddress={walletAddress}
              />
            ) : (
              <LoggedOutNav
                onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                onLogin={handleLogin}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        networks={allNetworks}
        activeNetwork={activeNetwork?.name || ''}
        onNetworkSelect={handleNetworkSelect}
        onAddNetwork={() => setIsNetworkModalOpen(true)}
        onEditNetwork={(network) => {
          setEditingNetwork(network);
          setIsNetworkModalOpen(true);
        }}
        onDeleteNetwork={handleDeleteNetwork}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAuthenticated={isAuth}
        onVerifyWallet={handleVerifyWallet}
        onSettings={handleSettings}
      />

      {/* Network Modal */}
      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={handleModalClose}
        onSubmit={editingNetwork ? handleEditNetwork : handleAddNetwork}
        initialValues={
          editingNetwork
            ? {
                name: editingNetwork.name,
                url: editingNetwork.url || '',
                magellanAddress: editingNetwork.magellanAddress || '',
                signavaultAddress: editingNetwork.signavaultAddress || '',
                status: editingNetwork.status || 'custom',
              }
            : undefined
        }
        editingNetworkmode={!!editingNetwork}
      />
    </>
  );
};

export default Navbar;
