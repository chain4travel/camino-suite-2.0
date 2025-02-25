import { Typography, Input, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';

interface ValidatorConfirmationProps {
  onCancel: () => void;
  onSubmit: () => void;
  endDate: Date;
}

export const ValidatorConfirmation = ({
  onCancel,
  onSubmit,
  endDate,
}: ValidatorConfirmationProps) => {
  const { t } = useTranslation();
  const now = new Date();

  const duration = useMemo(() => {
    const days = differenceInDays(endDate, now);
    const remainingHours = differenceInHours(endDate, now) % 24;
    const remainingMinutes = differenceInMinutes(endDate, now) % 60;

    return {
      days: Math.max(0, days),
      hours: Math.max(0, remainingHours),
      minutes: Math.max(0, remainingMinutes),
    };
  }, [endDate]);

  const durationText = useMemo(() => {
    const parts = [];
    if (duration.days > 0) {
      parts.push(t('wallet.validator.duration.days', { count: duration.days }));
    }
    if (duration.hours > 0) {
      parts.push(t('wallet.validator.duration.hours', { count: duration.hours }));
    }
    if (duration.minutes > 0) {
      parts.push(t('wallet.validator.duration.minutes', { count: duration.minutes }));
    }

    return parts.join(' ') || t('wallet.validator.duration.empty');
  }, [duration, t]);

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
      <Input
        value="NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
        label={t('wallet.validator.nodeId')}
        disabled
      />

      <Input
        value="2 000 CAM"
        label={t('wallet.validator.bondedAmount')}
        disabled
      />

      <div className="flex flex-col gap-2">
        <Typography variant="h6">
          {t('wallet.validator.validationPeriodStart')}
        </Typography>
        <Typography variant="body2" className="!text-slate-400 mb-2">
          {t('wallet.validator.validationStartDescription')}
        </Typography>
      </div>

      <Input
        value={format(endDate, 'P p')}
        label={t('wallet.validator.validationPeriodEnd')}
        disabled
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col gap-2">
          <Typography variant="caption" className="!text-slate-400 block">
            {t('wallet.validator.duration.label')}
          </Typography>
          <Typography variant="h6">{durationText}</Typography>
        </div>

        <div className="flex gap-2">
          <CamBtn variant="transparent" onClick={onCancel}>
            {t('common.cancel')}
          </CamBtn>
          <CamBtn variant="primary" onClick={onSubmit}>
            {t('common.submit')}
          </CamBtn>
        </div>
      </div>
    </div>
  );
}; 