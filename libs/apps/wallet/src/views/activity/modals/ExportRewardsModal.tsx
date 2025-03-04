import { Modal, Typography, CamBtn, Checkbox } from '@camino/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ExportRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportRewardsModal = ({
  isOpen,
  onClose,
}: ExportRewardsModalProps) => {
  const { t } = useTranslation();
  const [isValidationRewardsChecked, setIsValidationRewardsChecked] =
    useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Rewards CSV">
      <div className="flex flex-col gap-6">
        <Typography variant="body1">
          {t('wallet.exportRewardsModal.description')}
        </Typography>

        <div className="flex items-center gap-2">
          <Checkbox
            id="written-phrase"
            checked={isValidationRewardsChecked}
            onChange={(e) => setIsValidationRewardsChecked(e.target.checked)}
          />
          <label htmlFor="written-phrase" className="cursor-pointer">
            <Typography variant="body2">
              {t('wallet.exportRewardsModal.validationRewards')}
            </Typography>
          </label>
        </div>

        <CamBtn
          variant="primary"
          className="w-full"
          onClick={() => {
            // Handle download
            onClose();
          }}
          disabled={!isValidationRewardsChecked}
        >
          {t('wallet.exportRewardsModal.download')}
        </CamBtn>
      </div>
    </Modal>
  );
};
