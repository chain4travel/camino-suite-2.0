import { CamBtn, Modal, Typography } from '@camino/ui';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MnemonicConfirmationProps {
  phrase: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const MnemonicConfirmation = ({
  phrase,
  onClose,
  onConfirm,
}: MnemonicConfirmationProps) => {
  const { t } = useTranslation();
  const words = phrase.split(' ');

  // Initialize selected indices and user inputs only once when component mounts
  const [selectedIndices] = useState(() => {
    const indices = new Set<number>();
    while (indices.size < 4) {
      indices.add(Math.floor(Math.random() * 24));
    }
    return Array.from(indices);
  });

  const [userInputs, setUserInputs] = useState<Record<number, string>>(() => {
    const initialInputs: Record<number, string> = {};
    words.forEach((word, index) => {
      if (!selectedIndices.includes(index)) {
        initialInputs[index] = word;
      }
    });
    return initialInputs;
  });

  const handleInputChange = (index: number, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [index]: value.toLowerCase(),
    }));
  };

  const isValid = selectedIndices.every(
    (index) => userInputs[index]?.toLowerCase() === words[index].toLowerCase()
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Verify Mnemonic"
      size="xl"
      className="max-w-4xl"
    >
      <div className="flex flex-col gap-6">
        <Typography variant="h2" className="text-center">
          Fill In Mnemonic Phrase Below
        </Typography>

        <div className="grid grid-cols-3 px-8 gap-x-12 gap-y-6">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-slate-500 min-w-[2rem]">{index + 1}.</span>
              <input
                type="text"
                value={userInputs[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={!selectedIndices.includes(index)}
                className={`w-full bg-transparent border-0 border-b pb-1 text-lg focus:ring-0 ${
                  selectedIndices.includes(index)
                    ? 'border-primary text-slate-900 dark:text-slate-100'
                    : 'border-slate-700 text-slate-400'
                } ${!selectedIndices.includes(index) ? 'cursor-not-allowed' : ''}`}
                style={{ outline: 'none' }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between px-8 mt-8">
          <CamBtn variant="secondary" onClick={onClose}>
            Cancel
          </CamBtn>
          <CamBtn variant="primary" disabled={!isValid} onClick={onConfirm}>
            Verify
          </CamBtn>
        </div>
      </div>
    </Modal>
  );
};

export default MnemonicConfirmation;
