import { Typography, CamBtn } from '@camino/ui';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface RewardCardProps {
  title: string;
  depositStart: Date;
  depositEnd: Date;
  depositedAmount: string;
  pendingReward: string;
  alreadyClaimed: string;
  minimumDeposit: string;
  reward: string;
  onClaim: () => void;
}

export const RewardCard = ({
  title,
  depositStart,
  depositEnd,
  depositedAmount,
  pendingReward,
  alreadyClaimed,
  minimumDeposit,
  reward,
  onClaim,
}: RewardCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg p-6 border border-slate-700 w-[calc(50%-8px)]">
      <div className="flex flex-col gap-6">
        <Typography variant="h4">{title}</Typography>

        <div className="flex flex-wrap divide-x divide-slate-700">
          <div className="flex flex-col flex-1 min-w-[200px] gap-4 pr-8">
            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Deposit Start:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {format(depositStart, 'MMM d, yyyy, h:mm:ss a')}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Deposit End:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {format(depositEnd, 'MMM d, yyyy, h:mm:ss a')}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Minimum Deposit:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {minimumDeposit}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Reward:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {reward}
              </Typography>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-[200px] gap-4 pl-8">
            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Deposited Amount:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {depositedAmount}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Pending Reward:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {pendingReward}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Already Claimed:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {alreadyClaimed}
              </Typography>
            </div>
          </div>
        </div>

        <CamBtn variant="primary" className="self-end" onClick={onClaim}>
          {t('earn.claimRewards')}
        </CamBtn>
      </div>
    </div>
  );
}; 