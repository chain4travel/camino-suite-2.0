import { Modal, Typography, CamBtn, Input } from '@camino/ui';
import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ExportKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeys: number;
}

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

type ErrorType = 'passwordLength' | 'passwordMatch';

export const ExportKeysModal = ({ isOpen, onClose, selectedKeys }: ExportKeysModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PasswordForm>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: ErrorType[] = [];
    const { password, confirmPassword } = form;

    if (password.length < 9) {
      newErrors.push('passwordLength');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push('passwordMatch');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [form.password, form.confirmPassword]);

  const handleExport = async () => {
    if (!validateForm()) return;

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

  const getErrorMessage = (type: ErrorType) => {
    if (!errors.includes(type)) return undefined;

    const errorMessages = {
      passwordLength: 'wallet.manageKeys.passwordLength',
      passwordMatch: 'wallet.manageKeys.passwordMismatch',
    };

    return t(errorMessages[type]);
  };

  const isFormValid = form.password && form.confirmPassword && errors.length === 0;

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
            name="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder={t('wallet.manageKeys.password')}
            error={getErrorMessage('passwordLength')}
          />
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('wallet.manageKeys.confirmPassword')}
            error={getErrorMessage('passwordMatch')}
          />
        </div>

        <CamBtn
          variant="primary"
          className="w-full uppercase"
          onClick={handleExport}
          disabled={!isFormValid}
          isLoading={isLoading}
        >
          {t('wallet.manageKeys.exportWallet')}
        </CamBtn>
      </div>
    </Modal>
  );
}; 