'use client';
import { useState } from 'react';
import { CamBtn, Typography, Container } from '@camino/ui';
import { useTranslation } from 'react-i18next';
import { ActivityFilters } from './ActivityFilters';
import { ActivityList } from './ActivityList';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight, mdiRefresh } from '@mdi/js';
import { ExportRewardsModal } from '../../components/activity/modals/ExportRewardsModal';
import { ExportTransfersModal } from '../../components/activity/modals/ExportTransfersModal';
import { ActivityType } from './types';



export const ActivityView = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<ActivityType>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExportRewardsOpen, setIsExportRewardsOpen] = useState(false);
  const [isExportTransfersOpen, setIsExportTransfersOpen] = useState(false);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const isCurrentMonth = isSameMonth(currentMonth, new Date());

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <Typography variant="h2" className="font-light">
            {t('wallet.exportCsv')}
          </Typography>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2">
            <CamBtn 
              variant="primary" 
              className="w-full sm:w-auto"
              onClick={() => setIsExportRewardsOpen(true)}
            >
              {t('wallet.exportRewards')}
            </CamBtn>
            <CamBtn 
              variant="primary" 
              className="w-full sm:w-auto"
              onClick={() => setIsExportTransfersOpen(true)}
            >
              {t('wallet.exportTransfers')}
            </CamBtn>
          </div>
        </div>

        <ActivityFilters
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Typography variant="h4">
              {format(currentMonth, 'MMMM yyyy')}
            </Typography>
            <div className="flex gap-2">
              <CamBtn variant="secondary" className="!p-1" onClick={handlePreviousMonth}>
                <Icon path={mdiChevronLeft} size={1} />
              </CamBtn>
              <CamBtn variant="secondary" className="!p-1" onClick={handleNextMonth} disabled={isCurrentMonth}>
                <Icon path={mdiChevronRight} size={1} />
              </CamBtn>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Typography variant="body2" className="!text-slate-400">
              {t('wallet.transactionsFound', { count: 21 })}
            </Typography>
            <Icon
              path={mdiRefresh}
              size={1}
              className="cursor-pointer text-slate-900 dark:text-slate-100 hover:text-slate-800 dark:hover:text-slate-200"
            />
          </div>
        </div>

        <div className="flex p-4 bg-gray-200/50 dark:bg-slate-800/50 flex-col items-start justify-start gap-6 rounded-lg border-t border-slate-700 min-h-[400px]">
          <ActivityList type={selectedType} currentMonth={currentMonth} />
        </div>
      </div>

      <ExportRewardsModal 
        isOpen={isExportRewardsOpen}
        onClose={() => setIsExportRewardsOpen(false)}
      />
      
      <ExportTransfersModal
        isOpen={isExportTransfersOpen}
        onClose={() => setIsExportTransfersOpen(false)}
      />
    </Container>
  );
};

export default ActivityView;
