import { Typography } from '@camino/ui';
import { format } from 'date-fns';
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { Activity } from '../../views/activity/types';
import { ValidationInfo } from './ValidationInfo';
import { SendInfo } from './SendInfo';
import { ExportInfo } from './ExportInfo';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div
      className="group flex flex-col lg:flex-row lg:items-start justify-between gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer"
      onClick={() => {
        console.log('clicked');
      }}
    >
      <div className="flex items-start gap-4">
        <button className="mt-1 hidden lg:block">
          <Icon path={mdiMagnify} size={0.8} className="text-slate-400" />
        </button>

        <div className="flex-1 flex justify-between lg:flex-col gap-1">
          <Typography variant="caption" className="!text-slate-400">
            Date
          </Typography>
          <Typography variant="body2">
            {format(activity.date, 'EEE MMM dd yyyy p')}
          </Typography>
        </div>
      </div>

      {activity.type === 'validation' && (
        <ValidationInfo
          endDate={activity.validationEndDate}
          rewardPending={activity.rewardPending}
          addValidator={activity.addValidator}
        />
      )}

      {(activity.type === 'send' || activity.type === 'receive') && (
        <SendInfo
          amount={activity.amount}
          to={activity.to}
          from={activity.from}
          type={activity.type}
        />
      )}

      {activity.type === 'export' && (
        <ExportInfo amount={activity.amount} chain={activity.chain} />
      )}
    </div>
  );
};
