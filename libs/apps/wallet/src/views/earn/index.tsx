'use client';
import { useState } from 'react';
import { CamBtn, Tabs, Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { SavingPoolsTab } from './SavingPoolsTab';
import { MyRewardsTab } from './MyRewardsTab';
import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';

const TABS = [
  { id: 'pools', label: 'Saving Pools' },
  { id: 'rewards', label: 'My Rewards' }
];

type TabType = 'pools' | 'rewards';

export const EarnView = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('pools');

  return (
    <div className="w-full h-full container mx-auto max-w-container gap-4 lg:px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h2" className="font-light">
          {t('common.earn')}
        </Typography>
        <CamBtn
          variant="secondary"
          onClick={() => {
            // TODO: Handle refresh
          }}
          className="!p-2"
        >
          <Icon path={mdiRefresh} size={1} />
        </CamBtn>
      </div>
      <div className="w-full flex flex-wrap items-center justify-between mb-6">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as TabType)}
          className="border-b-0"
        />
      </div>

      {activeTab === 'pools' ? <SavingPoolsTab /> : <MyRewardsTab />}
    </div>
  );
};
