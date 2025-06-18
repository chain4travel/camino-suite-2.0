import { Box, CamBtn, Typography, Modal, Input } from '@camino/ui';
import { mdiFullscreen, mdiShare } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';
import Image from 'next/image';
import { Collectible } from '../../views/portfolio/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_COLLECTIBLES: Collectible[] = [
  {
    id: '1',
    name: 'A',
    symbol: 'A',
    numberOfGroups: 1,
    mintedGroups: [],
    txId: '2YQbtTUp7fLxo8gsj8FQEQKbwj5E3JzxG8jpLRdeUaDusiNKTK',
  },
  {
    id: '2',
    name: 'Batch',
    symbol: 'B',
    numberOfGroups: 1,
    mintedGroups: [],
    txId: 'yo3njXzFkYoC8evfivZ6Lo3gBRJiBboz1JCSR61SYpJmCNtsz',
  },
  {
    id: '3',
    name: 'test',
    symbol: 'TST',
    numberOfGroups: 3,
    mintedGroups: [
      {
        id: 2,
        name: 'test',
        type: 'JSON',
        image:
          'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?q=80&w=2432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 3,
        name: 'harry potter',
        type: 'JSON',
        image:
          'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=3478&auto=format&fit=crop',
      },
    ],
    txId: '21sJJtWPjjsxy3QaQu89ZZ1mPkkLcpZrhWKejMyvujxYUWbbDp',
  },
];

interface CollectiblesTabProps {
  searchQuery: string;
}

export const CollectiblesTab = ({ searchQuery }: CollectiblesTabProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [showAddCollectible, setShowAddCollectible] = useState(false);

  const handleTransfer = (txId: string) => {
    router.push(`/wallet/transfer?nft=${txId}&chain=X`);
  };

  // Filter collectibles based on search query
  const filteredCollectibles = MOCK_COLLECTIBLES.filter((collectible) =>
    collectible.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collectible.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4 border-t border-slate-700 rounded-lg">
      <div className="w-full bg-gray-200/50 dark:bg-slate-800/50 rounded-lg">
        {filteredCollectibles.length > 0 ? (
          filteredCollectibles.map(
            (collectible) =>
              collectible?.mintedGroups?.length > 0 && (
                <div key={collectible.id} className="mb-8 py-4">
                  <div className="px-4 py-2 w-full flex flex-wrap items-center gap-2 border-b border-slate-700">
                    <Typography
                      variant="body1"
                      className="font-medium capitalize"
                    >
                      {collectible.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="!text-slate-400 border-l border-slate-700 pl-2"
                    >
                      {collectible.symbol}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="!text-slate-400 truncate ml-auto"
                    >
                      {collectible.txId}
                    </Typography>
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 px-4">
                    {collectible.mintedGroups.map((group) => (
                      <Box
                        key={group.id}
                        className="w-[200px] !p-0 flex flex-col cdivide-y divide-slate-700"
                      >
                        <div className="w-full relative aspect-[3/4]">
                          {group.image && (
                            <Image
                              src={group.image}
                              alt={group.name}
                              fill
                              className="object-cover bg-cover"
                            />
                          )}
                        </div>
                        <div className="px-3 py-2">
                          <Typography variant="body2" className="capitalize">
                            {group.name}
                          </Typography>
                        </div>
                        <div className="p-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Typography
                              variant="caption"
                              className="!text-slate-400"
                            >
                              Group: {group.id}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="!text-slate-400"
                            >
                              {group.type}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="text-slate-400 hover:text-slate-300"
                              onClick={() => handleTransfer(collectible.txId)}
                            >
                              <Icon path={mdiShare} size={0.9} />
                            </button>
                            <button
                              className="text-slate-400 hover:text-slate-300"
                              onClick={() => setSelectedImage(group.image)}
                            >
                              <Icon path={mdiFullscreen} size={0.9} />
                            </button>
                          </div>
                        </div>
                      </Box>
                    ))}
                  </div>
                </div>
              )
          )
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <Typography variant="body1" className="text-slate-400">
              {t('common.noCollectibles')}
            </Typography>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <CamBtn variant="secondary" onClick={() => setShowAddCollectible(true)}>
          {t('common.addCollectible')}
        </CamBtn>
      </div>

      {/* Add Collectible Modal */}
      <Modal
        isOpen={showAddCollectible}
        onClose={() => setShowAddCollectible(false)}
        title={t('common.addCollectible')}
      >
        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.ercNftContractAddress')}
            </Typography>
            <Input placeholder="0x" className="w-full" />
          </div>
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.collectibleName')}
            </Typography>
            <Input placeholder="-" className="w-full" disabled />
          </div>
          <div>
            <Typography variant="body2" className="mb-2 text-slate-400">
              {t('common.collectibleSymbol')}
            </Typography>
            <Input placeholder="-" className="w-full" disabled />
          </div>
          <CamBtn variant="primary" className="w-full">
            {t('common.addCollectible')}
          </CamBtn>
        </div>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(undefined)}
        title="NFT Preview"
        size="xl"
      >
        <div className="relative w-full h-full aspect-square">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Collectible Preview"
              fill
              className="object-contain rounded-lg"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
