import { UTXO } from '@c4tplatform/caminojs/dist/apis/avm';
import AvaAsset from '../js/AvaAsset';
import { AvaNftFamily } from '../js/AvaNftFamily';
import { IWalletBalanceDict, PlatformBalances } from './wallet.types';
import { UTXO as AVMUTXO } from '@c4tplatform/caminojs/dist/apis/avm/utxos';
import Erc20Token from '../js/Erc20Token';

export interface AssetsState {
  balanceLoading: boolean;
  assets: AvaAsset[];
  assetsDict: AssetsDict;
  platformBalances: PlatformBalances;
  AVA_ASSET_ID: string;
  nftFams: AvaNftFamily[];
  nftFamsDict: NftFamilyDict;
  balanceDict: IWalletBalanceDict;
  nftUTXOs: AVMUTXO[];
  nftMintUTXOs: AVMUTXO[];
  erc20Tokens: Erc20Token[];
  erc20TokensCustom: Erc20Token[];
  evmChainId: number;
  tokenLists: TokenList[];
  tokenListUrls: string[];
  tokenListsCustom: string[];
  nftWhitelist: string[];
}

export interface AssetDescriptions {
  [key: string]: AssetDescription;
}

export interface AssetDescription {
  name: string;
  symbol: string;
  denomination: number;
}

export interface NftFamilyDict {
  [id: string]: AvaNftFamily;
}

export interface AssetsDict {
  [key: string]: AvaAsset;
}

export interface AddressUtxoDict {
  [key: string]: [UTXO];
}

export interface AssetAPI {
  id: string;
  chainID: string;
  name: string;
  symbol: string;
  alias: string;
  denomination: number;
  currentSupply: string;
  timestamp: string;
}

export interface TokenListToken {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number | string;
  logoURI: string;
}

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  url: string; // added by frontend
  readonly: boolean; // added by frontend
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens: TokenListToken[];
}

export interface AddTokenListInput {
  url: string;
  readonly: boolean;
}

// Asset balance and management types
export interface AssetBalance {
  available: string;
  locked: string;
  total: string;
}

export interface AssetBalanceDict {
  [assetId: string]: AssetBalance;
}

// NFT related types
export interface NftGroup {
  groupId: number;
  utxos: AVMUTXO[];
}

export interface NftCollection {
  [groupId: number]: NftGroup;
}

export interface NftCollectionDict {
  [assetId: string]: NftCollection;
}

// ERC20 specific types
export interface ERC20Balance {
  balance: string;
  balanceFormatted: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface ERC20BalanceDict {
  [contractAddress: string]: ERC20Balance;
}

// Platform staking types
export interface StakingInfo {
  staked: string;
  locked: string;
  unlocked: string;
  rewards: string;
}

// Asset portfolio types
export interface AssetPortfolio {
  totalValue: string;
  assets: {
    native: AssetBalance;
    erc20: ERC20BalanceDict;
    nfts: NftCollectionDict;
  };
  breakdown: {
    [assetId: string]: {
      percentage: number;
      value: string;
    };
  };
}

// Asset search and filter types
export interface AssetFilter {
  search?: string;
  type?: 'all' | 'native' | 'erc20' | 'nft';
  minBalance?: string;
  hideZeroBalance?: boolean;
}

export interface AssetSortOptions {
  field: 'name' | 'symbol' | 'balance' | 'value';
  direction: 'asc' | 'desc';
}

// Asset transaction history types
export interface AssetTransaction {
  txId: string;
  assetId: string;
  type: 'send' | 'receive' | 'mint' | 'burn';
  amount: string;
  timestamp: number;
  from: string;
  to: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface AssetTransactionHistory {
  [assetId: string]: AssetTransaction[];
}

// Asset metadata types
export interface AssetMetadata {
  id: string;
  name: string;
  symbol: string;
  denomination: number;
  description?: string;
  logoURI?: string;
  website?: string;
  explorer?: string;
  coingeckoId?: string;
  tags?: string[];
}

// Asset price information
export interface AssetPrice {
  usd: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  lastUpdated: number;
}

export interface AssetPriceDict {
  [assetId: string]: AssetPrice;
}

// Error types for asset operations
export interface AssetError {
  code: string;
  message: string;
  assetId?: string;
  details?: any;
}

// Asset loading states
export interface AssetLoadingStates {
  balances: boolean;
  metadata: boolean;
  prices: boolean;
  transactions: boolean;
  utxos: boolean;
}

// Asset validation types
export interface AssetValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Export commonly used union types
export type AssetType = 'native' | 'erc20' | 'nft';
export type AssetStatus = 'active' | 'inactive' | 'deprecated';
export type BalanceType = 'available' | 'locked' | 'staked' | 'pending';
