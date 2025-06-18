import { Input, Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';

interface AirdropFormProps {
  toAddress: string;
  memo: string;
  onAddressChange: (value: string) => void;
  onMemoChange: (value: string) => void;
}

export const AirdropForm = ({
  toAddress,
  memo,
  onAddressChange,
  onMemoChange,
}: AirdropFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 bg-gray-200/50 dark:bg-slate-800/50 rounded-lg px-4 py-6 border-t border-slate-700">
      <div>
        <Input
          value={toAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="X-[...];1.5,X-[...];10"
          className="w-full"
          label={t('common.receiversAndAmounts')}
        />
        <Typography variant="caption" className="mt-2 !text-slate-400">
          {t('common.addressesAndAmounts', {
            addresses: 0,
            amount: '0 CAM',
          })}
        </Typography>
      </div>

      <Input
        value={memo}
        onChange={(e) => onMemoChange(e.target.value)}
        placeholder={t('common.memo')}
        className="w-full"
        label={t('common.memo')}
      />

      <CamBtn variant="primary" className="w-full mt-auto" disabled={!toAddress}>
        {t('common.sendTransaction')}
      </CamBtn>
    </div>
  );
}; 