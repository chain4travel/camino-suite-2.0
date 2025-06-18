import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { SendInfoProps } from '../../views/activity/types';

export const SendInfo = ({ amount, to, from, type }: SendInfoProps) => {
  const { t } = useTranslation();
  return (
    <div className="lg:w-1/3 flex justify-between items-end gap-8">
      <div className="flex flex-col items-start gap-1">
        <Typography variant="caption" className="!text-slate-400">
          {type === 'send' ? 'Send' : 'Receive'}
        </Typography>
        {to && (
          <Typography variant="caption" className="!text-slate-400">
            {t('common.to')} {to}
          </Typography>
        )}
        {from && (
          <Typography variant="caption" className="!text-slate-400">
            {t('common.from')} {from}
          </Typography>
        )}
      </div>
      <Typography
        variant="body2"
        className={type === 'send' ? '!text-red-500' : '!text-green-500'}
      >
        {amount}
      </Typography>
    </div>
  );
};
