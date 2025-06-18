import { CamBtn, Input, Typography } from '@camino/ui';
import { mdiCamera } from '@mdi/js';
import { useTranslation } from 'react-i18next';

interface SendFormProps {
  toAddress: string;
  memo: string;
  selectedChain: string;
  confirmedTransaction: boolean;
  onAddressChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SendForm = ({
  toAddress,
  memo,
  selectedChain,
  confirmedTransaction,
  onAddressChange,
  onMemoChange,
  onConfirm,
  onCancel,
}: SendFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="lg:px-8 flex flex-col py-6 lg:w-2/6 gap-6">
      <Input
        value={toAddress}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="XXX"
        className="w-full"
        label={t('common.toAddress')}
        rightIcon={mdiCamera}
      />

      <Input
        value={memo}
        onChange={(e) => onMemoChange(e.target.value)}
        placeholder={t('common.memo')}
        className="w-full"
        label={t('common.memo')}
      />
      {selectedChain === 'C' && (
        <>
          <div>
            <Input
              value="200"
              className="w-full"
              label={t('common.gasPrice') + ' (nCAM)'}
              disabled
            />
            <Typography variant="caption" className="!text-slate-400">
              {t('common.adjustedAutomatically')}
            </Typography>
          </div>

          <div>
            <Input
              placeholder="-"
              className="w-full"
              label={t('common.gasLimit')}
              disabled
            />
            <Typography variant="caption" className="!text-slate-400">
              {t('common.calculatedAfterConfirm')}
            </Typography>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4 items-start justify-between mt-auto pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <Typography variant="body2" className="!text-slate-400">
            {t('common.transactionFee')}:
          </Typography>
          <Typography variant="body2" className="!text-slate-400">
            0.001 CAM
          </Typography>
        </div>
        {!confirmedTransaction ? (
          <CamBtn
            variant="primary"
            className="w-full"
            disabled={!toAddress}
            onClick={onConfirm}
          >
            {t('common.confirm')}
          </CamBtn>
        ) : (
          <>
            <CamBtn variant="primary" className="w-full" disabled={!toAddress}>
              {t('common.sendTransaction')}
            </CamBtn>
            <CamBtn variant="transparent" className="w-full" onClick={onCancel}>
              {t('common.cancel')}
            </CamBtn>
          </>
        )}
      </div>
    </div>
  );
}; 