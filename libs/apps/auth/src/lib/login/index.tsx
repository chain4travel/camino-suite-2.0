'use client';

import { ACCESS_METHOD_IDS, AccessMethod } from './types';
import { KeystoreAccess, LedgerAccess, MnemonicAccess, PrivateKeyAccess } from '../../components/access-methods';
import { useCallback, useState } from 'react';

import { Box } from '@camino/ui';
import React from 'react';
import WalletLogin from "./WalletLogin"

export const Login = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleAccessMethod = useCallback((method: AccessMethod) => {
    if (method.disabled) return;
    setSelectedMethod(method.id);
    // Handle method selection
    console.log('Selected method:', method);
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
        return <LedgerAccess />;
      default:
        return <WalletLogin handleAccessMethod={handleAccessMethod} />
    }
  };

  return (
    <Box className="w-full bg-white dark:bg-slate-950">
      {renderAccessMethod()}
    </Box>
  );
};
