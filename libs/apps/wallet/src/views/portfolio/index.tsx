'use client';
import { Tabs, Typography, Input } from '@camino/ui';
import { mdiMagnify } from '@mdi/js';
import { useState } from 'react';
import { TokensTab } from '../../components/portfolio/TokensTab';
import { CollectiblesTab } from '../../components/portfolio/CollectiblesTab';
import { Asset } from './types';
import { useTranslation } from 'react-i18next';

const TABS = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'collectibles', label: 'Collectibles' },
];

const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'Camino',
    symbol: 'CAM',
    balance: '10 000',
    icon: '/images/cam-token.svg',
  },
  {
    id: '2',
    name: 'Monerium EURe',
    symbol: '(EURe) ERC20',
    balance: '0',
    icon: '/images/cam-token.svg',
  },
];

export const PortfolioView = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tokens');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = MOCK_ASSETS.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full container mx-auto max-w-container  lg:px-4 py-6">
      <div className="mb-6">
        <Typography variant="h2" className="font-light">
          {t('common.assets')}
        </Typography>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="border-b-0"
        />

        <div className="w-80">
          <Input
            placeholder="Search Assets"
            rightIcon={mdiMagnify}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {activeTab === 'tokens' && <TokensTab assets={filteredAssets} />}
      {activeTab === 'collectibles' && <CollectiblesTab />}
    </div>
  );
};

export default PortfolioView;
