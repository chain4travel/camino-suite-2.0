import { Typography, Input, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';

export const RewardsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-4 rounded-lg p-6 border-t border-slate-700">
      <Typography variant="h6" className="!mb-6">
        {t('wallet.validator.claimableRewards')}
      </Typography>

      <Typography variant="h2" className="font-light">
        0 CAM
      </Typography>

      <Input
        value="P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3"
        disabled
        label={t('wallet.validator.rewardOwner')}
      />

      <CamBtn variant="primary" className="mt-4 self-end" disabled>
        {t('wallet.validator.claimRewards')}
      </CamBtn>
    </div>
  );
}; 