'use client';
import { Tabs, Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { mdiOpenInNew, mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';

const TABS = [
  { id: 'node', label: 'Node' },
  { id: 'rewards', label: 'Rewards' },
] as const;

interface ValidatorRequirement {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  link?: string;
}

export const ValidatorView = () => {
  const { t } = useTranslation();

  const VALIDATOR_REQUIREMENTS: ValidatorRequirement[] = [
    {
      id: 'kyc',
      title: t('wallet.validator.kyc_verification'),
      status: 'pending',
      link: 'https://docs.camino.network/guides/kyc/index.html',
    },
    {
      id: 'consortium',
      title: t('wallet.validator.consortium_description'),
      status: 'pending',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-curl/index.html#requirements',
    },
    {
      id: 'balance',
      title: t('wallet.validator.amount_description', { amount: '100 000' }),
      status: 'pending',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-curl/index.html#requirements',
    },
    {
      id: 'nodeId',
      title: t('wallet.validator.address_description'),
      status: 'pending',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-msig/index.html#4-register-your-node-with-your-multisig-wallet',
    },
  ];

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
        <Tabs tabs={TABS} activeTab="node" className="border-b-0" />
      </div>

      <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-4 rounded-lg p-6 border-t border-slate-700">
        <Typography variant="h6" className="!mb-6">
          {t('wallet.validator.setupRequirements')}
        </Typography>

        <div className="flex flex-col items-start justify-center gap-4">
          {VALIDATOR_REQUIREMENTS.map((requirement) => (
            <div key={requirement.id} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  requirement.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              />
              <a
                href={requirement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
              >
                <Typography variant="body2">{requirement.title}</Typography>
                <Icon path={mdiOpenInNew} size={1} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
