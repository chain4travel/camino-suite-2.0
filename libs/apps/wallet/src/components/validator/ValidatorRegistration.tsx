import { Typography, Input, DatePicker } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { CamBtn } from '@camino/ui';
import { useState, useMemo } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface ValidatorRegistrationProps {
  onConfirm: (date: Date) => void;
}

export const ValidatorRegistration = ({ onConfirm }: ValidatorRegistrationProps) => {
  const { t } = useTranslation();
  const maxEndDate = new Date('2025-02-20T18:28:00');
  const [selectedDate, setSelectedDate] = useState<Date>(maxEndDate);
  const now = useMemo(() => new Date(), []);

  const duration = useMemo(() => {
    const totalMinutes = differenceInMinutes(selectedDate, now);
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    return {
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
    };
  }, [selectedDate, now]);

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

      <DatePicker
        label={t('wallet.validator.validationEndDate')}
        description={t('wallet.validator.bondingDescription')}
        maxEndDate={maxEndDate}
        value={selectedDate}
        showMaxOption
        onChange={setSelectedDate}
        placeholder={t('wallet.validator.maxDate')}
      />

      <div>
        <Typography variant="h6" className="mb-4">
          {t('wallet.validator.bondedAmount')}
        </Typography>
        <Typography variant="caption" className="!text-slate-400 mb-2 block">
          {t('wallet.validator.bondedAmountDescription', { amount: '2 000' })}
        </Typography>

        <div className="flex gap-2">
          <Input value="2000" disabled placeholder="MAX" className="flex-1" />
          <div className="rounded-lg px-4 py-2 flex items-center">
            <Typography>CAM</Typography>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <Typography variant="caption" className="!text-slate-400 block">
            {t('wallet.validator.duration.label')}
          </Typography>
          <Typography variant="h6">
            {durationText}
          </Typography>
        </div>

        <CamBtn 
          variant="primary" 
          onClick={() => selectedDate && onConfirm(selectedDate)}
          disabled={!selectedDate}
        >
          {t('wallet.validator.confirm')}
        </CamBtn>
      </div>
    </div>
  );
}; 