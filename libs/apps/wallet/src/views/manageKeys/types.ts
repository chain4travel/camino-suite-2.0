export interface Key {
  id: string;
  name: string;
  address: string;
  type: 'singleton' | 'multisig';
} 