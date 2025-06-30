'use client';

import { CamBtn, Input, Typography } from '@camino/ui';
import { useCallback, useEffect, useState } from 'react';
import { useWalletStore } from '@camino/store';
import { AccessMethodProps } from './types';
import { useTranslation } from 'react-i18next';

export const PrivateKeyAccess = ({ onBack }: AccessMethodProps) => {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = useState(
    'b8135beab8a5de2cd14af132450b929c21e1a7ff3e1f3de07b9932b2783751a0'
  );
  const { accessWalletSingleton } = useWalletStore();
  const state = useWalletStore((state) => state);
  const [error, setError] = useState('');

  const isValidPrivateKey = privateKey;

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrivateKey(value);

    if (!value) {
      setError(t('auth.invalidPrivateKey'));
    } else {
      setError('');
    }
  };

  const handleAccess = useCallback(() => {
    if (!isValidPrivateKey) {
      setError(t('auth.invalidPrivateKey'));
      return;
    }
    console.log('Accessing with private key:', privateKey);
    accessWalletSingleton(privateKey);
  }, [privateKey, isValidPrivateKey, t]);

  useEffect(() => {
    console.log('Wallet address:', state);
  }, [state]);

  return (
    <div className="flex flex-col items-center w-[20rem] max-w-2xl p-4 mx-auto space-y-5">
      <Typography variant="h5" className="w-full text-center">
        {t('auth.privateKeyInstructions')}
      </Typography>

      <Input
        className="w-full"
        placeholder="PrivateKey-..."
        value={privateKey}
        onChange={handlePrivateKeyChange}
        error={error}
        type="password"
        autoComplete="off"
        spellCheck={false}
      />

      <CamBtn
        className="w-full max-w-md"
        onClick={handleAccess}
        fullWidth
        disabled={!isValidPrivateKey}
      >
        {t('auth.accessWallet')}
      </CamBtn>

      <CamBtn
        variant="transparent"
        className="w-full"
        onClick={onBack}
        fullWidth
      >
        {t('common.cancel')}
      </CamBtn>
    </div>
  );
};
