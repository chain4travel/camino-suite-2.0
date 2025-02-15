'use client';
import { Box, Typography } from '@camino/ui';
import { TransactionHistory } from './TransactionHistory';

export const Sidebar = () => {
  return (
    <Box className="w-full flex-col !p-0 items-start justify-between lg:w-72 min-h-[70vh]">
      {/* Wallet Balance */}
      <div className="p-4 w-full border-b border-slate-700">
        <Typography variant="h3" className="font-extralight">
          Transactions
        </Typography>
      </div>
      {/* Transaction History */}
      <TransactionHistory />

      <div className="text-center p-4 bg-gray-200/50 dark:bg-slate-800/50">
        <Typography variant="body2" className="text-center">
          This list might be incomplete and not in the right order.
        </Typography>
      </div>
    </Box>
  );
};
