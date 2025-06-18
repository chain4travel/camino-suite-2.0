import { Box, CamBtn, Logo, Typography } from '@camino/ui';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const GenerateKeyPhrase = ({handleGenerateKeys}: {handleGenerateKeys: () => void}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const onBack = () => {
    router.back();
  };


  return (
    <Box className="flex flex-col bg-white dark:bg-slate-950 items-center justify-center w-full max-w-2xl p-8 mx-auto space-y-8">
      <div className="w-fit h-fit">
        <Logo />
      </div>

    <div className='flex flex-col items-center justify-center gap-2'>
      <Typography variant="h4" className="text-center">
        {t('auth.generateKeyPhrase')}
      </Typography>

      <Link
        href="/login"
        className="transition-colors text-primary hover:text-primary-600"
      >
        {t('auth.alreadyHaveWallet')}
      </Link>
    </div>

      {/* Generate Button */}
      <CamBtn
        variant="primary"
        fullWidth
        onClick={handleGenerateKeys}
      >
        {t('common.generateKeyPhrase')}
      </CamBtn>

      <div className="text-sm text-center text-slate-400">
        <span>{t('auth.termsNotice')}</span>{' '}
        <Link
          href="/terms"
          className="transition-colors text-primary hover:text-primary-600"
        >
          {t('auth.termsOfUse')}
        </Link>
      </div>

      <CamBtn
        variant="transparent"
        onClick={onBack}
        fullWidth
      >
        {t('common.cancel')}
      </CamBtn>
    </Box>
  );
};

export default GenerateKeyPhrase;
