import { useTranslation } from 'react-i18next';

export function CreateWallet() {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        {t('auth.createWallet')}
      </h1>
      {/* Create wallet form will go here */}
    </div>
  );
}

export default CreateWallet;
