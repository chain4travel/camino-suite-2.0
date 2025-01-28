'use client';

import { Box, CamBtn, Typography } from '@camino/ui';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const LedgerAccess = () => {
  const { t } = useTranslation();

  const handleConnect = useCallback(() => {
    console.log('Connecting to Ledger');
  }, []);

  return (
    <Box className="space-y-4">
      <Typography variant="body2" className="text-slate-400">
        {t('auth.ledgerInstructions')}
      </Typography>

      <CamBtn fullWidth onClick={handleConnect}>
        {t('auth.connectLedger')}
      </CamBtn>
    </Box>
  );
};
