import { Typography, CamBtn } from '@camino/ui';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface PoolCardProps {
  title: string;
  poolSize: string;
  startDate: Date;
  endDate: Date;
  minDuration: string;
  maxDuration: string;
  minDeposit: string;
  reward: string;
  unlockDuration: string;
  noRewardDuration: string;
}

export const PoolCard = ({
  title,
  poolSize,
  startDate,
  endDate,
  minDuration,
  maxDuration,
  minDeposit,
  reward,
  unlockDuration,
  noRewardDuration,
}: PoolCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-700 w-full md:w-[calc(50%-8px)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-start justify-between">
          <Typography variant="h4">{title}</Typography>
          <div className="flex w-full items-center justify-between gap-2">
            <Typography variant="caption" className="text-slate-400">
              Pool Size:
            </Typography>
            <div className="h-1 flex-1 bg-slate-700 rounded-full" />
            <Typography variant="body2">{poolSize}</Typography>
          </div>
        </div>

        <div className="flex flex-wrap divide-x divide-slate-700">
          <div className="flex flex-col flex-1 min-w-[200px] gap-4 pr-8">
            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Pool Start:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {format(startDate, 'MMM dd, yyyy, h:mm:ss a')}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Pool End:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {format(endDate, 'MMM dd, yyyy, h:mm:ss a')}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Minimum Deposit:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {minDeposit}
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
                Minimum Duration:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {minDuration}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Maximum Duration:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {maxDuration}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                Unlock Duration:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {unlockDuration}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="text-slate-400">
                NoReward Duration:
              </Typography>
              <Typography variant="body2" className="!text-slate-400">
                {noRewardDuration}
              </Typography>
            </div>
          </div>
        </div>

        <CamBtn variant="primary" className="self-end">
          {t('earn.depositNow')}
        </CamBtn>
      </div>
    </div>
  );
};
