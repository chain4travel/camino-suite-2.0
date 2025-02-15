import { Typography, Modal, CamBtn } from '@camino/ui';
import { mdiRefresh, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import { useState } from 'react';
import { UTXOModal } from './UTXOModal';

const formatNumber = (num: string) => {
  const [whole, decimal] = num.split('.');
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return { whole: formattedWhole, decimal };
};

const AmountInfo = ({
  title,
  amount,
  className,
  subtitle,
  ...rest
}: {
  title: string;
  amount: string;
  className?: string;
  subtitle?: string;
}) => {
  return (
    <div className={clsx('flex flex-col gap-1', className)} {...rest}>
      <Typography variant="body2" className="!text-slate-400">
        {title}{' '}
        {subtitle && <span className="text-slate-400">({subtitle})</span>}
      </Typography>
      <Typography
        variant="body1"
        className="text-slate-950 dark:text-slate-100"
      >
        {amount}
      </Typography>
    </div>
  );
};

interface UTXO {
  id: string;
  type: string;
  threshold: number;
  owners: string;
  balance: string;
}

const CHAIN_UTXOS: Record<'X' | 'P', UTXO[]> = {
  X: [
    {
      id: '2CffgzgLcXqAv3hPKQCjMtQbm2BGceLgcXFDq7gVoL8i2U3od1',
      type: 'SECP Transfer Output',
      threshold: 1,
      owners: 'X-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '199 999.976 CAM',
    },
  ],
  P: [
    {
      id: '2CffgzgLcXqAv3hPKQCjMtQbm2BGceLgcXFDq7gVoL8i2U3od1',
      type: 'SECP Transfer Output',
      threshold: 1,
      owners: 'P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '199 999.976 CAM',
    },
    {
      id: '6wSuYBDbuEeb39Vz9ghCNUBmiqxJ6rBpzMF34UDWdJga66wVR',
      type: 'Locked Output',
      threshold: 1,
      owners: 'P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '100 CAM',
    },
  ],
};

const TABLE_HEADERS = [
  { key: 'id', label: 'ID' },
  { key: 'type', label: 'Type' },
  { key: 'threshold', label: 'Threshold' },
  { key: 'owners', label: 'Owners' },
  { key: 'balance', label: 'Balance', align: 'right' as const },
];

const BalanceCard = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showUTXOs, setShowUTXOs] = useState(false);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap gap-2 items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-2">
            <Icon
              path={mdiRefresh}
              size={1}
              className="text-slate-950 dark:text-slate-100"
            />
            <Typography variant="body2" className="font-medium">
              Balance (Singleton Wallet)
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-sm text-slate-950 dark:text-slate-100"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <Icon
                path={!showBreakdown ? mdiEyeOutline : mdiEyeOffOutline}
                size={0.9}
              />
              <Typography variant="body2">Show Breakdown</Typography>
            </button>
            <button
              className="text-sm text-slate-950 dark:text-slate-100"
              onClick={() => setShowUTXOs(!showUTXOs)}
            >
              <Typography variant="body2">Show UTXOs</Typography>
            </button>
          </div>
        </div>

        {/* Balance Amount */}
        <div className="px-4">
          <Typography
            variant="h1"
            className="!font-extralight text-lg text-slate-950 dark:text-slate-100 flex items-baseline"
          >
            {formatNumber('997193999.03745945').whole}
            <span className="text-sm lg:text-2xl mr-2">
              .{formatNumber('997193999.03745945').decimal}
            </span>
            CAM
          </Typography>
        </div>

        {/* Available/Locked or Breakdown */}
        {!showBreakdown ? (
          <div className="flex gap-8 px-4 divide-x divide-slate-700">
            <AmountInfo title="Available" amount="10 000 CAM" />
            <AmountInfo title="Locked" amount="1 CAM" className="pl-6" />
          </div>
        ) : (
          <div className="flex px-4 divide-x divide-slate-700 w-fit">
            <div className="flex flex-col gap-2 w-fit pr-6">
              <AmountInfo title="Available" subtitle="X" amount="0 CAM" />
              <AmountInfo title="Available" subtitle="P" amount="10 000 CAM" />
              <AmountInfo title="Available" subtitle="C" amount="0 CAM" />
            </div>
            <div className="flex flex-col gap-2 pl-6 w-fit">
              <AmountInfo title="Deposited" subtitle="P" amount="0 CAM" />
              <AmountInfo title="Bonded" subtitle="P" amount="99 CAM" />
              <AmountInfo
                title="Bonded & Deposited"
                subtitle="P"
                amount="1 CAM"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Typography variant="body1">Collectibles</Typography>
          <Typography variant="body2" className="!text-slate-400">
            You have not collected any non fungible tokens.
          </Typography>
        </div>
      </div>
      <UTXOModal isOpen={showUTXOs} onClose={() => setShowUTXOs(false)} />
    </>
  );
};

export default BalanceCard;
