import { ACCESS_METHOD_IDS, AccessMethod, WalletLoginProps } from './types';
import { AccessOption, CamBtn, Typography } from '@camino/ui';
import { mdiKey, mdiShieldKey, mdiTableLarge, mdiUsbFlashDrive } from '@mdi/js';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const WalletLogin = ({
  handleAccessMethod,
}: WalletLoginProps) => {
  const { t } = useTranslation();
  const router = useRouter();


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

  const handleCreateWallet = () => {
    router.push('/create');
  };

  return (
    <div className="max-w-2xl p-6 mx-auto space-y-8">


      <div className="space-y-4">
        <Typography variant="h6" className="uppercase">
          {t('auth.accessWallet')}
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

      <p className="text-sm text-center text-slate-400">
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
};

export default WalletLogin;
