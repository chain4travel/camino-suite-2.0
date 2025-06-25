import { Buffer, BN } from '@c4tplatform/caminojs/dist';
import Big from 'big.js';
import { UTXO } from '@c4tplatform/caminojs/dist/apis/avm';
import { UTXO as TxUTXO } from '../types/history.types';
import {
  WalletType,
  HotWalletType,
  INetwork,
  WalletNameType,
} from '../js/wallets/types';
import {
  AllKeyFileTypes,
  AllKeyFileDecryptedTypes,
  KeystoreFileKeyType,
} from '../js/IKeystore';
import { ChainIdType } from '../js/constants';

import AvaAsset from '../js/AvaAsset';

export interface ITransaction {
  uuid: string;
  asset: AvaAsset;
  amount: BN;
}

export type INftTransaction = object;

export interface ICurrencyInputDropdownValue {
  asset: AvaAsset | null;
  amount: BN;
}

export interface BulkOrder {
  address: string;
  amount: BN;
}

// Re-export commonly used interfaces for the wallet store
export interface IWalletNftDict {
  [assetId: string]: UTXO[];
}

export interface ITxNftDict {
  [assetId: string]: TxUTXO[];
}

export interface IWalletBalanceDict {
  [assetId: string]: {
    available: BN;
    locked: BN;
  };
}

export interface IBalanceDict {
  [assetId: string]: BN;
}

export interface IWalletBalanceItem {
  id: string;
  amount: BN;
}

export interface IWalletAssetsDict {
  [assetId: string]: AvaAsset;
}

export interface IWalletNftMintDict {
  [assetId: string]: UTXO[];
}

export interface AssetType {
  name: string;
  symbol: string;
  balance: number;
  denomination: number;
}

export interface priceDict {
  usd: number;
}

// Wallet-specific transaction interfaces
export interface IssueBatchTxInput {
  chainId: ChainIdType;
  toAddress: string;
  memo?: Buffer;
  orders: (ITransaction | UTXO)[];
}

export interface BatchTxOrder {
  uuid: string;
  asset: AssetType;
  amount: Big;
}

export interface IssueTxInput {
  asset: AvaAsset;
  assetId: string;
  amount: BN;
  toAddress: string;
  changeAddresses: string[];
}

// Import/Export interfaces
export interface ImportKeyfileInput {
  password: string;
  data: AllKeyFileTypes;
}

export interface ExportWalletsInput {
  password: string;
  wallets: HotWalletType[];
}

// Session management interfaces
export type SessionPersistFile = SessionPersistKey[];

export interface SessionPersistKey {
  key: string;
}

// Access wallet interfaces
export interface AccessWalletMultipleInput {
  name: string;
  type: Extract<KeystoreFileKeyType, WalletNameType>;
  key: string;
}

export interface AccessWalletMultipleInputParams {
  keys: AccessWalletMultipleInput[];
  activeIndex: number;
}

// Account management interfaces
export interface SaveAccountInput {
  password: string;
  accountName: string;
}

export interface AccessAccountInput {
  index: number;
  pass: string;
}

export interface iUserAccountEncrypted {
  name: string;
  baseAddresses: string[];
  wallet: AllKeyFileTypes;
  defaultAddress?: string;
}

export interface iUserAccountDecrypted {
  name: string;
  baseAddresses: string[];
  wallet: AllKeyFileDecryptedTypes;
}

// Platform balance interfaces
export interface PlatformBalances {
  balances: IBalanceDict;
  unlocked: IBalanceDict;
  locked: IBalanceDict;
  lockedStakeable: IBalanceDict;
  bonded: IBalanceDict;
  deposited: IBalanceDict;
  bondedDeposited: IBalanceDict;
}

// Ledger configuration interface
export interface ILedgerAppConfig {
  version: string;
  commit: string;
  name: 'Avalanche';
}

// Update transaction options interface
export interface UpdateTransactionOptions {
  fullHistory?: boolean;
  onlyMultisig?: boolean;
  withMultisig?: boolean;
  withDeposit?: boolean;
  msgType?: 'success' | 'error' | 'warning';
  msgTitle?: string;
  msgText?: string;
}

// Wallet store specific types
export type WalletStoreState = {
  isAuth: boolean;
  activeWallet: WalletType | null;
  storedActiveWallet: WalletType | null;
  address: string | null;
  wallets: WalletType[];
  volatileWallets: WalletType[];
  warnUpdateKeyfile: boolean;
  walletsDeleted: boolean;
  prices: priceDict;
  network: { name: string };
};

// For type safety when working with wallet instances
export type SerializableWalletData = {
  id?: string;
  name?: string;
  type: string;
  // Add other serializable properties as needed
};

// Chain alias type for static address queries
export type ChainAlias = 'X' | 'P' | 'C';

// Error types for wallet operations
export interface WalletError {
  code: string;
  message: string;
  details?: any;
}

// Notification types for wallet operations
export interface WalletNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
