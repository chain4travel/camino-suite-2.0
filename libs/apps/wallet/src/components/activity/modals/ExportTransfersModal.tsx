import { Modal, Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';

interface ExportTransfersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTransfersModal = ({
  isOpen,
  onClose,
}: ExportTransfersModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Native Asset Transfers"
    >
      <div className="flex flex-col gap-6">
        <Typography variant="body1">
          {t('wallet.exportTransfersModal.description')}
        </Typography>

        <CamBtn
          variant="primary"
          className="w-full"
          onClick={() => {
            // Handle download
            onClose();
          }}
        >
          {t('wallet.exportTransfersModal.download')}
        </CamBtn>
      </div>
    </Modal>
  );
};
