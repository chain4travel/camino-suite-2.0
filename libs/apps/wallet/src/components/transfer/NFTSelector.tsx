import { Typography } from '@camino/ui';
import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import Image from 'next/image';
import { useState } from 'react';
import { NFTSelectorModal } from './NFTSelectorModal';

interface NFTGroup {
  id: number;
  name: string;
  image?: string;
}

interface NFTSelectorProps {
  selectedNFTs: NFTGroup[];
  onNFTSelect: (nft: NFTGroup) => void;
}

export const NFTSelector = ({ selectedNFTs, onNFTSelect }: NFTSelectorProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {selectedNFTs.map((nft) => (
          <div
            key={nft.id}
            className="relative w-[120px] aspect-[3/4] group"
          >
            {nft.image && (
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className="object-cover rounded-lg"
              />
            )}
            <button
              onClick={() => onNFTSelect(nft)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-slate-900/80 rounded-full text-white"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded">
              <Typography variant="caption" className="text-white">
                1
              </Typography>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowModal(true)}
          className="w-[120px] aspect-[3/4] border border-dashed border-slate-700 rounded-lg flex items-center justify-center"
        >
          <Icon path={mdiPlus} size={1.5} className="text-slate-400" />
        </button>
      </div>

      <NFTSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(nft) => {
          onNFTSelect(nft);
          setShowModal(false);
        }}
        selectedNFTs={selectedNFTs}
      />
    </>
  );
}; 