'use client'

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { mdiClose, mdiMenu, mdiWalletOutline, mdiWhiteBalanceSunny } from '@mdi/js';

import Drawer from './Drawer';
import Icon from '@mdi/react';
import Link from 'next/link';
import { Network } from '../NetworkModal/NetworkModal.types';
import NetworkModal from '../NetworkModal/NetworkModal';
import { NetworkOption } from '../NetworkSwitcher/NetworkSwitcher.types';
import NetworkSwitcher from '../NetworkSwitcher';
import { PLATFORM_SWITCHER } from '@camino/data';
import PlatformSwitcher from '../PlatformSwitcher';
import Typography from '../Typography';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<NetworkOption | null>(null);
  const [customNetworks, setCustomNetworks] = useState<NetworkOption[]>([]);
  const [activeNetwork, setActiveNetwork] = useState<NetworkOption | null>(null);

  const defaultNetworks: NetworkOption[] = [
    {
      name: 'Camino',
    },
    {
      name: 'Columbus',
    }
  ];

  const handleAddNetwork = (network: Network) => {
    const newNetwork: NetworkOption = {
      ...network,
      isCustom: true,
    };
    setCustomNetworks(prev => [...prev, newNetwork]);
    // Set the new network as active
    const networkSwitcherOption = {
      name: network.name,
      isCustom: true,
      url: network.url,
      magellanAddress: network.magellanAddress,
      signavaultAddress: network.signavaultAddress,
    };
    handleNetworkSelect(networkSwitcherOption);
  };

  const handleEditNetwork = (network: Network) => {
    if (!editingNetwork) return;

    setCustomNetworks(prev =>
      prev.map(n =>
        n.name === editingNetwork.name
          ? { ...network, isCustom: true }
          : n
      )
    );
    setEditingNetwork(null);
  };

  const handleDeleteNetwork = (network: NetworkOption) => {
    setCustomNetworks(prev => prev.filter(n => n.name !== network.name));
  };

  const handleModalClose = () => {
    setIsNetworkModalOpen(false);
    setEditingNetwork(null);
  };

  const handleNetworkSelect = (network: NetworkOption) => {
    setActiveNetwork(network);
    // Handle network selection
    console.log('Selected network:', network);
    // Add your network selection logic here
  };

  const allNetworks = [...defaultNetworks, ...customNetworks];

  const handleSwitcherSelect = () => {
    console.log('Selected option:');
  };

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <button
        className="flex items-center gap-1 text-sm capitalize"
        onClick={() => {
          toggleTheme();
          onItemClick?.();
        }}
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
      <NetworkSwitcher
        options={allNetworks}
        onSelect={(network) => {
          handleNetworkSelect(network);
          onItemClick?.();
        }}
        activeNetwork={activeNetwork?.name || ''}
        onAddNetwork={() => {
          setIsNetworkModalOpen(true);
          onItemClick?.();
        }}
        onEditNetwork={(network: NetworkOption) => {
          setEditingNetwork(network);
          setIsNetworkModalOpen(true);
          onItemClick?.();
        }}
        onDeleteNetwork={(network) => {
          handleDeleteNetwork(network);
          onItemClick?.();
        }}
      />
      <Link href="/login" onClick={onItemClick}>
        <Typography className='flex gap-1'>
          <Icon path={mdiWalletOutline} size={1} /> Login
        </Typography>
      </Link>
    </>
  );

  return (
    <>
      <nav
        className={clsx(
          'w-full px-4 py-4 border-b border-slate-700 relative z-50',
          theme === 'light' ? 'bg-white' : 'bg-slate-950'
        )}
      >
        <div className="container flex items-center justify-between mx-auto max-w-container">
          {/* Left side - Platform Switcher */}
          <PlatformSwitcher
            options={PLATFORM_SWITCHER}
            activeApp=""
            onSelect={handleSwitcherSelect}
          />

          {/* Right side - Desktop Menu */}
          <div className="items-center hidden gap-4 md:flex">
            <NavItems />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="menu"
          >
            <Icon
              path={mdiMenu}
              size={1}
              className={theme === 'light' ? '[&>path]:!fill-slate-950' : '[&>path]:!fill-slate-100'}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        theme={theme}
      >
        <NavItems onItemClick={() => setIsMobileMenuOpen(false)} />
      </Drawer>

      {/* Network Modal */}
      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={handleModalClose}
        onSubmit={editingNetwork ? handleEditNetwork : handleAddNetwork}
        initialValues={editingNetwork ? {
          name: editingNetwork.name,
          url: editingNetwork.url || '',
          magellanAddress: editingNetwork.magellanAddress || '',
          signavaultAddress: editingNetwork.signavaultAddress || ''
        } : undefined}
        mode={editingNetwork ? t('common.edit') : t('common.add')}
      />
    </>
  );
};

export default Navbar;
