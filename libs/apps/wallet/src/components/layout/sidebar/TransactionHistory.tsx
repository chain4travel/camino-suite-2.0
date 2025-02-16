'use client';
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
interface Transaction {
  date: string;
  type: 'Send' | 'Receive' | 'Export';
  amount: string;
  to?: string;
  from?: string;
}

export const TransactionHistory = () => {
  // This would typically come from your data store
  const transactions: Transaction[] = [
    { date: 'Apr 25, 2024', type: 'Send', amount: '0.001' },
    { date: 'Apr 25, 2024', type: 'Send', amount: '0.001' },
    { date: 'Apr 25, 2024', type: 'Receive', amount: '0.001' },
    {
      date: 'Jan 08, 2024',
      type: 'Send',
      amount: '-1.001',
      to: 'X-columbus1y...',
    },
    { date: 'Jun 08, 2023', type: 'Export', amount: '-50.003807' },
    {
      date: 'Jun 08, 2023',
      type: 'Receive',
      amount: '50',
      from: 'X-columbus...',
    },
    {
      date: 'Jun 07, 2023',
      type: 'Receive',
      amount: '10',
      from: 'X-columbus...',
    },
  ];

  return (
    <div className="w-full flex-1 p-4">
      <div className="space-y-2 divide-y divide-slate-700 flex flex-col gap-2">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-neutral-800/50 rounded-lg cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  {transaction.date}
                </span>
                <Icon
                  path={mdiMagnify}
                  size={0.9}
                  className="text-neutral-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-neutral-300">
                    {transaction.type}
                  </span>
                  {(transaction.to || transaction.from) && (
                    <div className="text-xs text-neutral-500">
                      {transaction.to
                        ? `to ${transaction.to}`
                        : `from ${transaction.from}`}
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    transaction.type === 'Receive'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {transaction.amount} CAM
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
