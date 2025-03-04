import { isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ActivityCard } from './components/ActivityCard';
import { Activity } from './types';
import { MOCK_ACTIVITIES } from './mock-data';
import { Typography } from '@camino/ui';

type ActivityType = 'all' | 'transfer' | 'export_import' | 'validation';

interface ActivityListProps {
  type: ActivityType;
  currentMonth: Date;
}

export const ActivityList = ({ type, currentMonth }: ActivityListProps) => {
  const filteredActivities = MOCK_ACTIVITIES.filter(
    (activity) =>
      (type === 'all' ||
        (type === 'transfer' && activity.type === 'send') ||
        (type === 'export_import' && activity.type === 'export') ||
        (type === 'validation' && activity.type === 'validation')) &&
      isWithinInterval(activity.date, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      })
  );

  if (filteredActivities.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center mt-10">
        <Typography variant="h4" className="!text-slate-400">
          No Transactions Found
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {filteredActivities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};
