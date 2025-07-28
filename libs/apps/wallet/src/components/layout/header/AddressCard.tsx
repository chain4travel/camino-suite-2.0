'use client';

import Icon from '@mdi/react';
import { mdiContentCopy, mdiQrcode } from '@mdi/js';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Modal, Tooltip, Typography, useNetwork } from '@camino/ui';
import QRCode from 'react-qr-code';
import { useNetworkStore, useWalletStore } from '@camino/store';

type Chain = 'X' | 'P' | 'C';

const CHAIN_DESCRIPTIONS = {
  X: 'This is your X-Chain address to send and receive funds.',
  P: 'This is your P-Chain address to send and receive funds, receive rewards and govern the network.',
  C: 'This is your C-Chain address. Use it to interact with the ethereum virtual machine.',
};

export const AddressCard = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeChain, setActiveChain] = useState<Chain>('X');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(addresses[activeChain]);
  };

  const { activeWallet, address } = useWalletStore();

  const addresses = useMemo(() => {
    return {
      X: address,
      P: activeWallet?.getCurrentAddressPlatform(),
      C: activeWallet?.ethAddress,
    };
  }, [address]);

  const handleChainChange = (chain: Chain) => {
    setActiveChain(chain);
  };
  return (
    <div className="flex flex-col gap-4 w-full lg:w-1/3 h-full items-start pt-4">
      <div className="mx-4 flex rounded-lg p-4 bg-gray-200/50 dark:bg-slate-800/50">
        <Typography variant="body2" className="text-center">
          {CHAIN_DESCRIPTIONS[activeChain]}
        </Typography>
      </div>
      <div className="px-4 flex-1 flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-start gap-4">
        <QRCode size={110} value={addresses[activeChain]} />
        <div className="flex-1 flex flex-col gap-1">
          <Typography variant="caption" className="!text-slate-400">
            {activeChain}-Chain Wallet Address
          </Typography>
          <Typography variant="h6" className="break-all">
            {addresses[activeChain]}
          </Typography>
          <div className="flex items-center justify-center self-end mt-3 gap-2">
            <Tooltip content="Show QR Code">
              <button onClick={() => setIsQRModalOpen(true)}>
                <Icon
                  path={mdiQrcode}
                  size={1}
                  className="text-slate-950 dark:text-slate-100"
                />
              </button>
            </Tooltip>
            <Tooltip content="Copy" position="top">
              <button onClick={handleCopy}>
                <Icon
                  path={mdiContentCopy}
                  size={1}
                  className="text-slate-950 dark:text-slate-100"
                />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="w-full h-10 flex items-center justify-center self-end mt-6">
        {(['X', 'P', 'C'] as Chain[]).map((chain) => (
          <button
            key={chain}
            onClick={() => handleChainChange(chain)}
            className={clsx(
              'w-full h-full flex items-center justify-center transition-colors',
              'hover:bg-gray-300/50 dark:hover:bg-slate-700/50',
              activeChain === chain
                ? 'bg-gray-300/50 dark:bg-slate-700/50'
                : 'bg-gray-200/50 dark:bg-slate-800/50'
            )}
          >
            <Typography
              variant="body2"
              className={clsx(activeChain === chain && 'font-medium')}
            >
              {chain}
            </Typography>
          </button>
        ))}
      </div>
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title={`${activeChain}-Chain Wallet Address`}
      >
        <div className="flex flex-col items-center gap-6 p-6">
          <QRCode size={200} value={addresses[activeChain]} />
          <Typography variant="h6" className="break-all text-center">
            {addresses[activeChain]}
          </Typography>
        </div>
      </Modal>
    </div>
  );
};
