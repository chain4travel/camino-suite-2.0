import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { RewardCard } from '../../components/earn/RewardCard';

export const MyRewardsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
      <div className="flex flex-wrap gap-4">
        <RewardCard
          title="PreSale 3 Years 8%"
          depositStart={new Date('2025-03-03T13:37:00')}
          depositEnd={new Date('2028-09-01T02:37:00')}
          depositedAmount="1 000 000 CAM"
          pendingReward="0 CAM"
          alreadyClaimed="0 CAM"
          minimumDeposit="0.00000001 CAM"
          reward="8 %"
          onClaim={() => {
            // Handle claim
          }}
        />
        <RewardCard
          title="PreSale 3 Years 8%"
          depositStart={new Date('2025-03-03T13:37:00')}
          depositEnd={new Date('2028-09-01T02:37:00')}
          depositedAmount="1 000 000 CAM"
          pendingReward="0 CAM"
          alreadyClaimed="0 CAM"
          minimumDeposit="0.00000001 CAM"
          reward="8 %"
          onClaim={() => {
            // Handle claim
          }}
        />
      </div>
    </div>
  );
};
