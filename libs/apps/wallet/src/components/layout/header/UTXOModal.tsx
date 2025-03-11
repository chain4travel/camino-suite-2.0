import { Modal, Table, Tabs, Typography } from '@camino/ui';
import { useState } from 'react';
import { UTXO } from './header.types';
import { Column } from 'libs/ui/src/lib/Table/Table.types';

const CHAIN_UTXOS: Record<'X' | 'P', UTXO[]> = {
  X: [
    {
      id: '2CffgzgLcXqAv3hPKQCjMtQbm2BGceLgcXFDq7gVoL8i2U3od1',
      type: 'SECP Transfer Output',
      threshold: 1,
      owners: 'X-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '199 999.976 CAM',
    },
  ],
  P: [
    {
      id: '2CffgzgLcXqAv3hPKQCjMtQbm2BGceLgcXFDq7gVoL8i2U3od1',
      type: 'SECP Transfer Output',
      threshold: 1,
      owners: 'P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '199 999.976 CAM',
    },
    {
      id: '6wSuYBDbuEeb39Vz9ghCNUBmiqxJ6rBpzMF34UDWdJga66wVR',
      type: 'Locked Output',
      threshold: 1,
      owners: 'P-kopernikus1g65uqn6t77p656w64023nh8nd9updzmxh8ttv3',
      balance: '100 CAM',
    },
  ],
};

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
            data={CHAIN_UTXOS[activeChain]}
            className="min-w-[800px]"
            size="sm"
            showDividers
          />
        </div>
      </div>
    </Modal>
  );
};
