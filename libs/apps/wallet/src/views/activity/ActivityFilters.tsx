import { Tabs } from '@camino/ui';
import { useTranslation } from 'react-i18next';

type ActivityType = 'all' | 'transfer' | 'export_import' | 'validation';

interface ActivityFiltersProps {
  selectedType: ActivityType;
  onTypeChange: (type: ActivityType) => void;
}

const ACTIVITY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'export_import', label: 'Export & Import' },
  { id: 'validation', label: 'Validation' },
] as const;

export const ActivityFilters = ({
  selectedType,
  onTypeChange,
}: ActivityFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-wrap items-center justify-between">
      <Tabs
        tabs={ACTIVITY_TABS}
        activeTab={selectedType}
        onChange={(tab) => onTypeChange(tab as ActivityType)}
        className="border-b-0"
      />
    </div>
  );
}; 