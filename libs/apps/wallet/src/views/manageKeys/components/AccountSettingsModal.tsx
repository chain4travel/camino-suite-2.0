import { Modal, Typography, CamBtn, Input } from '@camino/ui';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import makeBlockie from 'ethereum-blockies-base64';

interface SaveAccountInput {
  accountName: string;
  password: string;
}

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onSuccess?: () => void;
}

export const AccountSettingsModal = ({
  isOpen,
  onClose,
  username,
  onSuccess,
}: AccountSettingsModalProps) => {
  const { t } = useTranslation();
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newErrors = [];
    if (!accountName) {
      newErrors.push('accountNameRequired');
    }
    if (password.length < 9) {
      newErrors.push('passwordLength');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push('passwordMatch');
    }
    setErrors(newErrors);
  }, [accountName, password, confirmPassword]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const input: SaveAccountInput = {
        accountName,
        password,
      };

      // TODO: Replace with actual store dispatch
      // await store.dispatch('Accounts/saveAccount', input);
      // const account = store.getters['Accounts/account'];
      // setAccount(account);

      // TODO: Replace with actual notification system
      // dispatchNotification({
      //   message: t('notifications.save_account'),
      //   type: 'success',
      // });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving account:', error);
      // Handle error notification
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    return errors.length === 0;
  };

  const getErrorMessage = (errorKey: string) => {
    switch (errorKey) {
      case 'passwordLength':
        return t('wallet.manageKeys.passwordLength');
      case 'accountNameRequired':
        return t('wallet.manageKeys.accountNameRequired');
      case 'passwordMatch':
        return t('wallet.manageKeys.passwordMismatch');
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('wallet.manageKeys.saveAccount')}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <img
            src={makeBlockie(username)}
            alt={username}
            className="w-16 h-16 rounded-full"
          />
        </div>

        <Typography variant="h4" className="text-center">
          {t('wallet.manageKeys.encodeWallet')}
        </Typography>

        <div className="flex flex-col gap-4">
          <Input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={t('wallet.manageKeys.accountName')}
            error={
              errors.includes('accountNameRequired')
                ? getErrorMessage('accountNameRequired')
                : undefined
            }
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('wallet.manageKeys.password')}
            error={
              errors.includes('passwordLength')
                ? getErrorMessage('passwordLength')
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
                ? getErrorMessage('passwordMatch')
                : undefined
            }
          />
        </div>

        <div className="flex items-start gap-2 bg-red-500/10 p-4 rounded-lg">
          <Icon
            path={mdiAlertCircleOutline}
            size={1}
            className="text-red-500 mt-1 shrink-0"
          />
          <Typography variant="body2" className="text-red-500">
            {t('wallet.manageKeys.clearingCache')}
          </Typography>
        </div>

        <CamBtn
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={
            !accountName || !password || !confirmPassword || errors.length > 0
          }
          loading={isLoading}
        >
          {t('common.save')}
        </CamBtn>
      </div>
    </Modal>
  );
};
