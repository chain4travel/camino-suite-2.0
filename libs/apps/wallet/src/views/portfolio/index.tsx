'use client';
import { Tabs, Typography, Input } from '@camino/ui';
import { mdiMagnify } from '@mdi/js';
import { useState } from 'react';
import { TokensTab } from './TokensTab';
import { CollectiblesTab } from './CollectiblesTab';
import { Asset } from './types';

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
  // Add more mock assets as needed
];

export const PortfolioView = () => {
  const [activeTab, setActiveTab] = useState('tokens');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = MOCK_ASSETS.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full container mx-auto max-w-container px-4 py-6">
      <div className="mb-6">
        <Typography variant="h2" className="font-light">
          Assets
        </Typography>
      </div>

      <div className="flex items-center justify-between mb-6">
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
