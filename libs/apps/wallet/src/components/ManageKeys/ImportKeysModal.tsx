import { Modal, Typography, CamBtn, Input, Tabs, FileInput } from '@camino/ui';
import { useState, ChangeEvent } from 'react';
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

interface ImportForm {
  mnemonic: string;
  keystorePassword: string;
  privateKey: string;
  multisigAlias: string;
}

const TABS = [
  { id: 'mnemonic', icon: mdiListBox },
  { id: 'keystore', icon: mdiFileKey },
  { id: 'privateKey', icon: mdiShieldKey },
  { id: 'multisigAlias', icon: mdiAccountGroup },
] as const;

type TabId = (typeof TABS)[number]['id'];

export const ImportKeysModal = ({ isOpen, onClose }: ImportKeysModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('mnemonic');
  const [isLoading, setIsLoading] = useState(false);
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [form, setForm] = useState<ImportForm>({
    mnemonic: '',
    keystorePassword: '',
    privateKey: '',
    multisigAlias: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setKeystoreFile(file);
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'mnemonic':
          // Handle mnemonic import
          break;
        case 'keystore':
          // Handle keystore import
          break;
        case 'privateKey':
          // Handle private key import
          break;
        case 'multisigAlias':
          // Handle multisig alias import
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error importing keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mnemonic':
        return (
          <Input
            variant="textarea"
            name="mnemonic"
            value={form.mnemonic}
            onChange={handleInputChange}
            placeholder={t('wallet.manageKeys.enterMnemonic')}
            className="h-32"
          />
        );

      case 'keystore':
        return (
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
              name="keystorePassword"
              value={form.keystorePassword}
              onChange={handleInputChange}
              label={t('common.password')}
              placeholder={t('wallet.manageKeys.keystorePassword')}
            />
          </>
        );

      case 'privateKey':
        return (
          <Input
            type="password"
            name="privateKey"
            value={form.privateKey}
            onChange={handleInputChange}
            placeholder={t('wallet.manageKeys.enterPrivateKey')}
          />
        );

      case 'multisigAlias':
        return (
          <div className="relative">
            <Input
              type="text"
              name="multisigAlias"
              value={form.multisigAlias}
              onChange={handleInputChange}
              placeholder={t('wallet.manageKeys.multisigAlias')}
              className="pl-10"
            />
            <Icon
              path={mdiMagnify}
              size={1}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        );
    }
  };

  const getButtonText = () => {
    return activeTab === 'multisigAlias'
      ? t('wallet.manageKeys.addMultisigAlias')
      : t('wallet.manageKeys.importKey');
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
          onChange={(tab) => setActiveTab(tab as TabId)}
          className="w-full"
          fullWidth
        />

        <div className="flex flex-col gap-4">{renderTabContent()}</div>

        <CamBtn
          variant="primary"
          className="w-full uppercase"
          onClick={handleImport}
          isLoading={isLoading}
        >
          {getButtonText()}
        </CamBtn>
      </div>
    </Modal>
  );
};
