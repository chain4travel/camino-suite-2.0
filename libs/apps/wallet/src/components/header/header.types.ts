export interface UTXO {
  id: string;
  type: string;
  threshold: number;
  owners: string;
  balance: string;
}

export interface Chain {
  name: string;
  utxos: UTXO[];
}

