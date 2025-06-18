import { Typography, CamBtn, Input } from '@camino/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CheckMessageCard = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');

  const handleCheckSource = async () => {
    try {
      // TODO: Implement message source checking logic
      console.log('Checking message:', message);
      console.log('With signature:', signature);
    } catch (error) {
      console.error('Error checking message source:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg p-6 border border-slate-700">
      <div className="flex flex-col gap-6">
        <Typography variant="h4">{t('wallet.advanced.checkSource.title')}</Typography>
        <Typography variant="body2" className="text-slate-400">
          {t('wallet.advanced.checkSource.description')}
        </Typography>
        <div className="flex flex-col gap-4">
          <Input
            variant="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('wallet.advanced.checkSource.messagePlaceholder')}
            className="h-32"
          />
          <Input
            variant="textarea"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder={t('wallet.advanced.checkSource.signaturePlaceholder')}
            className="h-32"
          />
        </div>
        <CamBtn variant="primary" onClick={handleCheckSource}>
          {t('wallet.advanced.checkSource.button')}
        </CamBtn>
      </div>
    </div>
  );
}; 