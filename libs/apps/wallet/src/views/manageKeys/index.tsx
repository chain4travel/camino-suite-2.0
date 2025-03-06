'use client';
import { Container, Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { mdiContentSaveOutline, mdiDownload, mdiUpload } from '@mdi/js';
import Icon from '@mdi/react';
import { ActiveKey } from './components/ActiveKey';
import { OtherKeys } from './components/OtherKeys';
import { useState } from 'react';
import { Key } from '../types';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { ImportKeysModal } from './components/ImportKeysModal';
import { ExportKeysModal } from './components/ExportKeysModal';

export const ManageKeys = () => {
  const { t } = useTranslation();
  const [hasOtherWallets, setHasOtherWallets] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(2); // TODO: Get from actual selection
  const [activeWallet, setActiveWallet] = useState<Key>({
    id: '1',
    name: 'Singleton Wallet',
    address: 'X-kopernikus1v8weslt4jr4n0m0jseupz9frk9rt83u6x9rsvj',
    type: 'singleton'
  });

  const handleWalletNameChange = (id: string, name: string) => {
    if (id === activeWallet.id) {
      setActiveWallet({ ...activeWallet, name });
    }
    // Handle other wallets name change if needed
  };

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Typography variant="h2" className="font-light">
            {t('wallet.manageKeys.title')}
          </Typography>
          <div className="flex gap-2">
            <CamBtn 
              variant="transparent" 
              className="gap-2 !text-yellow-500"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Icon path={mdiContentSaveOutline} size={1} />
              {t('common.saveKeys')}
            </CamBtn>
            <CamBtn 
              variant="transparent" 
              className="gap-2"
              onClick={() => setIsImportOpen(true)}
            >
              <Icon path={mdiUpload} size={1} />
              {t('wallet.manageKeys.importKeys')}
            </CamBtn>
            <CamBtn 
              variant="transparent" 
              className="gap-2"
              onClick={() => setIsExportOpen(true)}
            >
              <Icon path={mdiDownload} size={1} />
              {t('wallet.manageKeys.exportKeys')}
            </CamBtn>
          </div>
        </div>

        <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col items-start justify-start gap-6 rounded-lg p-6 border-t border-slate-700 min-h-[400px] divide-y divide-slate-700">
          <div className="w-full flex flex-col gap-4">
            <Typography variant="h6" className='!text-slate-400'>{t('common.activeKey')}</Typography>
            <ActiveKey 
              wallet={activeWallet} 
              onWalletNameChange={handleWalletNameChange}
            />
          </div>

          {hasOtherWallets && (
            <div className="w-full flex flex-col gap-4 pt-4">
              <Typography variant="h6" className='!text-slate-400'>{t('common.otherKeys')}</Typography>
              <OtherKeys onWalletsChange={setHasOtherWallets} />
            </div>
          )}
        </div>

        <AccountSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          username="Ysrbolles"
        />
        <ImportKeysModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
        />
        <ExportKeysModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          selectedKeys={selectedKeys}
        />
      </div>
    </Container>
  );
};

export default ManageKeys;
