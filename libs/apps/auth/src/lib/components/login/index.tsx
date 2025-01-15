'use client';

import { ACCESS_METHOD_IDS, AccessMethod, SavedWallet } from './types';
import { AccessOption, Box, CamBtn, Typography } from '@camino/ui';
import { KeystoreAccess, LedgerAccess, MnemonicAccess, PrivateKeyAccess } from './access-methods';
import { mdiKey, mdiShieldKey, mdiTableLarge, mdiUsbFlashDrive } from '@mdi/js';
import { useCallback, useState } from 'react';

import React from 'react';
import WalletLogin from "./WalletLogin"
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // This would come from a hook or context in a real app
  const savedWallets: SavedWallet[] = [
    { id: '1', name: 'Root 1' },
    { id: '2', name: 'Root 2' },
  ];

  const accessMethods: AccessMethod[] = [
    {
      id: ACCESS_METHOD_IDS.PRIVATE_KEY,
      icon: mdiKey,
      text: t('auth.privateKey'),
    },
    {
      id: ACCESS_METHOD_IDS.MNEMONIC,
      icon: mdiTableLarge,
      text: t('auth.mnemonicPhrase'),
    },
    {
      id: ACCESS_METHOD_IDS.KEYSTORE,
      icon: mdiShieldKey,
      text: t('auth.keystoreFile'),
    },
    {
      id: ACCESS_METHOD_IDS.LEDGER,
      icon: mdiUsbFlashDrive,
      text: t('auth.ledger'),
      disabled: true,
    },
  ];

  const handleAccessWallet = useCallback((wallet: SavedWallet) => {
    // Handle accessing saved wallet
    console.log('Accessing wallet:', wallet);
  }, []);

  const handleAccessMethod = useCallback((method: AccessMethod) => {
    if (method.disabled) return;
    setSelectedMethod(method.id);
    // Handle method selection
    console.log('Selected method:', method);
  }, []);

  const handleCreateWallet = useCallback(() => {
    // Handle create wallet navigation
    console.log('Creating new wallet');
  }, []);

  const handleBack = useCallback(() => {
    setSelectedMethod(null);
  }, []);

  const renderAccessMethod = () => {
    switch (selectedMethod) {
      case ACCESS_METHOD_IDS.PRIVATE_KEY:
        return <PrivateKeyAccess onBack={handleBack} />;
      case ACCESS_METHOD_IDS.MNEMONIC:
        return <MnemonicAccess onBack={handleBack} />;
      case ACCESS_METHOD_IDS.KEYSTORE:
        return <KeystoreAccess onBack={handleBack} />;
      case ACCESS_METHOD_IDS.LEDGER:
        return <LedgerAccess onBack={handleBack} />;
      default:
        return <WalletLogin selectedMethod={selectedMethod} handleAccessWallet={handleAccessWallet} handleCreateWallet={handleCreateWallet} handleAccessMethod={handleAccessMethod} />
    }
  };

  return (
    <Box className="w-full" >
      {renderAccessMethod()}
    </Box>
  );
};
