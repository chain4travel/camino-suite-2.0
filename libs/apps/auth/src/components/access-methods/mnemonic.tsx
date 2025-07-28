'use client';

import { Alert, CamBtn, MnemonicInput, Typography } from '@camino/ui';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useCallback, useMemo, useState } from 'react';
import * as bip39 from 'bip39';
import { AccessMethodProps } from './types';
import { useTranslation } from 'react-i18next';
import { useWalletStore } from '@camino/store';

export const MnemonicAccess = ({ onBack }: AccessMethodProps) => {
  const { t } = useTranslation();
  const [phrases, setPhrases] = useState<string[]>(Array(24).fill(''));
  const [showPhrase, setShowPhrase] = useState(false);
  const [error, setError] = useState('');
  const { accessWallet } = useWalletStore();

  const isValid = useMemo(() => {
    const filledWords = phrases.filter((phrase) => phrase.trim() !== '');

    if (filledWords.length !== 24) {
      setError('');
      return false;
    }

    const isValidMnemonic = bip39.validateMnemonic(phrases.join(' '));

    setError(isValidMnemonic ? '' : t('auth.invalidMnemonic'));

    return isValidMnemonic;
  }, [phrases]);

  const handleAccess = useCallback(() => {
    if (!isValid) {
      setError(t('auth.invalidMnemonic'));
      return;
    }
    accessWallet(phrases.join(' '));
  }, [phrases, isValid, t]);

  return (
    <section className="flex flex-col max-w-2xl p-4 mx-auto space-y-4">
      <Typography variant="h5" className="text-center">
        {t('auth.mnemonicInstructions')}
      </Typography>
      <Typography variant="caption" className="text-center">
        {t('auth.mnemonicInstructionsinfo')}
      </Typography>

      <MnemonicInput
        phrases={phrases}
        onChange={setPhrases}
        showPhrase={showPhrase}
        error={error}
      />

      {error && (
        <span className="text-xs lg:text-sm font-light text-error text-center">
          {error}
        </span>
      )}

      <CamBtn
        variant="transparent"
        leftIcon={showPhrase ? mdiEyeOff : mdiEye}
        onClick={() => setShowPhrase(!showPhrase)}
      >
        {showPhrase ? t('common.hidePhrase') : t('common.showPhrase')}
      </CamBtn>
      <CamBtn fullWidth onClick={handleAccess} disabled={!isValid}>
        {t('auth.accessWallet')}
      </CamBtn>

      <CamBtn variant="transparent" fullWidth onClick={onBack}>
        {t('common.cancel')}
      </CamBtn>
    </section>
  );
};
