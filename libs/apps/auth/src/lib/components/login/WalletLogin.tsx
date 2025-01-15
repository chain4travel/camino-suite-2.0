import { ACCESS_METHOD_IDS, AccessMethod, SavedWallet } from './types';
import { AccessOption, Box, CamBtn, Typography } from '@camino/ui';
import { KeystoreAccess, LedgerAccess, MnemonicAccess, PrivateKeyAccess } from './access-methods';
import { mdiKey, mdiShieldKey, mdiTableLarge, mdiUsbFlashDrive } from '@mdi/js';
import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

const WalletLogin = ({ selectedMethod, handleAccessWallet, handleCreateWallet, handleAccessMethod }: { selectedMethod: string | null, handleAccessWallet: any, handleCreateWallet: any, handleAccessMethod: any }) => {
  const { t } = useTranslation();


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

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-8">
      {savedWallets.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h6" className="uppercase">
            {t('auth.savedWallets')}
          </Typography>

          {savedWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex flex-col items-center justify-between p-4 bg-gray-800 sm:flex-row rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full">
                  {wallet.icon && (
                    <img
                      src={wallet.icon}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  )}
                </div>
                <span className="text-white">{wallet.name}</span>
              </div>
              <CamBtn
                variant="transparent"
                onClick={() => handleAccessWallet(wallet)}
                className="mt-2 sm:mt-0"
              >
                {t('common.access')}
              </CamBtn>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <Typography variant="h6" className="uppercase">
          {selectedMethod ? t(`auth.${selectedMethod.toLowerCase()}`) : t('auth.accessWallet')}
        </Typography>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {accessMethods.map((method) => (
            <AccessOption
              key={method.id}
              icon={method.icon}
              text={method.text}
              disabled={method.disabled}
              onClick={() => handleAccessMethod(method)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Typography variant="h6" className="uppercase">
          {t('auth.noWallet')}
        </Typography>
        <CamBtn fullWidth onClick={handleCreateWallet}>
          {t('auth.createWallet')}
        </CamBtn>
      </div>

      <p className="text-sm text-center text-gray-400">
        {t('auth.termsNotice')}
        <a href="/terms" className="ml-1 text-blue-500 hover:text-blue-400">
          {t('auth.termsOfUse')}
        </a>
        {t('common.and')}
        <a href="/privacy" className="ml-1 text-blue-500 hover:text-blue-400">
          {t('auth.privacyPolicy')}
        </a>
      </p>
    </div>
  );

}

export default WalletLogin;
