import { Typography, Input, Alert, CamBtn, Loader } from '@camino/ui';
import {
  mdiCheckCircle,
  mdiCloseCircle,
  mdiOpenInNew,
  mdiInformation,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ValidatorRegistration } from './ValidatorRegistration';
import { ValidatorConfirmation } from './ValidatorConfirmation';
import { ValidatorStatus } from './ValidatorStatus';

interface ValidatorRequirement {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'info';
  link?: string;
}

export const NodeTab = () => {
  const { t } = useTranslation();
  const [nodePrivateKey, setNodePrivateKey] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatorActive, setIsValidatorActive] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const VALIDATOR_REQUIREMENTS: ValidatorRequirement[] = [
    {
      id: 'kyc',
      title: t('wallet.validator.kyc_verification'),
      status: 'completed',
      link: 'https://docs.camino.network/guides/kyc/index.html',
    },
    {
      id: 'consortium',
      title: t('wallet.validator.consortium_description'),
      status: 'completed',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-curl/index.html#requirements',
    },
    {
      id: 'balance',
      title: t('wallet.validator.amount_description', { amount: '2 000' }),
      status: 'completed',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-curl/index.html#requirements',
    },
    {
      id: 'nodeId',
      title: t('wallet.validator.address_description'),
      status: 'info',
      link: 'https://docs.camino.network/validator-guides/add-validator-with-msig/index.html#4-register-your-node-with-your-multisig-wallet',
    },
  ];

  const allRequirementsCompleted = VALIDATOR_REQUIREMENTS.every(
    (req) => req.status === 'completed' || req.status === 'info'
  );

  const getStatusIcon = (status: 'pending' | 'completed' | 'info') => {
    switch (status) {
      case 'completed':
        return { path: mdiCheckCircle, className: 'text-green-500' };
      case 'info':
        return { path: mdiInformation, className: 'text-blue-500' };
      default:
        return { path: mdiCloseCircle, className: 'text-red-500' };
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsValidatorActive(true);
    }, 5000);
  };

  if (isValidatorActive) {
    return <ValidatorStatus />;
  }

  if (isSubmitting) {
    return (
      <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-6 rounded-lg p-6 border-t border-slate-700 min-h-[400px]">
        <Loader size="lg" />
        <Typography>{t('wallet.validator.waitingTransaction')}</Typography>
        <Typography variant="caption" className="text-slate-400">
          {t('wallet.validator.transactionCommitted')}
        </Typography>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <ValidatorConfirmation
        onCancel={() => setShowConfirmation(false)}
        onSubmit={handleSubmit}
        endDate={selectedEndDate!}
      />
    );
  }

  if (showRegistration) {
    return (
      <ValidatorRegistration
        onConfirm={(date) => {
          setSelectedEndDate(date);
          setShowConfirmation(true);
        }}
      />
    );
  }

  return (
    <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-4 rounded-lg p-6 border-t border-slate-700">
      <Typography variant="h6" className="!mb-6">
        {t('wallet.validator.setupRequirements')}
      </Typography>

      <div className="flex flex-col items-start justify-center gap-4">
        {VALIDATOR_REQUIREMENTS.map((requirement) => (
          <div key={requirement.id} className="flex items-center gap-3">
            <Icon
              path={getStatusIcon(requirement.status).path}
              size={0.8}
              className={getStatusIcon(requirement.status).className}
            />
            <a
              href={requirement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
            >
              <Typography variant="body2">{requirement.title}</Typography>
              <Icon path={mdiOpenInNew} size={1} />
            </a>
          </div>
        ))}
      </div>

      {allRequirementsCompleted && (
        <>
          <Input
            value="P-kopernikus1v8weslt4jr4n0m0jseupz9frk9rt83u6x9rsyj"
            disabled
            label={t('wallet.validator.nodeAddress')}
          />

          <Input
            value={nodePrivateKey}
            placeholder={t('wallet.validator.nodePrivateKeyPlaceholder')}
            onChange={(e) => setNodePrivateKey(e.target.value)}
            label={t('wallet.validator.nodePrivateKey')}
          />

          <Alert
            variant="warning"
            description={t('wallet.validator.registrationFeeDescription')}
          />

          <CamBtn
            variant="primary"
            className="mt-4 self-end"
            disabled={!nodePrivateKey}
            onClick={() => setShowRegistration(true)}
          >
            {t('wallet.validator.registerNode')}
          </CamBtn>
        </>
      )}
    </div>
  );
};
