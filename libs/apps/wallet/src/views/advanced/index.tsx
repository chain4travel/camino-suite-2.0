'use client';

import { Container, Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { ChainImportCard } from '../../components/advanced/ChainImportCard';
import { SignMessageCard } from '../../components/advanced/SignMessageCard';
import { CheckMessageCard } from '../../components/advanced/CheckMessageCard';

export const AdvancedView = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <Typography variant="h2" className="font-light">
          {t('wallet.advanced.title')}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChainImportCard />
          <SignMessageCard />
          <CheckMessageCard />
        </div>
      </div>
    </Container>
  );
};
