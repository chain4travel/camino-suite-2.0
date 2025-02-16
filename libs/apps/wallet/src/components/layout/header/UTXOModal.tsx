import { Modal, CamBtn } from '@camino/ui';
import { useState } from 'react';
import clsx from 'clsx';
import { UTXO } from './header.types';

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

const TABLE_HEADERS = [
  { key: 'id', label: 'ID' },
  { key: 'type', label: 'Type' },
  { key: 'threshold', label: 'Threshold' },
  { key: 'owners', label: 'Owners' },
  { key: 'balance', label: 'Balance', align: 'right' as const },
];

interface UTXOModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UTXOModal = ({ isOpen, onClose }: UTXOModalProps) => {
  const [activeChain, setActiveChain] = useState<'X' | 'P'>('X');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wallet UTXO Breakdown"
      size="full"
      className="!h-[calc(100vh-150px)] !w-full md:!w-fit max-w-[95vw]"
    >
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <CamBtn
            variant={activeChain === 'X' ? 'primary' : 'secondary'}
            onClick={() => setActiveChain('X')}
          >
            X Chain
          </CamBtn>
          <CamBtn
            variant={activeChain === 'P' ? 'primary' : 'secondary'}
            onClick={() => setActiveChain('P')}
          >
            P Chain
          </CamBtn>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header.key}
                      className={clsx(
                        'py-2 px-4 text-slate-400 font-inter whitespace-nowrap',
                        header.align === 'right' && 'text-right'
                      )}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHAIN_UTXOS[activeChain].map((utxo) => (
                  <tr key={utxo.id} className="border-b border-slate-700/50">
                    <td className="py-2 px-4 text-sm font-inter break-all">
                      {utxo.id}
                    </td>
                    <td className="py-2 px-4 font-inter whitespace-nowrap">
                      {utxo.type}
                    </td>
                    <td className="py-2 px-4 font-inter whitespace-nowrap">
                      {utxo.threshold}
                    </td>
                    <td className="py-2 px-4 text-sm font-inter break-all">
                      {utxo.owners}
                    </td>
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      {utxo.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
