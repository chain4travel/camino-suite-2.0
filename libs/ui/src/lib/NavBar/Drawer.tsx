'use client';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import Icon from '@mdi/react';
import Typography from '../Typography';
import { clsx } from 'clsx';
import {
  mdiClose,
  mdiCheckDecagram,
  mdiCog,
  mdiLogout,
  mdiPencil,
  mdiTrashCan,
  mdiWhiteBalanceSunny,
  mdiWalletOutline,
  mdiPlus,
} from '@mdi/js';
import { useTranslation } from 'react-i18next';
import { NetworkOption } from '../NetworkSwitcher/NetworkSwitcher.types';
import CamBadge from '../CamBadge';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  networks: NetworkOption[];
  activeNetwork: string;
  onNetworkSelect: (network: NetworkOption) => void;
  onAddNetwork: () => void;
  onEditNetwork: (network: NetworkOption) => void;
  onDeleteNetwork: (network: NetworkOption) => void;
  onVerifyWallet: () => void;
  onSettings: () => void;
  onLogout: () => void;
  toggleTheme: () => void;
  onLogin: () => void;
  isAuthenticated?: boolean;
}

const Drawer = ({
  isOpen,
  onClose,
  theme,
  networks,
  activeNetwork,
  onNetworkSelect,
  onAddNetwork,
  onEditNetwork,
  onDeleteNetwork,
  onVerifyWallet,
  onSettings,
  onLogout,
  toggleTheme,
  onLogin,
  isAuthenticated,
}: DrawerProps) => {
  const { t } = useTranslation();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="w-screen max-w-[22rem] pointer-events-auto">
                  <div
                    className={clsx(
                      'flex h-full flex-col overflow-y-scroll py-6 shadow-xl',
                      theme === 'light' ? 'bg-white' : 'bg-slate-950'
                    )}
                  >
                    {/* Header */}
                    <div className="px-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center justify-between gap-4">
                        {/* Theme Toggle */}
                        <button
                          className="flex items-center gap-2"
                          onClick={toggleTheme}
                        >
                          <Icon
                            path={mdiWhiteBalanceSunny}
                            size={1}
                            className="text-slate-950 dark:text-slate-100"
                          />
                          <Typography className="capitalize">
                            {theme}
                          </Typography>
                        </button>
                        <button
                          className="flex items-center gap-2"
                          onClick={() => {
                            onLogin();
                            onClose();
                          }}
                        >
                          <Icon
                            path={mdiWalletOutline}
                            size={1}
                            className="text-slate-950 dark:text-slate-100"
                          />
                          <Typography>Login</Typography>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="relative rounded-md text-slate-950 dark:text-slate-100 hover:text-gray-500"
                        onClick={onClose}
                        aria-label="close"
                      >
                        <Icon
                          path={mdiClose}
                          size={1}
                          className="text-slate-950 dark:text-slate-100"
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col px-4 sm:px-6 mt-4">
                      <Typography
                        variant="body1"
                        className="mb-4 !text-slate-400"
                      >
                        {t('common.networks')}
                      </Typography>
                      {/* Network List */}
                      <div className="flex flex-col gap-2">
                        {networks.map((network) => (
                          <div
                            key={network.name}
                            className="flex items-center justify-between w-full p-2 rounded-lg group"
                          >
                            <button
                              className="flex items-center justify-between flex-1 text-left"
                              onClick={() => {
                                onNetworkSelect(network);
                                onClose();
                              }}
                            >
                              <Typography>{network.name}</Typography>
                              {network.name === activeNetwork && (
                                <CamBadge
                                  variant="positive"
                                  text={t('common.connected')}
                                />
                              )}
                            </button>
                            {network.isCustom && (
                              <div className="hidden group-hover:flex items-center gap-2">
                                <button onClick={() => onEditNetwork(network)}>
                                  <Icon
                                    path={mdiPencil}
                                    size={0.8}
                                    className="text-slate-950 dark:text-slate-100"
                                  />
                                </button>
                                <button
                                  onClick={() => onDeleteNetwork(network)}
                                >
                                  <Icon
                                    path={mdiTrashCan}
                                    size={0.8}
                                    className="text-slate-950 dark:text-slate-100"
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Add Custom Network Button */}
                        <button
                          className="flex items-center gap-2 w-full p-2"
                          onClick={() => {
                            onAddNetwork();
                            onClose();
                          }}
                        >
                          <Typography>Add Custom Network</Typography>
                          <Icon
                            path={mdiPlus}
                            size={0.8}
                            className="text-slate-950 dark:text-slate-100"
                          />
                        </button>
                      </div>

                      {/* Bottom Actions */}
                      <div className="mt-auto pt-6 w-full flex flex-col gap-6 self-end">
                        <button
                          className="flex items-center gap-2"
                          onClick={() => {
                            onVerifyWallet();
                            onClose();
                          }}
                        >
                          <Icon
                            path={mdiCheckDecagram}
                            size={1}
                            className="text-slate-950 dark:text-slate-100"
                          />
                          <Typography>Verify Wallet</Typography>
                        </button>
                        <button
                          className="flex items-center gap-2"
                          onClick={() => {
                            onSettings();
                            onClose();
                          }}
                        >
                          <Icon
                            path={mdiCog}
                            size={1}
                            className="text-slate-950 dark:text-slate-100"
                          />
                          <Typography>Settings</Typography>
                        </button>
                        <button
                          className="flex items-center gap-2"
                          onClick={() => {
                            onLogout();
                            onClose();
                          }}
                        >
                          <Icon
                            path={mdiLogout}
                            size={1}
                            className="text-slate-950 dark:text-slate-100"
                          />
                          <Typography>Logout</Typography>
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
