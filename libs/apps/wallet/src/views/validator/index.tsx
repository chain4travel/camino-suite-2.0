'use client';
import { Tabs, Typography, CamBtn } from '@camino/ui';
import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { NodeTab } from '../../components/validator/NodeTab';
import { RewardsTab } from '../../components/validator/RewardsTab';

const TABS = [
  { id: 'node', label: 'Node' },
  { id: 'rewards', label: 'Rewards' },
] as const;

export const ValidatorView = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'node' | 'rewards'>('node');

  return (
    <div className="w-full h-full container mx-auto max-w-container gap-4 lg:px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h2" className="font-light">
          {t('common.validator')}
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
          onChange={(tab) => setActiveTab(tab as 'node' | 'rewards')}
          className="border-b-0"
        />
      </div>

      {activeTab === 'node' ? <NodeTab /> : <RewardsTab />}
    </div>
  );
};
