export interface Asset extends Record<string, unknown> {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
} 

export interface mintedGroups extends Record<string, unknown> {
  id: number;
  name: string;
  image?: string;
  type: string;
}

export interface Collectible extends Record<string, unknown> {
  id: string;
  name: string;
  symbol: string;
  numberOfGroups: number;
  mintedGroups: mintedGroups[];
  txId: string;
}


