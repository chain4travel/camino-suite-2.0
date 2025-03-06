import { Typography, CamBtn } from '@camino/ui';
import { useTranslation } from 'react-i18next';

const CHAIN_IMPORTS = [
  { from: 'P', to: 'X', label: 'Import X (From P)' },
  { from: 'C', to: 'X', label: 'Import X (From C)' },
  { from: 'X', to: 'P', label: 'Import P (From X)' },
  { from: 'C', to: 'P', label: 'Import P (From C)' },
  { from: 'X', to: 'C', label: 'Import C (from X)' },
  { from: 'P', to: 'C', label: 'Import C (from P)' },
] as const;

export const ChainImportCard = () => {
  const { t } = useTranslation();

  const handleChainImport = async (from: string, to: string) => {
    try {
      // TODO: Implement chain import logic
      console.log(`Importing from ${from} to ${to}`);
    } catch (error) {
      console.error('Error importing chain:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg p-6 border border-slate-700">
      <div className="flex flex-col gap-6">
        <Typography variant="h4">{t('wallet.advanced.chainImport.title')}</Typography>
        <Typography variant="body2" className="text-slate-400">
          {t('wallet.advanced.chainImport.description')}
        </Typography>
        <div className="flex flex-col gap-2">
          {CHAIN_IMPORTS.map(({ from, to, label }) => (
            <CamBtn
              key={`${from}-${to}`}
              variant="primary"
              onClick={() => handleChainImport(from, to)}
            >
              {label}
            </CamBtn>
          ))}
        </div>
      </div>
    </div>
  );
}; 