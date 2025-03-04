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