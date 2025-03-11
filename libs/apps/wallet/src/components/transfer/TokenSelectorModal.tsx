import { Modal, Typography } from '@camino/ui';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Token {
  symbol: string;
  name: string;
  balances: {
    P: string;
    X: string;
    C: string;
  };
  icon: string;
}

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedChain: 'P' | 'X' | 'C';
}

const MOCK_TOKENS: Token[] = [
  {
    symbol: 'CAM',
    name: 'Camino',
    balances: {
      P: '9 999.993',
      X: '9 999.993',
      C: '0.0042',
    },
    icon: '/images/cam-token.svg',
  },
  // Add more tokens as needed
];

export const TokenSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedChain,
}: TokenSelectorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.selectToken')}
      size="md"
    >
      <div className="flex flex-col divide-y divide-slate-700">
        {MOCK_TOKENS.map((token) => (
          <button
            key={token.symbol}
            onClick={() => onSelect(token)}
            className="flex items-center justify-between p-4 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src={token.icon}
                  alt={token.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="body1">{token.symbol}</Typography>
                <Typography variant="caption" className="!text-slate-400">
                  {token.name}
                </Typography>
              </div>
            </div>
            <Typography variant="body1">{token.balances[selectedChain]}</Typography>
          </button>
        ))}
      </div>
    </Modal>
  );
}; 