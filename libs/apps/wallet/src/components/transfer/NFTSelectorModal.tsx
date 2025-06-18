import { Modal, Typography } from '@camino/ui';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface NFTGroup {
  id: number;
  name: string;
  image?: string;
}

interface NFTSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nft: NFTGroup) => void;
  selectedNFTs: NFTGroup[];
}

const MOCK_NFTS = [
  {
    id: 1,
    name: 'test',
    groups: [
      {
        id: 1,
        name: 'test',
        image: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da',
      },
      {
        id: 2,
        name: 'test',
        image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239',
      },
    ],
  },
];

export const NFTSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedNFTs,
}: NFTSelectorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.selectCollectible')}
      size="lg"
    >
      <div className="flex flex-col gap-6">
        {MOCK_NFTS.map((collection) => (
          <div key={collection.id}>
            <Typography variant="h6" className="mb-4 capitalize">
              {collection.name}
            </Typography>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {collection.groups.map((nft) => {
                const isSelected = selectedNFTs.some(
                  (selected) => selected.id === nft.id
                );

                return (
                  <button
                    key={nft.id}
                    onClick={() => onSelect(nft)}
                    className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden group ${
                      isSelected
                        ? 'ring-2 ring-blue-500'
                        : 'hover:ring-2 hover:ring-blue-500/50'
                    }`}
                  >
                    {nft.image && (
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    {isSelected && (
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded">
                        <Typography variant="caption" className="text-white">
                          1
                        </Typography>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}; 