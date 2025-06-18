import { Activity } from './types';

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    date: new Date('2025-02-20T18:33:00'),
    type: 'validation',
  },
  {
    id: '2',
    date: new Date('2025-02-20T18:22:46'),
    type: 'validation',
    validationEndDate: new Date('2025-02-20T18:33:00'),
    rewardPending: '? CAM',
    addValidator: '2 000 CAM',
  },
  {
    id: '3',
    date: new Date('2025-02-20T18:22:22'),
    type: 'send',
    amount: '0.001 CAM',
  },
  {
    id: '4',
    date: new Date('2025-02-20T15:52:23'),
    type: 'send',
    amount: '0.001 CAM',
  },
  {
    id: '5',
    date: new Date('2025-02-20T15:51:57'),
    type: 'send',
    to: 'P-kopernikus10g9x...',
    amount: '-20 000.001 CAM',
  },
  {
    id: '6',
    date: new Date('2025-02-17T16:35:46'),
    type: 'export',
    chain: 'P',
    amount: '-10 000.002 CAM',
  },
  {
    id: '7',
    date: new Date('2025-02-17T16:34:44'),
    type: 'export',
    chain: 'P',
    amount: '-20 000.002 CAM',
  },
  {
    id: '8',
    date: new Date('2025-02-11T13:27:04'),
    type: 'receive',
    from: 'P-kopernikus1g6...',
    amount: '100 000 CAM',
  },
  {
    id: '9',
    date: new Date('2025-02-11T13:26:49'),
    type: 'receive',
    from: 'P-kopernikus1g6...',
    amount: '100 000 CAM',
  },
]; 