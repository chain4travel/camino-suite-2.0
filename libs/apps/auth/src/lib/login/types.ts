export interface SavedWallet {
  id: string;
  name: string;
  icon?: string;
}

export interface AccessMethod {
  id: string;
  icon: string;
  text: string;
  disabled?: boolean;
}

export enum ACCESS_METHOD_IDS {
  PRIVATE_KEY = 'PRIVATE_KEY',
  MNEMONIC = 'MNEMONIC',
  KEYSTORE = 'KEYSTORE',
  LEDGER = 'LEDGER'
}

export interface WalletLoginProps {
  handleAccessMethod: (method: AccessMethod) => void;
}
