'use client';
import { Tabs, Typography } from '@camino/ui';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainSelector } from '../../components/transfer/ChainSelector';
import { TransferForm } from '../../components/transfer/TransferForm';
import { AirdropForm } from '../../components/transfer/AirdropForm';
import { SendForm } from '../../components/transfer/SendForm';
import { TokenSelectorModal } from '../../components/transfer/TokenSelectorModal';

const TABS = [
  { id: 'transfer', label: 'Transfer' },
  { id: 'airdrop', label: 'Airdrop' },
] as const;

interface NFTGroup {
  id: number;
  name: string;
  image?: string;
}

export const SendView = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [confirmedTransaction, setConfirmedTransaction] = useState(false);
  const [activeTab, setActiveTab] = useState<'transfer' | 'airdrop'>('transfer');
  const [selectedChain, setSelectedChain] = useState<'P' | 'X' | 'C'>('P');
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

  useEffect(() => {
    setAmount('0.00');
    setMemo('');
    setToAddress('');
    setSelectedNFTs([]);
    setConfirmedTransaction(false);
  }, [selectedChain]);

  useEffect(() => {
    if (activeTab === 'airdrop') {
      setSelectedChain('X');
    }
  }, [activeTab]);

  useEffect(() => {
    const nft = searchParams.get('nft');
    const chain = searchParams.get('chain');
    if (nft && chain) {
      setSelectedChain(chain as 'P' | 'X' | 'C');
    }
  }, [searchParams]);

  const handleMaxAmount = () => {
    setAmount(selectedToken.balances[selectedChain]);
  };

  const handleChainSelect = (chain: string) => {
    if (chain === 'X' || chain === 'P' || chain === 'C') {
      setSelectedChain(chain);
    }
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

      {activeTab === 'transfer' ? (
        <>
          <ChainSelector
            selectedChain={selectedChain}
            onChainSelect={handleChainSelect}
          />

          <div className="flex bg-gray-200/50 dark:bg-slate-800/50 border-t border-slate-700 mt-4 px-4 rounded-lg flex-wrap gap-6 w-full lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
            <TransferForm
              amount={amount}
              selectedChain={selectedChain}
              selectedToken={selectedToken}
              selectedNFTs={selectedNFTs}
              onAmountChange={setAmount}
              onMaxAmount={handleMaxAmount}
              onTokenSelect={() => setShowTokenSelector(true)}
              onNFTSelect={(nft) => {
                setSelectedNFTs((prev) => {
                  const exists = prev.find((item) => item.id === nft.id);
                  if (exists) {
                    return prev.filter((item) => item.id !== nft.id);
                  }
                  return [...prev, nft];
                });
              }}
            />

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
        </>
      ) : (
        <AirdropForm
          toAddress={toAddress}
          memo={memo}
          onAddressChange={setToAddress}
          onMemoChange={setMemo}
        />
      )}

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
