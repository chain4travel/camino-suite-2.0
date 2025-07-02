'use client';

import { CamBtn, Input, Typography } from '@camino/ui';
import { useCallback, useEffect, useState } from 'react';
import {
  useAssetsActions,
  useAssetsStore,
  useComputedAssets,
  useNetworkStore,
  useWalletStore,
} from '@camino/store';
import { AccessMethodProps } from './types';
import { useTranslation } from 'react-i18next';
import { useAssetsSelectors, usePlatformBalances } from '@camino/store';
import { ONEAVAX } from '@c4tplatform/caminojs/dist/utils';
import { Big, BN } from 'libs/store/src/lib/helpers/helper';

export const PrivateKeyAccess = ({ onBack }: AccessMethodProps) => {
  const { t } = useTranslation();
  const { init, setNetwork } = useNetworkStore();
  const [privateKey, setPrivateKey] = useState(
    'b8135beab8a5de2cd14af132450b929c21e1a7ff3e1f3de07b9932b2783751a0'
  );
  const { accessWalletSingleton } = useWalletStore();
  const state = useWalletStore((state) => state);
  const [error, setError] = useState('');
  // const { walletAssetsArray, assetAVA, balanceLoading } = useAssetsSelectors();

  const { balanceLoading, AVA_ASSET_ID, balanceDict } = useAssetsSelectors();

  function cleanAvaxBN(val: BN): string {
    const big = Big(val.toString()).div(Big(ONEAVAX.toString()));
    return big.toLocaleString();
  }
  // Get computed values (properly memoized)
  const { walletAssetsArray, assetAVA, walletAssetsDict } = useComputedAssets();

  // Get platform balances (memoized)
  const { walletPlatformBalance } = usePlatformBalances();

  // Get actions
  const { updateUTXOs } = useAssetsActions();
  const { getAssetAVA } = useAssetsStore();
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
    init().then(() => {
      accessWalletSingleton(privateKey)
        .then(() => {
          getAssetAVA();
          console.log({ etchbalance: state.activeWallet?.ethBalance });
        })
        .catch(() => {
          console.error('Failed to access wallet with private key');
        });
    });
  }, [privateKey, isValidPrivateKey, t]);

  useEffect(() => {
    // console.log({ state });
    if (state.activeWallet) {
      // console.log('Active wallet:', state.activeWallet);
      // console.log({ balance: state.activeWallet.ethBalance.toString() });
    }
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
