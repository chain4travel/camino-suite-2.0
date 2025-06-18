import { Typography, CamBtn, Input, Box } from '@camino/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mdiContentCopy } from '@mdi/js';
import Icon from '@mdi/react';

export const SignMessageCard = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');

  const handleSignMessage = async () => {
    try {
      const mockSignature = '6mnwYrX7L8EarDAhfzUWrFtxDm4QsR6V1CYQPyY44Kf4m5kJQWrFYgVc1TqEbVM3eoFyF7AbARf4W1D3Q87rHFhzhAPef';
      setSignature(mockSignature);
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg p-6 border border-slate-700">
      <div className="flex flex-col gap-6">
        <Typography variant="h4">{t('wallet.advanced.signMessage.title')}</Typography>
        <Typography variant="body2" className="text-slate-400">
          {t('wallet.advanced.signMessage.description')}
        </Typography>
        <div className="flex flex-col gap-4">
          <Input
            variant="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('wallet.advanced.signMessage.placeholder')}
            className="h-32"
          />
          <Typography variant="caption" className="!text-blue-500">
            {t('wallet.advanced.signMessage.warning')}
          </Typography>
          <CamBtn variant="primary" onClick={handleSignMessage} disabled={!message}>
            {t('wallet.advanced.signMessage.button')}
          </CamBtn>
        </div>
        {signature && (
          <div className="flex flex-col gap-2">
            <Typography variant="caption" className="!text-slate-400">
              {t('wallet.advanced.signMessage.signature')}
            </Typography>
            <Box className="bg-white dark:bg-gray-900 flex justify-between items-center">
              <Typography variant="body2" className="break-all">
                {signature}
              </Typography>
              <CamBtn
                variant="transparent"
                onClick={() => navigator.clipboard.writeText(signature)}
              >
                <Icon path={mdiContentCopy} size={1} className="text-slate-400" />
              </CamBtn>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}; 