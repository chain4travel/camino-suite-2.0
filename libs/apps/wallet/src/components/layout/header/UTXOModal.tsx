import { Modal, Table, Tabs, Typography } from '@camino/ui';
import { useMemo, useState } from 'react';
import { Column, UTXO } from './header.types';
import {
  balanceText,
  sortFnc,
  typeName,
  useAssetsStore,
  useWalletStore,
} from '@camino/store';

import { ava, bintools } from '@camino/store';

const TABS = [
  { id: 'X', label: 'X Chain' },
  { id: 'P', label: 'P Chain' },
];

const columns: Column<UTXO>[] = [
  {
    key: 'id' as keyof UTXO,
    header: 'ID',
    render: (utxo: UTXO) => (
      <Typography variant="body2" className="font-mono break-all">
        {utxo.id}
      </Typography>
    ),
  },
  {
    key: 'type' as keyof UTXO,
    header: 'Type',
    render: (utxo: UTXO) => (
      <Typography variant="body2" className="whitespace-nowrap">
        {utxo.type}
      </Typography>
    ),
  },
  {
    key: 'threshold' as keyof UTXO,
    header: 'Threshold',
    render: (utxo: UTXO) => (
      <Typography variant="body2">{utxo.threshold}</Typography>
    ),
  },
  {
    key: 'owners' as keyof UTXO,
    header: 'Owners',
    render: (utxo: UTXO) => (
      <Typography variant="body2" className="font-mono break-all">
        {utxo.owners}
      </Typography>
    ),
  },
  {
    key: 'balance' as keyof UTXO,
    header: 'Balance',
    align: 'right' as const,
    render: (utxo: UTXO) => (
      <Typography variant="body2" className="whitespace-nowrap">
        {utxo.balance}
      </Typography>
    ),
  },
];

interface UTXOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UTXOModal = ({ isOpen, onClose }: UTXOModalProps) => {
  const [activeChain, setActiveChain] = useState<'X' | 'P'>('X');
  const { activeWallet } = useWalletStore();
  const assetStore = useAssetsStore();

  const avmUTXOs = useMemo(() => {
    const utxos = activeWallet?.getUTXOSet().getAllUTXOs();
    const sorted = utxos?.sort(sortFnc);
    return sorted;
  }, [assetStore]);

  const platformUTXOs = useMemo(() => {
    const utxos = activeWallet?.getPlatformUTXOSet().getAllUTXOs();
    const sorted = utxos?.sort(sortFnc);
    return sorted;
  }, [assetStore]);

  const data = useMemo(() => {
    const utxosSorted = activeChain === 'X' ? avmUTXOs : platformUTXOs;
    const list = utxosSorted?.map((utxo) => {
      const hrp = ava.getHRP();
      const out = utxo.getOutput();
      const typeID = out.getTypeID();
      const id = activeChain === 'X' ? 'X' : 'P';
      const addrs = out.getAddresses();
      const addrsClean = addrs.map((addr) => {
        return bintools.addressToString(hrp, id, addr);
      });
      let assetID = utxo.getAssetID();
      let idClean = bintools.cb58Encode(assetID);
      let asset =
        assetStore.assetsDict[idClean] || assetStore.nftFamsDict[idClean];
      return {
        id: utxo.getUTXOID(),
        type: typeName(typeID),
        threshold: out.getThreshold(),
        owners: addrsClean.join(', '),
        balance:
          balanceText(typeID, utxo.getOutput(), assetStore.getAssetAVA()) +
          ' ' +
          (asset ? asset.symbol : ''),
      };
    });
    return list;
  }, [assetStore, activeChain]);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'X' || tabId === 'P') {
      setActiveChain(tabId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wallet UTXO Breakdown"
      size="full"
      className="!h-[calc(100vh-150px)] !w-full md:!w-fit max-w-[95vw]"
    >
      <div className="flex flex-col h-full">
        <Tabs
          tabs={TABS}
          activeTab={activeChain}
          onChange={handleTabChange}
          className="mb-4"
        />

        <div className="flex-1 overflow-auto">
          <Table
            columns={columns}
            data={data}
            className="min-w-[800px]"
            size="sm"
            showDividers
          />
        </div>
      </div>
    </Modal>
  );
};
