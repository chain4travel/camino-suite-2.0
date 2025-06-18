import { Typography, Input } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';
import {
  mdiCalendarStart,
  mdiCalendarEnd,
  mdiClockTimeThree,
  mdiPercent,
} from '@mdi/js';

export const ValidatorStatus = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
      <div className="flex flex-wrap items-center justify-between border border-slate-700 px-4 rounded-lg divide-x divide-slate-700">
        <StatusItem
          icon={mdiCalendarStart}
          label={t('wallet.validator.validationPeriodStart')}
          value="Feb 25th 2025, 5:22:00 PM"
        />
        <StatusItem
          icon={mdiCalendarEnd}
          label={t('wallet.validator.validationPeriodEnd')}
          value="Feb 24th 2030, 4:55:00 PM"
        />
        <StatusItem
          icon={mdiClockTimeThree}
          label={t('wallet.validator.remainingValidationPeriod')}
          value="4 Years 11 Months 28 Days"
        />
        <StatusItem
          icon={mdiPercent}
          label={t('wallet.validator.uptime')}
          value="100%"
        />
      </div>

      <Input
        value="NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
        label={t('wallet.validator.nodeId')}
        disabled
      />

      <div className="flex gap-2">
        <Input
          value="2000"
          disabled
          placeholder="MAX"
          className="flex-1"
          label={t('wallet.validator.bondedAmount')}
        />
        <div className="rounded-lg px-4 py-2 flex items-center self-end">
          <Typography>CAM</Typography>
        </div>
      </div>

      <Input
        value="UKW3C5zeun3Mhyispk3Pfa1CeuJVbUhxfj2uVo6Jjcj9YpwLN"
        label={t('wallet.validator.txId')}
        disabled
      />
    </div>
  );
};

interface StatusItemProps {
  icon: string;
  label: string;
  value: string;
}

const StatusItem = ({ icon, label, value }: StatusItemProps) => (
  <div className="w-1/4 h-full flex items-center justify-start gap-4 pl-4 py-4">
    <Icon path={icon} size={1} className="text-slate-900 dark:text-slate-100" />
    <div className="flex flex-col gap-1">
      <Typography variant="caption">{label}</Typography>
      <Typography variant="body2" className="!text-slate-400">
        {value}
      </Typography>
    </div>
  </div>
);
