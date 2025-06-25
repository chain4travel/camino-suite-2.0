/*
The base wallet class used for common functionality
*/
import { ava, bintools } from '../AVA';
import { web3 } from '../web3';
import {
  ChainIdType,
  CrossChainsC,
  CrossChainsX,
  CrossChainsP,
} from '../constants';
import { chainIdFromAlias } from '../../helpers/helper';
import { avmGetAllUTXOs, platformGetAllUTXOs } from '../../helpers/utxo_helper';
import { estimateExportGasFee } from '../../helpers/gas_helper';

import { BN, Buffer as AvalancheBuffer } from '@c4tplatform/caminojs/dist';
import {
  Tx as EVMTx,
  UnsignedTx as EVMUnsignedTx,
  UTXOSet as EVMUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/evm';
import {
  ExportTx as PlatformExportTx,
  Tx as PlatformTx,
  UnsignedTx as PlatformUnsignedTx,
  UTXOSet as PlatformUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/platformvm';
import {
  Tx as AVMTx,
  UnsignedTx as AVMUnsignedTx,
  UTXOSet as AVMUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/avm';
import { SECP256k1KeyPair } from '@c4tplatform/caminojs/dist/common';
import { WalletNameType } from './types';

import uniqid from 'uniqid';

abstract class WalletCore {
  id: string;
  name: string = '';
  type?: WalletNameType;
  accountHash?: Buffer;

  utxoset: AVMUTXOSet;
  platformUtxoset: PlatformUTXOSet;
  stakeAmount: BN;

  isFetchUtxos: boolean;
  isInit: boolean;

  abstract getEvmAddressBech(): string;
  abstract getEvmAddress(): string;
  abstract getCurrentAddressAvm(): string;
  abstract getChangeAddressAvm(): string;
  abstract getCurrentAddressPlatform(): string;
  abstract getAllAddressesP(): string[];
  abstract getAllAddressesX(): string[];
  abstract getStaticKeyPair(): SECP256k1KeyPair | undefined;

  abstract signC(unsignedTx: EVMUnsignedTx): Promise<EVMTx>;
  abstract signX(unsignedTx: AVMUnsignedTx): Promise<AVMTx>;
  abstract signP(
    unsignedTx: PlatformUnsignedTx,
    additionalSigners?: string[]
  ): Promise<PlatformTx>;

  abstract signMessage(msg: string, address?: string): Promise<string>;
  abstract getPlatformUTXOSet(): PlatformUTXOSet;

  protected constructor() {
    this.id = uniqid();
    this.utxoset = new AVMUTXOSet();
    this.platformUtxoset = new PlatformUTXOSet();
    this.stakeAmount = new BN(0);

    this.isInit = false;
    this.isFetchUtxos = false;
  }

  getUTXOSet(): AVMUTXOSet {
    return this.utxoset;
  }

  prepareSignP(tx: PlatformUnsignedTx): void {}

  getStaticAddress(chainID: ChainIdType): string {
    const kp = this.getStaticKeyPair();
    if (kp) {
      return bintools.addressToString(ava.getHRP(), chainID, kp.getAddress());
    }
    return '';
  }

  getSignerAddresses(chainID: ChainIdType): string[] {
    return [];
  }

  onNetworkChange(): void {}
  async initialize() {}

  async evmGetAtomicUTXOs(sourceChain: CrossChainsC): Promise<EVMUTXOSet> {
    let addrs = [this.getEvmAddressBech()];
    return (await ava.CChain().getUTXOs(addrs, chainIdFromAlias(sourceChain)))
      .utxos;
  }

  async createImportTxC(
    sourceChain: CrossChainsC,
    utxoSet: EVMUTXOSet,
    fee: BN
  ) {
    let bechAddr = this.getEvmAddressBech();
    let hexAddr = this.getEvmAddress();

    let toAddress = '0x' + hexAddr;
    let ownerAddresses = [bechAddr];
    const sourceChainId = chainIdFromAlias(sourceChain);

    return await ava
      .CChain()
      .buildImportTx(utxoSet, toAddress, ownerAddresses, sourceChainId, fee);
  }

  /**
   *
   * @param sourceChain
   * @param fee Fee to use in nNative
   * @param utxoSet
   */
  async importToCChain(
    sourceChain: CrossChainsC,
    fee: BN,
    utxoSet?: EVMUTXOSet,
    exportTxID?: string
  ) {
    if (!utxoSet) {
      utxoSet = await this.evmGetAtomicUTXOs(sourceChain);
    }

    // TODO: Only use native Asset utxos
    // TODO?: If the import fee for a utxo is greater than the value of the utxo, ignore it

    if (utxoSet.getAllUTXOs().length === 0) {
      throw new Error('Nothing to import.');
    }

    if (exportTxID) {
      const etxBuffer = bintools.cb58Decode(exportTxID);
      utxoSet = utxoSet.filter(
        [etxBuffer],
        (utxo, b: AvalancheBuffer) => utxo.getTxID().compare(b) === 0
      );
    }

    const unsignedTxFee = await this.createImportTxC(sourceChain, utxoSet, fee);
    let tx = await this.signC(unsignedTxFee);
    let id = await ava.CChain().issueTx(tx);

    return id;
  }

  async exportFromXChain(
    amt: BN,
    destinationChain: CrossChainsX,
    importFee?: BN
  ) {
    if (destinationChain === 'C' && !importFee)
      throw new Error('Exports to C chain must specify an import fee.');

    let amtFee = amt.clone();

    // Get destination address
    let destinationAddr =
      destinationChain === 'P'
        ? this.getCurrentAddressPlatform()
        : this.getEvmAddressBech();

    // Add import fee to transaction
    if (importFee) {
      amtFee = amt.add(importFee);
    } else if (destinationChain === 'P') {
      let fee = ava.PChain().getTxFee();
      amtFee = amt.add(fee);
    }

    let fromAddresses = this.getAllAddressesX();
    let changeAddress = this.getChangeAddressAvm();
    let utxos = this.getUTXOSet();
    let exportTx = await ava
      .XChain()
      .buildExportTx(
        utxos,
        amtFee,
        chainIdFromAlias(destinationChain),
        [destinationAddr],
        fromAddresses,
        [changeAddress]
      );
    const eTx = exportTx.getTransaction() as unknown as PlatformExportTx;
    let tx = await this.signX(exportTx);

    return ava.XChain().issueTx(tx);
  }

  async exportFromPChain(
    amt: BN,
    destinationChain: CrossChainsP,
    importFee?: BN
  ) {
    let utxoSet = this.getPlatformUTXOSet();

    let fromAddrs = this.getAllAddressesP();
    const signerAddrs = this.getSignerAddresses('P');

    let pChangeAddr = this.getCurrentAddressPlatform();

    if (destinationChain === 'C' && !importFee)
      throw new Error('Exports to C chain must specify an import fee.');

    // Calculate C chain import fee
    let amtFee = amt.clone();
    if (importFee) {
      amtFee = amt.add(importFee);
    } else if (destinationChain === 'X') {
      // We can add the import fee for X chain
      let fee = ava.XChain().getTxFee();
      amtFee = amt.add(fee);
    }

    // Get the destination address for the right chain
    let destinationAddr =
      destinationChain === 'C'
        ? this.getEvmAddressBech()
        : this.getCurrentAddressAvm();

    const exportTx = await ava
      .PChain()
      .buildExportTx(
        utxoSet,
        amtFee,
        chainIdFromAlias(destinationChain),
        [destinationAddr],
        [fromAddrs, signerAddrs],
        [pChangeAddr]
      );
    let tx = await this.signP(exportTx);
    return await ava.PChain().issueTx(tx);
  }

  /**
   *
   * @param amt The amount to receive on the destination chain, in nNative.
   * @param destinationChain `X` or `P`
   * @param fee Fee to use in the export transaction, given in nNative.
   */
  async exportFromCChain(
    amt: BN,
    destinationChain: CrossChainsC,
    exportFee: BN
  ) {
    // Add import fee
    // X and P have the same fee
    let importFee = ava.XChain().getTxFee();
    let amtFee = amt.add(importFee);

    let hexAddr = this.getEvmAddress();
    let bechAddr = this.getEvmAddressBech();

    let destinationAddr =
      destinationChain === 'X'
        ? this.getCurrentAddressAvm()
        : this.getCurrentAddressPlatform();

    const nonce = await web3.eth.getTransactionCount(hexAddr);

    const exportTx = await ava
      .CChain()
      .buildExportTx(
        amtFee,
        ava.getNetwork().X.avaxAssetID,
        chainIdFromAlias(destinationChain),
        hexAddr,
        bechAddr,
        [destinationAddr],
        nonce,
        undefined,
        1,
        exportFee
      );
    let tx = await this.signC(exportTx);
    return ava.CChain().issueTx(tx);
  }

  /**
   * Returns the estimated gas to export from C chain.
   * @param destinationChain
   * @param amount
   */
  async estimateExportFee(
    destinationChain: CrossChainsC,
    amount: BN
  ): Promise<number> {
    let hexAddr = this.getEvmAddress();
    let bechAddr = this.getEvmAddressBech();

    let destinationAddr =
      destinationChain === 'X'
        ? this.getCurrentAddressAvm()
        : this.getCurrentAddressPlatform();

    return estimateExportGasFee(
      destinationChain,
      hexAddr,
      bechAddr,
      destinationAddr,
      amount
    );
  }

  async avmGetAtomicUTXOs(sourceChain: CrossChainsX) {
    let addrs = this.getAllAddressesX();
    return avmGetAllUTXOs(addrs, chainIdFromAlias(sourceChain));
  }

  async platformGetAtomicUTXOs(sourceChain: CrossChainsP) {
    let addrs = this.getAllAddressesP();
    return platformGetAllUTXOs(addrs, chainIdFromAlias(sourceChain));
  }

  async importToPlatformChain(sourceChain: CrossChainsP): Promise<string> {
    const utxoSet = await this.platformGetAtomicUTXOs(sourceChain);

    if (utxoSet.getAllUTXOs().length === 0) {
      throw new Error('Nothing to import.');
    }

    const sourceChainId = chainIdFromAlias(sourceChain);
    // Owner addresses, the addresses we exported to
    let pToAddr = this.getCurrentAddressPlatform();

    let hrp = ava.getHRP();
    let utxoAddrs = utxoSet
      .getAddresses()
      .map((addr) => bintools.addressToString(hrp, 'P', addr));

    let fromAddrs = utxoAddrs;
    let ownerAddrs = utxoAddrs;

    const unsignedTx = await ava
      .PChain()
      .buildImportTx(
        utxoSet,
        ownerAddrs,
        sourceChainId,
        [pToAddr],
        [pToAddr],
        [pToAddr],
        undefined,
        undefined
      );
    const tx = await this.signP(unsignedTx);
    // Pass in string because AJS fails to verify Tx type
    return ava.PChain().issueTx(tx);
  }

  async importToXChain(sourceChain: CrossChainsX) {
    const utxoSet = await this.avmGetAtomicUTXOs(sourceChain);

    if (utxoSet.getAllUTXOs().length === 0) {
      throw new Error('Nothing to import.');
    }

    let xToAddr = this.getCurrentAddressAvm();

    let hrp = ava.getHRP();
    let utxoAddrs = utxoSet
      .getAddresses()
      .map((addr) => bintools.addressToString(hrp, 'X', addr));

    let fromAddrs = utxoAddrs;
    let ownerAddrs = utxoAddrs;

    let sourceChainId = chainIdFromAlias(sourceChain);

    // Owner addresses, the addresses we exported to
    const unsignedTx = await ava
      .XChain()
      .buildImportTx(utxoSet, ownerAddrs, sourceChainId, [xToAddr], fromAddrs, [
        xToAddr,
      ]);

    const tx = await this.signX(unsignedTx);
    return await ava.XChain().issueTx(tx);
  }
}

export { WalletCore };
