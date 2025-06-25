import { Tabs, Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';

const CHAIN_TABS = [
  { id: 'P', label: 'P' },
  { id: 'X', label: 'X' },
  { id: 'C', label: 'C' },
];

interface ChainSelectorProps {
  selectedChain: string;
  onChainSelect: (chain: string) => void;
}

export const ChainSelector = ({ selectedChain, onChainSelect }: ChainSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <Typography variant="h2" className="mb-4">
        {t('common.sourceChain')}
      </Typography>
      <Tabs
        tabs={CHAIN_TABS}
        activeTab={selectedChain}
        onChange={onChainSelect}
        size="md"
      />
    </div>
  );
}; 