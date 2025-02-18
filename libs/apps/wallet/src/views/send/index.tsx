'use client';
import { Tabs, Typography, Input, CamBtn } from '@camino/ui';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mdiCamera, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import Image from 'next/image';
import { ChainSelector } from '../../components/transfer/ChainSelector';
import { NFTSelector } from '../../components/transfer/NFTSelector';
import { SendForm } from '../../components/transfer/SendForm';
import { TokenSelectorModal } from '../../components/transfer/TokenSelectorModal';

const TABS = [
  { id: 'transfer', label: 'Transfer' },
  { id: 'airdrop', label: 'Airdrop' },
];

interface NFTGroup {
  id: number;
  name: string;
  image?: string;
}

export const SendView = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [confirmedTransaction, setConfirmedTransaction] = useState(false);
  const [activeTab, setActiveTab] = useState<'transfer' | 'airdrop'>(
    'transfer'
  );
  const [selectedChain, setSelectedChain] = useState('P');
  const [amount, setAmount] = useState('0.00');
  const [memo, setMemo] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [selectedNFTs, setSelectedNFTs] = useState<NFTGroup[]>([]);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectedToken, setSelectedToken] = useState({
    symbol: 'CAM',
    name: 'Camino',
    balances: {
      P: '9 999.993',
      X: '9 999.993',
      C: '0.0042',
    },
    icon: '/images/cam-token.svg',
  });

  // Reset values when changing chains
  useEffect(() => {
    setAmount('0.00');
    setMemo('');
    setToAddress('');
    setSelectedNFTs([]);
    setConfirmedTransaction(false);
  }, [selectedChain]);

  // Reset chain selection when changing tabs
  useEffect(() => {
    if (activeTab === 'airdrop') {
      setSelectedChain('X');
    }
  }, [activeTab]);

  // Handle NFT transfer from URL params
  useEffect(() => {
    const nft = searchParams.get('nft');
    const chain = searchParams.get('chain');
    if (nft && chain) {
      setSelectedChain(chain);
      // TODO: Handle NFT selection
    }
  }, [searchParams]);

  // Mock NFT data - replace with real data
  const mockNFTs = [
    {
      id: 1,
      name: 'test',
      image: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da',
    },
    {
      id: 2,
      name: 'harry potter',
      image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239',
    },
  ];

  const handleNFTSelect = (nft: NFTGroup) => {
    setSelectedNFTs((prev) => {
      const exists = prev.find((item) => item.id === nft.id);
      if (exists) {
        return prev.filter((item) => item.id !== nft.id);
      }
      return [...prev, nft];
    });
  };

  const handleMaxAmount = () => {
    const balance = selectedChain === 'C' ? '0.0042' : '9999.993';
    setAmount(balance);
  };

  return (
    <div className="w-full h-full container mx-auto max-w-container gap-4 lg:px-4 py-6">
      <div className="mb-6">
        <Typography variant="h2" className="font-light">
          {t('common.send')}
        </Typography>
      </div>

      <div className="w-full flex flex-wrap items-center justify-between mb-6">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'transfer' | 'airdrop')}
          className="border-b-0"
        />
      </div>

      <ChainSelector
        selectedChain={selectedChain}
        onChainSelect={setSelectedChain}
      />

      <div className="flex bg-gray-200/50 dark:bg-slate-800/50 border-t border-slate-700 mt-4 px-4 rounded-lg flex-wrap gap-6 w-full lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-slate-700 lg:divide-slate-700">
        <div className="flex flex-col gap-6 py-6 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex flex-col">
              <div className="relative h-fit">
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full !pr-16" // Make room for MAX button
                  label={t('common.amount')}
                />
                <button
                  onClick={handleMaxAmount}
                  className="absolute right-4 top-2/3 mt-1 -translate-y-1/2 text-xs disabled:opacity-50 disabled:cursor-not-allowed "
                >
                  <Typography
                    variant="caption"
                    className="!text-slate-400 hover:!text-slate-200"
                  >
                    MAX
                  </Typography>
                </button>
              </div>
              <Typography
                variant="caption"
                className="mt-2 !text-slate-400 self-end"
              >
                Balance: {selectedToken.balances[selectedChain]}
              </Typography>
            </div>
            <CamBtn 
              variant="secondary" 
              className="w-24"
              onClick={() => setShowTokenSelector(true)}
            >
              {selectedToken.symbol}
            </CamBtn>
          </div>

          {selectedChain === 'X' && (
            <NFTSelector
              selectedNFTs={selectedNFTs}
              onNFTSelect={handleNFTSelect}
            />
          )}
        </div>

        <SendForm
          toAddress={toAddress}
          memo={memo}
          selectedChain={selectedChain}
          confirmedTransaction={confirmedTransaction}
          onAddressChange={setToAddress}
          onMemoChange={setMemo}
          onConfirm={() => setConfirmedTransaction(true)}
          onCancel={() => setConfirmedTransaction(false)}
        />
      </div>

      <TokenSelectorModal
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        selectedChain={selectedChain}
        onSelect={(token) => {
          setSelectedToken(token);
          setShowTokenSelector(false);
        }}
      />
    </div>
  );
};
