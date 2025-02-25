import { Typography, Input, Alert, CamBtn } from '@camino/ui';
import {
  mdiCheckCircle,
  mdiCloseCircle,
  mdiOpenInNew,
  mdiInformation,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DatePicker } from '@camino/ui';

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

  if (showConfirmation) {
    return (
      <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
        <Input
          value="NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
          label={t('wallet.validator.nodeId')}
          disabled
        />

        <Input
          value="2 000 CAM"
          label={t('wallet.validator.bondedAmount')}
          disabled
        />

        <div className="flex flex-col gap-2">
          <Typography variant="h6">
            {t('wallet.validator.validationPeriodStart')}
          </Typography>
          <Typography variant="body2" className="!text-slate-400 mb-2">
            {t('wallet.validator.validationStartDescription')}
          </Typography>
        </div>

        <Input
          value="2/20/2025, 6:28:00 PM"
          label={t('wallet.validator.validationPeriodEnd')}
          disabled
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col gap-2">
            <Typography variant="caption" className="!text-slate-400 block">
              {t('wallet.validator.duration')}
            </Typography>
            <Typography variant="h6">0 days 0 hours 5 minutes</Typography>
          </div>

          <div className="flex gap-2">
            <CamBtn
              variant="secondary"
              onClick={() => setShowRegistration(false)}
            >
              {t('common.cancel')}
            </CamBtn>
            <CamBtn variant="primary" onClick={() => setShowConfirmation(true)}>
              {t('common.submit')}
            </CamBtn>
          </div>
        </div>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <div className="bg-gray-200/50 dark:bg-slate-800/50 flex flex-col gap-6 rounded-lg p-6 border-t border-slate-700">
        <Input
          value="NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ"
          label={t('wallet.validator.nodeId')}
          disabled
        />

        <DatePicker
          label={t('wallet.validator.validationEndDate')}
          description={t('wallet.validator.bondingDescription')}
          maxEndDate={new Date('2025-02-20T18:28:00')}
          showMaxOption
          onChange={(date) => {
            // Handle date change
            console.log(date);
          }}
          placeholder={t('wallet.validator.maxDate')}
        />

        <div>
          <Typography variant="h6" className="mb-4">
            {t('wallet.validator.bondedAmount')}
          </Typography>
          <Typography variant="caption" className="!text-slate-400 mb-2 block">
            {t('wallet.validator.bondedAmountDescription', { amount: '2 000' })}
          </Typography>

          <div className="flex gap-2">
            <Input value="2000" disabled placeholder="MAX" className="flex-1" />
            <div className="rounded-lg px-4 py-2 flex items-center">
              <Typography>CAM</Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <Typography variant="caption" className="!text-slate-400 block">
              {t('wallet.validator.duration')}
            </Typography>
            <Typography variant="h6">0 days 0 hours 5 minutes</Typography>
          </div>

          <CamBtn variant="primary" onClick={() => setShowConfirmation(true)}>
            {t('wallet.validator.confirm')}
          </CamBtn>
        </div>
      </div>
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
