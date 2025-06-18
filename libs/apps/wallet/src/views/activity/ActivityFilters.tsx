import { Tabs } from '@camino/ui';
import { ActivityFiltersProps, ActivityType } from './types';

const ACTIVITY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'export_import', label: 'Export & Import' },
  { id: 'validation', label: 'Validation' },
];

export const ActivityFilters = ({
  selectedType,
  onTypeChange,
}: ActivityFiltersProps) => {
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
