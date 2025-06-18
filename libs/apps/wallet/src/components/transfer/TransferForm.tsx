import { Input, Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { NFTSelector } from './NFTSelector';

interface NFTGroup {
  id: number;
  name: string;
  image?: string;
}

interface Token {
  symbol: string;
  name: string;
  balances: Record<'P' | 'X' | 'C', string>;
  icon: string;
}

interface TransferFormProps {
  amount: string;
  selectedChain: 'P' | 'X' | 'C';
  selectedToken: Token;
  selectedNFTs: NFTGroup[];
  onAmountChange: (value: string) => void;
  onMaxAmount: () => void;
  onTokenSelect: () => void;
  onNFTSelect: (nft: NFTGroup) => void;
}

export const TransferForm = ({
  amount,
  selectedChain,
  selectedToken,
  selectedNFTs,
  onAmountChange,
  onMaxAmount,
  onTokenSelect,
  onNFTSelect,
}: TransferFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 py-6 flex-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex flex-col">
          <div className="relative h-fit">
            <Input
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full !pr-16"
              label={t('common.amount')}
            />
            <button
              onClick={onMaxAmount}
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
          <Typography variant="caption" className="mt-2 !text-slate-400 self-end">
            Balance: {selectedToken.balances[selectedChain]}
          </Typography>
        </div>
        <CamBtn variant="secondary" className="w-24" onClick={onTokenSelect}>
          {selectedToken.symbol}
        </CamBtn>
      </div>

      {selectedChain === 'X' && (
        <NFTSelector selectedNFTs={selectedNFTs} onNFTSelect={onNFTSelect} />
      )}
    </div>
  );
}; 