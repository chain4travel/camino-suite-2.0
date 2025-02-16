export interface Asset extends Record<string, unknown> {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
} 