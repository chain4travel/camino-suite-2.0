'use client';

import { Container, Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { CrossChainForm } from '../../components/cross_chain/CrossChainForm';

export const CrossChainView = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <div className='flex flex-col gap-2'>
          <Typography variant="h2" className="font-light">
            {t('wallet.crossChain')}
          </Typography>
          <Typography variant="body1" className="!text-slate-400">
            {t('wallet.crossChainDescription')}
          </Typography>
        </div>

        <CrossChainForm />
      </div>
    </Container>
  );
};
