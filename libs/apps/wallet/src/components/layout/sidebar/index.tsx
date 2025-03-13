'use client';
import { Box, Typography } from '@camino/ui';
import { TransactionHistory } from './TransactionHistory';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const { t } = useTranslation();
  return (
    <Box className="w-full flex-col bg-white dark:bg-slate-950 !p-0 items-start justify-between lg:w-72 min-h-[70vh]">
      {/* Wallet Balance */}
      <div className="p-4 w-full border-b border-slate-700">
        <Typography variant="h3" className="font-extralight">
          {t('common.transactions')}
        </Typography>
      </div>
      {/* Transaction History */}
      <TransactionHistory />

      <div className="text-center p-4 bg-gray-200/50 dark:bg-slate-800/50">
        <Typography variant="body2" className="text-center">
          {t('common.thisListMightBeIncompleteAndNotInTheRightOrder')}
        </Typography>
      </div>
    </Box>
  );
};
