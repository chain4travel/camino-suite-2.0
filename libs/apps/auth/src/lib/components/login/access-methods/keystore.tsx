'use client';

import { CamBtn, Input, Typography } from '@camino/ui';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useCallback, useState } from 'react';

import { AccessMethodProps } from './types';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';

export const KeystoreAccess = ({ onBack }: AccessMethodProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("selectedFile", selectedFile)
      setFile(selectedFile);
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

      reader.readAsText(selectedFile);
    }
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
    } catch (err) {
      setError(t('auth.invalidKeystoreFile'));
    }
  }, [file, fileContent, password, t]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col items-center w-[20rem] max-w-2xl p-4 mx-auto space-y-5">
      <Typography variant="h5" className="w-full text-center">
        {t('auth.keystoreInstructions')}
      </Typography>

      <div className="w-full">
        <input
          type="file"
          accept=".json,.keystore"
          onChange={handleFileSelect}
          className="hidden"
          id="keystore-file"
        />
        <label
          htmlFor="keystore-file"
          className={`
            block w-full px-4 py-2.5 rounded-lg font-normal text-sm transition-colors
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-white text-center
            hover:border-blue-500 dark:hover:border-blue-500
            cursor-pointer
          `}
        >
          {file ? file.name : t('auth.selectKeystoreFile')}

        </label>
      </div>

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
