import { Typography } from '@camino/ui';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ValidationInfoProps } from '../../views/activity/types';

export const ValidationInfo = ({
  endDate,
  rewardPending,
  addValidator,
}: ValidationInfoProps) => {
  const { t } = useTranslation();
  if (!endDate) return null;

  return (
    <div className="flex-1 flex flex-col justify-between items-start lg:items-end gap-4">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex justify-between gap-8 ">
          <Typography variant="caption" className="!text-slate-400">
            {t('common.validationPeriodEndDate')}
          </Typography>
          <Typography variant="body2" className="!text-slate-400 text-right">
            {format(endDate, 'M/d/yyyy h:mm:ss a')}
          </Typography>
        </div>
        <div className="flex  justify-between gap-8">
          <Typography variant="caption" className="!text-slate-400">
            {t('common.rewardPending')}
          </Typography>
          <Typography variant="body2" className="!text-blue-500">
            {rewardPending}
          </Typography>
        </div>
        <div className="flex justify-between gap-8">
          <Typography variant="caption" className="!text-slate-400">
            {t('common.addValidator')}
          </Typography>
          <Typography variant="body2" className="!text-blue-500">
            {addValidator}
          </Typography>
        </div>
      </div>
    </div>
  );
};
