import HDKey from 'hdkey';
import {
  KeyChain as AVMKeyChain,
  KeyPair as AVMKeyPair,
  UTXOSet,
  UTXO as AVMUTXO,
  Tx as AVMTx,
  UnsignedTx as AVMUnsignedTx,
} from '@c4tplatform/caminojs/dist/apis/avm';

import {
  UTXOSet as PlatformUTXOSet,
  UnsignedTx as PlatformUnsignedTx,
  UTXO as PlatformUTXO,
  Tx as PlatformTx,
} from '@c4tplatform/caminojs/dist/apis/platformvm';
import {
  KeyChain as EVMKeyChain,
  UnsignedTx as EVMUnsignedTx,
  Tx as EVMTx,
} from '@c4tplatform/caminojs/dist/apis/evm';

import { ITransaction } from '../../types/wallet.types';
import { BN, Buffer } from '@c4tplatform/caminojs/dist';
import { PayloadBase } from '@c4tplatform/caminojs/dist/utils';
import Erc20Token from '../Erc20Token';

import { Transaction } from '@ethereumjs/tx';
import MnemonicWallet from './MnemonicWallet';
import { LedgerWallet } from './LedgerWallet';
import { SingletonWallet } from './SingletonWallet';
import { MultisigWallet } from './MultisigWallet';
import { UTXOSet as EVMUTXOSet } from '@c4tplatform/caminojs/dist/apis/evm/utxos';
import {
  ChainIdType,
  CrossChainsC,
  CrossChainsP,
  CrossChainsX,
} from '../constants';

export interface IIndexKeyCache {
  [index: number]: AVMKeyPair;
}

export interface INetwork {
  name: string;
}

export type ChainAlias = 'X' | 'P';
export type AvmImportChainType = 'P' | 'C';
export type AvmExportChainType = 'P' | 'C';

export type WalletNameType = 'mnemonic' | 'ledger' | 'singleton' | 'multisig';
export type HotWalletType = MnemonicWallet | SingletonWallet | MultisigWallet;
export type WalletType =
  | MnemonicWallet
  | LedgerWallet
  | SingletonWallet
  | MultisigWallet;

interface IAddressManager {
  getCurrentAddressAvm(): string;
  getCurrentAddressPlatform(): string;
  getChangeAddressAvm(): string;
  getChangeAddressPlatform(): string;
  getDerivedAddresses(): string[];
  getDerivedAddressesP(): string[];
  getAllDerivedExternalAddresses(): string[];
  getAllAddressesX(): string[]; // returns all addresses this wallet own on the X chain
  getAllAddressesP(): string[]; // returns all addresses this wallet own on the P chain
  getHistoryAddresses(): string[];
  getPlatformRewardAddress(): string;
  getBaseAddress(): string;
  getEvmAddress(): string;
  getEvmAddressBech(): string;
  getFirstAvailableAddressPlatform(): string;
}

// Every AVA Wallet must implement this.
export interface AvaWalletCore extends IAddressManager {
  id: string; // a random string assigned as ID to distinguish between wallets
  type: WalletNameType;
  chainId: string;
  utxoset: UTXOSet;
  platformUtxoset: PlatformUTXOSet;
  stakeAmount: BN;
  ethAddress: string;
  ethBalance: BN;
  isFetchUtxos: boolean; // true if fetching utxos
  isInit: boolean; // True once the wallet can be used (ex. when HD index is found)
  onNetworkChange(network: INetwork): void;
  getUTXOs(): Promise<void>;
  getUTXOSet(): UTXOSet;
  getStake(): Promise<BN>;
  getPlatformUTXOSet(): PlatformUTXOSet;
  createNftFamily(
    name: string,
    symbol: string,
    groupNum: number
  ): Promise<string>;
  mintNft(
    mintUtxo: AVMUTXO,
    payload: PayloadBase,
    quantity: number,
    owners: string[]
  ): Promise<string>;
  getEthBalance(): Promise<BN>;
  sendEth(
    to: string,
    amount: BN,
    gasPrice: BN,
    gasLimit: number
  ): Promise<string>;
  sendERC20(
    to: string,
    amount: BN,
    gasPrice: BN,
    gasLimit: number,
    token: Erc20Token
  ): Promise<string>;
  estimateGas(to: string, amount: BN, token: Erc20Token): Promise<number>;

  signX(unsignedTx: AVMUnsignedTx): Promise<AVMTx>;
  signP(
    unsignedTx: PlatformUnsignedTx,
    additionalSigners?: string[]
  ): Promise<PlatformTx>;
  signC(unsignedTx: EVMUnsignedTx): Promise<EVMTx>;
  signEvm(tx: Transaction): Promise<Transaction>;
  validate(
    nodeID: string,
    amt: BN,
    start: Date,
    end: Date,
    delegationFee: number,
    rewardAddress?: string,
    utxos?: PlatformUTXO[]
  ): Promise<string>;
  delegate(
    nodeID: string,
    amt: BN,
    start: Date,
    end: Date,
    rewardAddress?: string,
    utxos?: PlatformUTXO[]
  ): Promise<string>;
  exportFromXChain(amt: BN, destinationChain: CrossChainsX): Promise<string>;
  exportFromPChain(amt: BN, destinationChain: CrossChainsP): Promise<string>;
  exportFromCChain(
    amt: BN,
    destinationChain: CrossChainsC,
    baseFee: BN
  ): Promise<string>;

  importToPlatformChain(sourceChain: CrossChainsP): Promise<string>;
  importToXChain(sourceChain: CrossChainsX): Promise<string>;
  importToCChain(
    sourceChain: CrossChainsC,
    baseFee: BN,
    utxoSet?: EVMUTXOSet
  ): Promise<string>;
  issueBatchTx(
    chainId: ChainIdType,
    orders: (AVMUTXO | ITransaction)[],
    addr: string,
    memo?: Buffer
  ): Promise<string>;
  signMessage(msg: string, address: string): Promise<string>;
}

// Wallets which have the private key in memory
export interface UnsafeWallet {
  ethKey: string;
  ethKeyChain: EVMKeyChain;
}

export interface IAvaHdWallet extends AvaWalletCore, UnsafeWallet {
  seed: string;
  hdKey: HDKey;
  getMnemonic(): string;
  getCurrentKey(): AVMKeyPair;
  getKeyChain(): AVMKeyChain;
}
