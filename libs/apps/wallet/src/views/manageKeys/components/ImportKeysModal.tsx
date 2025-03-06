import { Modal, Typography, CamBtn, Input, Tabs, FileInput } from '@camino/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mdiListBox,
  mdiFileKey,
  mdiShieldKey,
  mdiAccountGroup,
  mdiMagnify,
} from '@mdi/js';
import Icon from '@mdi/react';

interface ImportKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = [
  {
    id: 'mnemonic',
    label: '',
    icon: mdiListBox,
  },
  {
    id: 'keystore',
    label: '',
    icon: mdiFileKey,
  },
  {
    id: 'privateKey',
    label: '',
    icon: mdiShieldKey,
  },
  {
    id: 'multisigAlias',
    label: '',
    icon: mdiAccountGroup,
  },
];

export const ImportKeysModal = ({ isOpen, onClose }: ImportKeysModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]['id']>('mnemonic');
  const [isLoading, setIsLoading] = useState(false);
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (file: File | null) => {
    setKeystoreFile(file);
    setError('');
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'multisigAlias':
        return t('wallet.manageKeys.addMultisigAlias');
      default:
        return t('wallet.manageKeys.importKey');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('wallet.manageKeys.importKeys')}
    >
      <div className="flex flex-col gap-6">
        <Typography variant="h5" className="text-center">
          {t('wallet.manageKeys.addKeys')}
        </Typography>

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as typeof activeTab)}
          className="w-full"
        />

        <div className="flex flex-col gap-4">
          {activeTab === 'mnemonic' && (
            <Input
              variant="textarea"
              placeholder={t('wallet.manageKeys.enterMnemonic')}
              className="h-32"
            />
          )}

          {activeTab === 'keystore' && (
            <>
              <FileInput
                className="w-full"
                accept=".json,.keystore"
                onChange={handleFileChange}
                value={keystoreFile}
                placeholder={t('auth.selectKeystoreFile')}
                label={t('common.keystore')}
              />
              <Input
                type="password"
                label={t('common.password')}
                placeholder={t('wallet.manageKeys.keystorePassword')}
              />
            </>
          )}

          {activeTab === 'privateKey' && (
            <Input
              type="password"
              placeholder={t('wallet.manageKeys.enterPrivateKey')}
            />
          )}

          {activeTab === 'multisigAlias' && (
            <div className="relative">
              <Input
                type="text"
                placeholder={t('wallet.manageKeys.multisigAlias')}
                className="pl-10"
              />
              <Icon
                path={mdiMagnify}
                size={1}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          )}
        </div>

        <CamBtn
          variant="primary"
          className="w-full uppercase"
          onClick={() => {}}
          loading={isLoading}
        >
          {getButtonText()}
        </CamBtn>
      </div>
    </Modal>
  );
};
