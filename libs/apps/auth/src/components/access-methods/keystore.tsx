'use client';

import { CamBtn, FileInput, Input, Typography } from '@camino/ui';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useCallback, useState } from 'react';

import { AccessMethodProps } from './types';
import { useTranslation } from 'react-i18next';

export const KeystoreAccess = ({ onBack }: AccessMethodProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log("selectedFile", file)
    setFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        setFileContent(content);
      } catch (err) {
        setError(t('auth.invalidKeystoreFile') + ' ' + err);
        setFile(null);
        setFileContent('');
      }
    };

    reader.onerror = () => {
      setError(t('auth.fileReadError'));
      setFile(null);
      setFileContent('');
    };

    reader.readAsText(file);
  };

  const handleAccess = useCallback(() => {
    if (!file || !fileContent) {
      setError(t('auth.selectFileFirst'));
      return;
    }
    if (!password) {
      setError(t('auth.enterPassword'));
      return;
    }

    try {
      // Here you would validate the keystore file content
      const keystoreData = JSON.parse(fileContent);
      console.log('Accessing with keystore:', { keystoreData, password });
    } catch (error) {
      console.error(error)
      setError(t('auth.invalidKeystoreFile'));
    }
  }, [file, fileContent, password, t]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col items-center w-[20rem] max-w-2xl p-4 mx-auto space-y-5">
      <Typography variant="h5" className="w-full text-center">
        {t('auth.keystoreInstructions')}
      </Typography>

      <FileInput
        className="w-full"
        accept=".json,.keystore"
        onChange={handleFileSelect}
        value={file}
        error={error}
        placeholder={t('auth.selectKeystoreFile')}
      />

      {file && (
        <Input
          className="w-full"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth.enterPassword')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          autoComplete="off"
          rightIcon={showPassword ? mdiEyeOff : mdiEye}
          onIconClick={togglePasswordVisibility}
          iconAriaLabel={showPassword ? t('common.hidePassword') : t('common.showPassword')}
        />
      )}

      <CamBtn
        className="w-full max-w-md"
        onClick={handleAccess}
        fullWidth
        disabled={!file || !password}
      >
        {t('auth.accessWallet')}
      </CamBtn>

      <CamBtn
        variant="transparent"
        className="w-full"
        onClick={onBack}
        fullWidth
      >
        {t('common.cancel')}
      </CamBtn>
    </div>
  );
};
