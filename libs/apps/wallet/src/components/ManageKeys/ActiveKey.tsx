import { Typography, CamBtn, Tooltip } from '@camino/ui';
import Icon from '@mdi/react';
import { mdiShieldKey, mdiPencil, mdiCheck, mdiClose } from '@mdi/js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Key } from '../../views/manageKeys/types';

interface ActiveKeyProps {
  wallet: Key;
  onWalletNameChange: (id: string, name: string) => void;
}

export const ActiveKey = ({ wallet, onWalletNameChange }: ActiveKeyProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(wallet.name);

  const handleSave = () => {
    onWalletNameChange(wallet.id, editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(wallet.name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-700">
      <div className="flex items-center gap-4">
        <Icon path={mdiShieldKey} size={1} className="text-red-500" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-transparent border border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Tooltip content={t('common.save')} position="bottom">
                    <button
                      className="text-green-500 cursor-pointer"
                      onClick={handleSave}
                    >
                      <Icon path={mdiCheck} size={0.8} />
                    </button>
                  </Tooltip>
                  <Tooltip content={t('common.cancel')} position="bottom">
                    <button
                      className="text-red-500 cursor-pointer"
                      onClick={handleCancel}
                    >
                      <Icon path={mdiClose} size={0.8} />
                    </button>
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
                  onClick={() => setIsEditing(true)}
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
      <div className="flex flex-col gap-1">
        <CamBtn variant="transparent">
          {t('wallet.manageKeys.viewPrivateKey')}
        </CamBtn>
        <CamBtn variant="transparent">
          {t('wallet.manageKeys.viewStaticKeys')}
        </CamBtn>
      </div>
    </div>
  );
};
