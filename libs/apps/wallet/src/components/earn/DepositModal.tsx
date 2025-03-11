import {
  Typography,
  Input,
  CamBtn,
  Alert,
  Modal,
  DatePicker,
} from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { PoolInfo } from './PoolInfo';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolData: {
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
  };
}

export const DepositModal = ({
  isOpen,
  onClose,
  poolData,
}: DepositModalProps) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(poolData.endDate);
  const [amount, setAmount] = useState<string>('');

  const handleMaxAmount = () => {
    setAmount('10000');
  };

  const onAmountChange = (value: string) => {
    setAmount(value);
  };

  const calculateDuration = () => {
    const diff = selectedDate.getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days} Day${days > 1 ? 's' : ''} ${hours} Hours ${mins} Mins ${secs} Secs`;
    }
    return `${hours} Hours ${mins} Mins ${secs} Secs`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={poolData.title}
      size="xl"
    >
      <div className="flex flex-col gap-6">
        <PoolInfo {...poolData} />

        <div className="flex flex-col gap-2">
          <Typography variant="h6">Deposit duration</Typography>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minStartDate={poolData.startDate}
            maxEndDate={poolData.endDate}
            showMaxOption
            placeholder="Select date"
          />
          <Typography variant="body2">{calculateDuration()}</Typography>
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="h6">Deposit Owner</Typography>
          <Input placeholder="Deposit Owner" />
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="h6">Deposit Amount</Typography>
          <div className="w-full flex gap-2">
            <div className="relative w-full h-fit flex items-center justify-between">
              <Input
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="w-full !pr-16"
                label={t('common.amount')}
              />
              <button
                onClick={handleMaxAmount}
                className="absolute right-4 top-2/3 mt-1 -translate-y-1/2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Typography
                  variant="caption"
                  className="!text-slate-400 hover:!text-slate-200"
                >
                  MAX
                </Typography>
              </button>
            </div>
            <CamBtn variant="secondary" className="w-24 self-end">
              CAM
            </CamBtn>
          </div>
        </div>

        <Alert
          variant="warning"
          description="Creating this depositOffer will incur a fee of 0.001 CAM"
        />

        <div className="flex justify-end gap-2">
          <CamBtn variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </CamBtn>
          <CamBtn variant="primary">{t('earn.depositNow')}</CamBtn>
        </div>
      </div>
    </Modal>
  );
};
