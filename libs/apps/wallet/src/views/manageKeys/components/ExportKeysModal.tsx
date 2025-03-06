import { Modal, Typography, CamBtn, Input } from '@camino/ui';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ExportKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeys: number;
}

export const ExportKeysModal = ({ isOpen, onClose, selectedKeys }: ExportKeysModalProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newErrors = [];
    if (password.length < 9) {
      newErrors.push('passwordLength');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push('passwordMatch');
    }
    setErrors(newErrors);
  }, [password, confirmPassword]);

  const handleExport = async () => {
    if (errors.length > 0) return;

    setIsLoading(true);
    try {
      // TODO: Handle export logic here
      onClose();
    } catch (error) {
      console.error('Error exporting keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('wallet.manageKeys.exportKeys')}
    >
      <div className="flex flex-col gap-6">
        <Typography variant="h5" className="text-center">
          {t('wallet.manageKeys.selectedKeys', { count: selectedKeys })}
        </Typography>

        <Typography variant="body1" className="text-slate-400">
          {t('wallet.manageKeys.exportDescription')}
        </Typography>

        <div className="flex flex-col gap-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('wallet.manageKeys.password')}
            error={
              errors.includes('passwordLength')
                ? t('wallet.manageKeys.passwordLength')
                : undefined
            }
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('wallet.manageKeys.confirmPassword')}
            error={
              errors.includes('passwordMatch')
                ? t('wallet.manageKeys.passwordMismatch')
                : undefined
            }
          />
        </div>

        <CamBtn
          variant="primary"
          className="w-full uppercase"
          onClick={handleExport}
          disabled={!password || !confirmPassword || errors.length > 0}
          loading={isLoading}
        >
          {t('wallet.manageKeys.exportWallet')}
        </CamBtn>
      </div>
    </Modal>
  );
}; 