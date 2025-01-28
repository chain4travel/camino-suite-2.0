import { Alert, Box, CamBtn, Checkbox, Typography } from '@camino/ui';
import { useCallback, useEffect, useState } from 'react';

import MnemonicConfirmation from './mnemonic-confirmation';
import { generateMnemonic } from '@scure/bip39';
import { mdiCached } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import { wordlist } from '@scure/bip39/wordlists/english';

interface MnemonicKeysProps {
  onComplete: (phrase: string) => void;
}

export const MnemonicKeys = ({ onComplete }: MnemonicKeysProps) => {
  const { t } = useTranslation();
  const [phrase, setPhrase] = useState<string>('');
  const [hasWrittenPhrase, setHasWrittenPhrase] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateNewPhrase = useCallback(() => {
    const newPhrase = generateMnemonic(wordlist, 256);
    setPhrase(newPhrase);
  }, []);

  useEffect(() => {
    generateNewPhrase();
  }, [generateNewPhrase]);


  return (
    <Box className="flex flex-col !items-start w-full gap-20 p-8 lg:flex-row">
      <div className="flex flex-col items-end max-w-lg gap-4">
        <Box className="w-full p-4 bg-gray-200/50 dark:bg-slate-800/50">
          <div className="flex flex-wrap gap-2 ">
            <span className="text-slate-900 dark:text-slate-100">
              {phrase}
            </span>
          </div>
        </Box>
        <CamBtn
          variant="primary"
          onClick={generateNewPhrase}
          leftIcon={mdiCached}
        >
          {t('auth.regenerate')}
        </CamBtn>
      </div>
      <div className="flex flex-col w-full max-w-lg gap-4">
        <div className="w-16 h-16 p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-white"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <Typography variant="h1">
          {t('auth.keyPhrase')}
        </Typography>

        <Typography variant="body2" className="!text-slate-400">
          {t('auth.keyPhraseDescription')}
        </Typography>

        <Alert
          variant="warning"
          className="mt-4"
          description={t('auth.keyPhraseWarning')}
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id="written-phrase"
            checked={hasWrittenPhrase}
            onChange={(e) => setHasWrittenPhrase(e.target.checked)}
          />
          <label htmlFor="written-phrase" className="cursor-pointer">
            <Typography variant="body2">
              {t('auth.confirmWrittenPhrase')}
            </Typography>
          </label>
        </div>

        <CamBtn
          variant="primary"
          className="self-end"
          disabled={!hasWrittenPhrase}
          onClick={() => setShowConfirmation(true)}
        >
          {t('auth.accessWallet')}
        </CamBtn>

        {showConfirmation && (
          <MnemonicConfirmation
            phrase={phrase}
            onClose={() => setShowConfirmation(false)}
            onConfirm={() => onComplete(phrase)}
          />
        )}
      </div>
    </Box>
  );
};

export default MnemonicKeys;
