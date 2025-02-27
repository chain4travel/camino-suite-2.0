import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { PoolCard } from '../../components/earn/PoolCard';

export const SavingPoolsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
      <div className="w-fit flex items-center justify-center gap-2">
        <Typography variant="h3">{t('earn.availableForDeposit')}</Typography>
        <Typography variant="h4" className="!text-slate-400">
          153 999.979 CAM
        </Typography>
      </div>

      <div className="flex flex-wrap gap-4">
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        <PoolCard
          title="Test Deposit"
          poolSize="0%(1 000CAM)"
          startDate={new Date('2025-02-20T15:55:19')}
          endDate={new Date('2025-02-27T14:55:19')}
          minDuration="1 Min 26 Secs"
          maxDuration="2 Days"
          minDeposit="0.001 CAM"
          reward="11 %"
          unlockDuration="No"
          noRewardDuration="No"
        />
        {/* ... other PoolCards ... */}
      </div>
    </div>
  );
};
