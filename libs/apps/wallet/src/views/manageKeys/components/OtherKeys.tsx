import { Typography, CamBtn, Tooltip, Loader } from '@camino/ui';
import Icon from '@mdi/react';
import {
  mdiAccountGroup,
  mdiPencil,
  mdiWalletBifoldOutline,
  mdiDeleteOutline,
  mdiAlertOutline,
  mdiCheck,
  mdiClose,
} from '@mdi/js';
import { useState } from 'react';
import { Key } from '../types';
import { useTranslation } from 'react-i18next';

const MOCK_WALLETS: Key[] = [
  {
    id: '1',
    name: 'Multisig Wallet (test deposit)',
    address: 'P-kopernikus1cha47w7dt0etzptv4tws37spthuf4cpywxqp06',
    type: 'multisig',
  },
  {
    id: '2',
    name: 'Multisig Wallet 2',
    address: 'P-kopernikus1abc47w7dt0etzptv4tws37spthuf4cpywxqp07',
    type: 'multisig',
  },
  // Add more mock wallets as needed
];

interface OtherKeysProps {
  onWalletsChange: (hasWallets: boolean) => void;
}

interface EditingState {
  id: string | null;
  name: string;
}

export const OtherKeys = ({ onWalletsChange }: OtherKeysProps) => {
  const { t } = useTranslation();
  const [showImportPrompt, setShowImportPrompt] = useState(true);
  const [wallets, setWallets] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState<EditingState>({ id: null, name: '' });

  const handleEditStart = (wallet: Key) => {
    setEditing({ id: wallet.id, name: wallet.name });
  };

  const handleEditSave = () => {
    if (editing.id) {
      setWallets(wallets.map(wallet => 
        wallet.id === editing.id 
          ? { ...wallet, name: editing.name }
          : wallet
      ));
      setEditing({ id: null, name: '' });
    }
  };

  const handleEditCancel = () => {
    setEditing({ id: null, name: '' });
  };

  const handleImportWallets = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWallets(MOCK_WALLETS);
      setShowImportPrompt(false);
      onWalletsChange(true);
    } catch (error) {
      console.error('Error importing wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWallet = (id: string) => {
    const updatedWallets = wallets.filter((wallet) => wallet.id !== id);
    setWallets(updatedWallets);
    if (updatedWallets.length === 0) {
      onWalletsChange(false);
    }
  };

  const handleDismiss = () => {
    setShowImportPrompt(false);
    onWalletsChange(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-32">
        <Loader />
      </div>
    );
  }

  if (!showImportPrompt && wallets.length === 0) {
    return null;
  }

  if (showImportPrompt) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-700">
        <div className="flex flex-col gap-2">
          <Typography variant="body1">
            {t('wallet.manageKeys.otherKeys.importPrompt.title', {
              count: MOCK_WALLETS.length,
            })}
          </Typography>
          <Typography variant="body1">
            {t('wallet.manageKeys.otherKeys.importPrompt.description')}
          </Typography>
        </div>
        <div className="flex justify-end gap-2">
          <CamBtn
            variant="secondary"
            onClick={handleDismiss}
            disabled={isLoading}
          >
            {t('common.dismiss')}
          </CamBtn>
          <CamBtn 
            variant="primary" 
            onClick={handleImportWallets}
            disabled={isLoading}
          >
            {t('common.importWallets')}
          </CamBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-700"
        >
          <div className="flex items-center gap-4">
            <Icon path={mdiAccountGroup} size={1} className="text-slate-400" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {editing.id === wallet.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="bg-transparent border border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Tooltip content={t('common.save')} position="bottom">
                        <Icon
                          path={mdiCheck}
                          size={0.8}
                          className="text-green-500 cursor-pointer"
                          onClick={handleEditSave}
                        />
                      </Tooltip>
                      <Tooltip content={t('common.cancel')} position="bottom">
                        <Icon
                          path={mdiClose}
                          size={0.8}
                          className="text-red-500 cursor-pointer"
                          onClick={handleEditCancel}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <>
                    <Typography variant="h4">{wallet.name}</Typography>
                    <Tooltip
                      content={t('common.editWalletName')}
                      className="cursor-pointer"
                      position="bottom"
                      onClick={() => handleEditStart(wallet)}
                    >
                      <Icon
                        path={mdiPencil}
                        size={0.8}
                        className="text-slate-900 dark:text-slate-100"
                      />
                    </Tooltip>
                  </>
                )}
              </div>
              <Typography variant="body2" className="text-slate-400">
                {wallet.address}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Tooltip
                content={t('common.forgetKey')}
                className="cursor-pointer"
                position="bottom"
              >
                <Icon
                  path={mdiAlertOutline}
                  size={1}
                  className="text-yellow-500"
                />
              </Tooltip>
              <CamBtn variant="transparent">
                {t('common.multisigOwners')}
              </CamBtn>
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip content={t('common.activateKey')} position="bottom">
                <Icon
                  path={mdiWalletBifoldOutline}
                  size={1}
                  className="text-slate-900 dark:text-slate-100 cursor-pointer"
                />
              </Tooltip>
              <Tooltip
                content={t('common.deleteWallet')}
                position="bottom"
                onClick={() => handleDeleteWallet(wallet.id)}
              >
                <Icon
                  path={mdiDeleteOutline}
                  size={1}
                  className="text-red-500 cursor-pointer"
                />
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
