export type ChainType = 'X Chain' | 'P Chain' | 'C Chain';

export interface Chain {
  id: ChainType;
  name: string;
  balance: string;
} 