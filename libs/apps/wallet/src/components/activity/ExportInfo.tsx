import { Typography } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { ExportInfoProps } from '../../views/activity/types';

export const ExportInfo = ({ amount, chain }: ExportInfoProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full lg:w-1/3 flex justify-between items-end gap-8 self-end">
      <Typography variant="caption" className="!text-slate-400">
        {t('common.export')} ({chain})
      </Typography>
      <Typography variant="body2" className="!text-red-500">
        {amount}
      </Typography>
    </div>
  );
};
