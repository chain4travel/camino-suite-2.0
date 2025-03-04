import { Typography } from '@camino/ui';
import { format } from 'date-fns';

interface ValidationInfoProps {
  endDate?: Date;
  rewardPending?: string;
  addValidator?: string;
}

export const ValidationInfo = ({
  endDate,
  rewardPending,
  addValidator,
}: ValidationInfoProps) => {
  if (!endDate) return null;

  return (
    <div className="flex-1 flex flex-col justify-between items-start lg:items-end gap-4">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex justify-between gap-8 ">
          <Typography variant="caption" className="!text-slate-400">
            Validation Period End Date
          </Typography>
          <Typography variant="body2" className="!text-slate-400 text-right">
            {format(endDate, 'M/d/yyyy h:mm:ss a')}
          </Typography>
        </div>
        <div className="flex  justify-between gap-8">
          <Typography variant="caption" className="!text-slate-400">
            Reward Pending
          </Typography>
          <Typography variant="body2" className="!text-blue-500">
            {rewardPending}
          </Typography>
        </div>
        <div className="flex justify-between gap-8">
          <Typography variant="caption" className="!text-slate-400">
            Add Validator
          </Typography>
          <Typography variant="body2" className="!text-blue-500">
            {addValidator}
          </Typography>
        </div>
      </div>
    </div>
  );
};
