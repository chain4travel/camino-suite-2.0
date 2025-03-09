import { useState, useEffect } from 'react';
import { Typography, Dropdown, Input, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { ChainCard } from './ChainCard';
import { Chain, ChainType } from '../../views/cross_chain/types';
import { ExportCard } from './ExportCard';
import { ImportCard } from './ImportCard';

const CHAINS: Chain[] = [
  { id: 'X Chain', name: 'Exchange Chain', balance: '0' },
  { id: 'P Chain', name: 'Platform Chain', balance: '1 000' },
  { id: 'C Chain', name: 'Contract Chain', balance: '0' },
];

export const CrossChainForm = () => {
  const { t } = useTranslation();
  const [sourceChain, setSourceChain] = useState<ChainType>(CHAINS[0].id);
  const [destinationChain, setDestinationChain] = useState<ChainType>(
    CHAINS[1].id
  );
  const [amount, setAmount] = useState('');

  const availableDestinationChains = CHAINS.filter(
    (chain) => chain.id !== sourceChain
  );

  // Automatically update destination chain when source chain changes
  useEffect(() => {
    if (
      sourceChain === destinationChain ||
      !availableDestinationChains.length
    ) {
      setDestinationChain(availableDestinationChains[0]?.id || CHAINS[1].id);
    }
  }, [sourceChain, destinationChain, availableDestinationChains]);

  const sourceChainData = CHAINS.find((chain) => chain.id === sourceChain);
  const destinationChainData = CHAINS.find(
    (chain) => chain.id === destinationChain
  );

  const handleMaxAmount = () => {
    if (sourceChainData) {
      setAmount(sourceChainData.balance);
    }
  };

  const handleConfirm = () => {
    // TODO: Implement confirm logic
    console.log('Confirming transfer:', {
      sourceChain,
      destinationChain,
      amount,
    });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 bg-white dark:bg-slate-950 rounded-lg lg:p-6 lg:border border-slate-700">
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="w-full flex flex-col gap-4">
          <Typography variant="h6">Source Chain</Typography>
          <Dropdown
            items={CHAINS.map((chain) => ({
              value: chain.id,
              label: chain.name,
            }))}
            trigger={
              CHAINS.find((chain) => chain.id === sourceChain)?.name || ''
            }
            onSelect={(value) => setSourceChain(value.value as ChainType)}
            menuButtonClassName="w-full"
            menuItemsClassName="w-full"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="h6">Destination Chain</Typography>
          <Dropdown
            trigger={
              CHAINS.find((chain) => chain.id === destinationChain)?.name || ''
            }
            onSelect={(value) => setDestinationChain(value.value as ChainType)}
            items={availableDestinationChains.map((chain) => ({
              value: chain.id,
              label: chain.name,
            }))}
            menuButtonClassName="w-full"
            menuItemsClassName="w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Typography variant="h6">Transfer Amount</Typography>
          <div className="flex gap-2">
            <div className="w-full relative h-fit">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full !pr-16"
                label={t('common.amount')}
              />
              <button
                onClick={handleMaxAmount}
                className="absolute right-4 top-2/3 mt-1 -translate-y-1/2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Typography
                  variant="caption"
                  className="!text-slate-400 hover:!text-slate-200"
                >
                  MAX
                </Typography>
              </button>
            </div>
          </div>
          <Typography variant="caption" className="!text-slate-400">
            Balance: {sourceChainData?.balance || '0'}
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-between">
            <Typography variant="body1">Fee</Typography>
            <div className="flex flex-col start">
              <Typography variant="body2" className="!text-slate-400">
                Export Fee: 0.001 CAM
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                Import Fee: 0.001 CAM
              </Typography>
            </div>
          </div>
        </div>

        <CamBtn
          variant="primary"
          onClick={handleConfirm}
          disabled={!amount || +amount <= 0}
        >
          Confirm
        </CamBtn>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <ChainCard chain={sourceChainData || CHAINS[0]} type="source" />
          <ChainCard
            chain={destinationChainData || CHAINS[1]}
            type="destination"
          />
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <ExportCard />
          <ImportCard />
        </div>
      </div>
    </div>
  );
};
