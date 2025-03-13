export interface Activity {
  id: string;
  date: Date;
  type: 'validation' | 'send' | 'receive' | 'export';
  validationEndDate?: Date;
  rewardPending?: string;
  addValidator?: string;
  amount?: string;
  from?: string;
  to?: string;
  chain?: 'P';
}

export type ActivityType = 'all' | 'transfer' | 'export_import' | 'validation';

export interface ActivityListProps {
  type: ActivityType;
  currentMonth: Date;
}

export interface ActivityFiltersProps {
  selectedType: ActivityType;
  onTypeChange: (type: ActivityType) => void;
}

export interface SendInfoProps {
  amount?: string;
  to?: string;
  from?: string;
  type: 'send' | 'receive';
}

export interface ExportInfoProps {
  amount?: string;
  chain?: string;
}

export interface ValidationInfoProps {
  endDate?: Date;
  rewardPending?: string;
  addValidator?: string;
}
