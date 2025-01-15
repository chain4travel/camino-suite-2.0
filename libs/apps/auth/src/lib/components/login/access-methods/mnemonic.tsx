'use client';

import { Box, CamBtn, Input, Typography } from '@camino/ui';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

export const MnemonicAccess = ({ onBack }: { onBack: () => void }) => {
  const { t } = useTranslation();
  const [phrases, setPhrases] = useState(Array(24).fill(''));
  const [showPhrase, setShowPhrase] = useState(false);

  const handlePhraseChange = (index: number, value: string) => {
    const newPhrases = [...phrases];
    newPhrases[index] = value;
    setPhrases(newPhrases);
  };

  const handleAccess = useCallback(() => {
    console.log('Accessing with mnemonic:', phrases);
  }, [phrases]);

  return (
    <Box className="flex flex-col space-y-4">
      <Typography variant="body2" className="text-gray-400">
        {t('auth.mnemonicInstructions')}
      </Typography>

      <Box className="grid grid-cols-4 gap-2">
        {phrases.map((phrase, index) => (
          <Box key={index} className="flex items-center">
            <Typography variant="body2" className="w-6 text-gray-400">
              {index + 1}.
            </Typography>
            <Input
              value={phrase}
              type={showPhrase ? 'text' : 'password'}
              onChange={(e) => handlePhraseChange(index, e.target.value)}
            />
          </Box>
        ))}
      </Box>

      <Box className="flex items-center justify-center">
        <CamBtn
          variant="transparent"
          icon={showPhrase ? mdiEyeOff : mdiEye}
          onClick={() => setShowPhrase(!showPhrase)}
        >
          {showPhrase ? t('common.hidePhrase') : t('common.showPhrase')}
        </CamBtn>
      </Box>

      <CamBtn fullWidth onClick={handleAccess}>
        {t('auth.accessWallet')}
      </CamBtn>
    </Box>
  );
};
