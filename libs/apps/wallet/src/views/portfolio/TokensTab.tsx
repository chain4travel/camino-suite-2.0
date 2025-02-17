import { CamBtn, Table, Typography, Modal, Input } from '@camino/ui';
import Image from 'next/image';
import { Asset } from './types';
import { mdiPlus, mdiSwapHorizontal, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TokensTabProps {
  assets: Asset[];
}

export const TokensTab = ({ assets }: TokensTabProps) => {
  const { t } = useTranslation();
  const [showAddToken, setShowAddToken] = useState(false);
  const [showAddTokenList, setShowAddTokenList] = useState(false);
  const isBalanceZero = (balance: string) => balance === '0';

  const columns = [
    {
      key: 'name',
      header: t('common.name'),
      render: (asset: Asset) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 relative">
            <Image
              src={asset.icon}
              alt={asset.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-1">
            <Typography variant="body1" className="font-medium">
              {asset.name} ({asset.symbol})
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'send',
      header: t('common.send'),
      align: 'center' as const,
      render: (asset: Asset) => (
        <button
          className={`text-blue-500 hover:text-blue-600 ${
            isBalanceZero(asset.balance) ? 'opacity-50' : ''
          }`}
          disabled={isBalanceZero(asset.balance)}
        >
          <Icon
            path={mdiSwapHorizontal}
            size={1}
            className="text-slate-900 dark:text-slate-100"
          />
        </button>
      ),
    },
    {
      key: 'balance',
      header: t('common.balance'),
      align: 'right' as const,
      render: (asset: Asset) => (
        <Typography variant="body1" className="font-medium">
          {asset.balance}
        </Typography>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-4 container mx-auto max-w-container">
      <Table<Asset>
        columns={columns}
        data={assets}
        emptyMessage={t('common.noAssets')}
        className="shadow-sm !gap-1"
        layout="spaceBetween"
      />
      <div className="w-fit flex flex-col lg:flex-row items-center gap-4 justify-between mt-4">
        <CamBtn
          variant="secondary"
          onClick={() => setShowAddToken(true)}
        >
          {t('wallet.addToken')}
        </CamBtn>
        <Typography variant="body1" className="!text-slate-400">
          {t('common.or')}
        </Typography>
        <CamBtn
          variant="secondary"
          onClick={() => setShowAddTokenList(true)}
        >
          {t('wallet.addTokenList')}
        </CamBtn>
      </div>

      <Modal
        isOpen={showAddToken}
        onClose={() => setShowAddToken(false)}
        title={t('wallet.addToken')}
      >
        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('wallet.tokenContractAddress')}
            </Typography>
            <Input placeholder="0x" className="w-full" />
          </div>
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.tokenName')}
            </Typography>
            <Input placeholder="-" className="w-full" disabled />
          </div>
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.tokenSymbol')}
            </Typography>
            <Input placeholder="-" className="w-full" disabled />
          </div>
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.decimalsOfPrecision')}
            </Typography>
            <Input placeholder="0" className="w-full" disabled />
          </div>
          <CamBtn variant="primary" className="w-full">
            {t('wallet.addToken')}
          </CamBtn>
        </div>
      </Modal>

      <Modal
        isOpen={showAddTokenList}
        onClose={() => setShowAddTokenList(false)}
        title={t('wallet.addTokenList')}
      >
        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('wallet.tokenListURL')}
            </Typography>
            <Input placeholder="https://" className="w-full" />
          </div>
          <CamBtn variant="primary" className="w-full">
            {t('wallet.addTokenList')}
          </CamBtn>
        </div>
      </Modal>
    </div>
  );
};
