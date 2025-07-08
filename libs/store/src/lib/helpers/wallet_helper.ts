import { ava, bintools } from '../js/AVA';
import { ChainIdType, ZeroBN } from '../js/constants';
import { web3 } from '../js/web3';
import { BulkOrder, ITransaction } from '../types/wallet.types';
import { getStakeForAddresses } from './utxo_helper';
import Erc20Token from '../js/Erc20Token';
import ERCNftToken from '../js/ERCNftToken';
import AvaAsset from '../js/AvaAsset';
import {
  buildBulkTransfer,
  buildCreateNftFamilyTx,
  buildEvmTransferErc20Tx,
  buildEvmTransferERCNftTx,
  buildEvmTransferNativeTx,
  buildMintNftTx,
} from '../js/TxHelper';
import { WalletType } from '../js/wallets/types';

import { BN, Buffer } from '@c4tplatform/caminojs/dist';
import {
  ClaimAmountParams,
  ClaimType,
  DepositOffer,
  UTXO as PlatformUTXO,
  UTXOSet as PlatformUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/platformvm';
import { UTXO as AVMUTXO } from '@c4tplatform/caminojs/dist/apis/avm/utxos';
import { PayloadBase } from '@c4tplatform/caminojs/dist/utils';
import { OutputOwners } from '@c4tplatform/caminojs/dist/common';

class WalletHelper {
  static async getStake(wallet: WalletType): Promise<BN> {
    let addrs = wallet.getAllAddressesP();
    return await getStakeForAddresses(addrs);
  }

  static async createNftFamily(
    wallet: WalletType,
    name: string,
    symbol: string,
    groupNum: number
  ) {
    const fromAddresses = wallet.getAllAddressesX();
    const changeAddress = wallet.getChangeAddressAvm();
    const minterAddress = wallet.getCurrentAddressAvm();

    const utxoSet = wallet.utxoset;

    const unsignedTx = await buildCreateNftFamilyTx(
      name,
      symbol,
      groupNum,
      fromAddresses,
      minterAddress,
      changeAddress,
      utxoSet
    );

    let signed = await wallet.signX(unsignedTx);
    return await ava.XChain().issueTx(signed);
  }

  static async mintNft(
    wallet: WalletType,
    mintUtxo: AVMUTXO,
    payload: PayloadBase,
    quantity: number,
    owners: string[]
  ) {
    let ownerAddress = wallet.getCurrentAddressAvm();
    for (let i = owners.length; i < quantity; ++i) {
      owners.push(ownerAddress);
    }
    let changeAddress = wallet.getChangeAddressAvm();
    let sourceAddresses = wallet.getAllAddressesX();

    let utxoSet = wallet.utxoset;
    let tx = await buildMintNftTx(
      mintUtxo,
      payload,
      owners,
      changeAddress,
      sourceAddresses,
      utxoSet
    );
    let signed = await wallet.signX(tx);
    return await ava.XChain().issueTx(signed);
  }

  static async issueBatchTx(
    wallet: WalletType,
    chainId: ChainIdType,
    orders: (ITransaction | AVMUTXO)[],
    addr: string,
    memo: Buffer | undefined
  ): Promise<string> {
    if (chainId === 'P') {
      if (orders.length !== 1 || !(orders[0] as ITransaction).asset)
        throw new Error('Can only process 1 fungible order');
      const order = orders[0] as ITransaction;
      return await this.platformBaseTx(
        wallet,
        order.amount,
        addr,
        memo ?? Buffer.alloc(0)
      );
    }

    let unsignedTx = await wallet.buildUnsignedTransaction(orders, addr, memo);
    const tx = await wallet.signX(unsignedTx);
    const txId: string = await ava.XChain().issueTx(tx);

    return txId;
  }

  static async issueBulkTx(
    wallet: WalletType,
    asset: AvaAsset,
    orders: BulkOrder[],
    memo: Buffer | undefined
  ): Promise<string> {
    const fromAddresses = wallet.getAllAddressesX();
    const changeAddress = wallet.getChangeAddressAvm();

    let unsignedTx = buildBulkTransfer(
      fromAddresses,
      [changeAddress],
      wallet.getUTXOSet(),
      orders,
      asset,
      memo
    );
    const tx = await wallet.signX(unsignedTx);
    return await ava.XChain().issueTx(tx);
  }

  static async validate(
    wallet: WalletType,
    nodeID: string,
    amt: BN,
    start: Date,
    end: Date,
    delegationFee: number,
    rewardAddress?: string,
    utxos?: PlatformUTXO[]
  ): Promise<string> {
    let utxoSet = wallet.getPlatformUTXOSet();

    // If given custom UTXO set use that
    if (utxos) {
      utxoSet = new PlatformUTXOSet();
      utxoSet.addArray(utxos);
    }

    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');
    const nodeOwner = wallet.getStaticAddress('P');

    let stakeAmount = amt;

    // If reward address isn't given use index 0 address
    if (!rewardAddress) {
      rewardAddress = wallet.getPlatformRewardAddress();
    }

    // For change address use first available on the platform chain
    let changeAddress = wallet.getFirstAvailableAddressPlatform();

    let stakeReturnAddr = wallet.getCurrentAddressPlatform();

    // Convert dates to unix time
    let startTime = new BN(Math.round(start.getTime() / 1000));
    let endTime = new BN(Math.round(end.getTime() / 1000));

    const unsignedTx = await ava.PChain().buildCaminoAddValidatorTx(
      utxoSet,
      [stakeReturnAddr],
      //@ts-ignore
      [pAddressStrings, signerAddresses], // from
      [changeAddress], // change
      nodeID,
      {
        address: nodeOwner,
        auth: [[0, nodeOwner]],
      },
      startTime,
      endTime,
      stakeAmount,
      [rewardAddress]
    );

    let tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }

  static async delegate(
    wallet: WalletType,
    nodeID: string,
    amt: BN,
    start: Date,
    end: Date,
    rewardAddress?: string,
    utxos?: PlatformUTXO[]
  ): Promise<string> {
    let utxoSet = wallet.getPlatformUTXOSet();
    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');

    // If given custom UTXO set use that
    if (utxos) {
      utxoSet = new PlatformUTXOSet();
      utxoSet.addArray(utxos);
    }

    // If reward address isn't given use index 0 address
    if (!rewardAddress) {
      rewardAddress = wallet.getPlatformRewardAddress();
    }

    let stakeReturnAddr = wallet.getPlatformRewardAddress();

    // For change address use first available on the platform chain
    let changeAddress = wallet.getFirstAvailableAddressPlatform();

    // Convert dates to unix time
    let startTime = new BN(Math.round(start.getTime() / 1000));
    let endTime = new BN(Math.round(end.getTime() / 1000));

    const unsignedTx = await ava.PChain().buildAddDelegatorTx(
      utxoSet,
      [stakeReturnAddr],
      [pAddressStrings, signerAddresses],
      [changeAddress],
      nodeID,
      startTime,
      endTime,
      amt,
      [rewardAddress] // reward address
    );

    const tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }

  static async getAddressState(address: string): Promise<BN> {
    return await ava.PChain().getAddressStates(address);
  }

  static async getRegisteredNode(address: string): Promise<string> {
    return await ava.PChain().getRegisteredShortIDLink(address);
  }

  static async registerNodeTx(
    wallet: WalletType,
    nodePrivateKey: string,
    oldNodeID: string | undefined,
    newNodeID: string | undefined,
    address: string,
    utxos?: PlatformUTXO[]
  ): Promise<string> {
    let utxoSet = wallet.getPlatformUTXOSet();

    // If given custom UTXO set use that
    if (utxos) {
      utxoSet = new PlatformUTXOSet();
      utxoSet.addArray(utxos);
    }

    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');

    // For change address use first available on the platform chain
    const changeAddress = wallet.getChangeAddressPlatform();
    const consortiumMemberAuthCredentials: [number, Buffer | string][] = [
      [0, pAddressStrings[0]],
    ];

    const unsignedTx = await ava.PChain().buildRegisterNodeTx(
      utxoSet,
      [pAddressStrings, signerAddresses], // from + possible signers
      [changeAddress], // change
      oldNodeID,
      newNodeID,
      address,
      consortiumMemberAuthCredentials,
      undefined, // memo
      undefined, // asOf
      1 // changeThreshold
    );

    let tx = await wallet.signP(unsignedTx, [nodePrivateKey]);
    return await ava.PChain().issueTx(tx);
  }

  static async platformBaseTx(
    wallet: WalletType,
    amount: BN,
    toAddress: string,
    memo: Buffer,
    utxos?: PlatformUTXO[]
  ): Promise<string> {
    let utxoSet = wallet.getPlatformUTXOSet();

    // If given custom UTXO set use that
    if (utxos) {
      utxoSet = new PlatformUTXOSet();
      utxoSet.addArray(utxos);
    }

    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');

    // For change address use first available on the platform chain
    const changeAddress = wallet.getChangeAddressPlatform();

    const unsignedTx = await ava.PChain().buildBaseTx(
      utxoSet,
      amount,
      [toAddress],
      [pAddressStrings, signerAddresses], // from + possible signers
      [changeAddress], // change
      memo,
      undefined, // asOf
      undefined, // lockTime
      1, // toThreshold
      1 // changeThreshold
    );

    let tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }

  static async getEthBalance(wallet: WalletType) {
    let bal = await web3.eth.getBalance(wallet.ethAddress);
    return new BN(bal);
  }

  static async sendEth(
    wallet: WalletType,
    to: string,
    amount: BN, // in wei
    gasPrice: BN,
    gasLimit: number
  ) {
    let fromAddr = '0x' + wallet.getEvmAddress();

    let tx = await buildEvmTransferNativeTx(
      fromAddr,
      to,
      amount,
      gasPrice,
      gasLimit
    );

    let signedTx = await wallet.signEvm(tx);

    let txHex = signedTx.serialize().toString('hex');
    let hash = await web3.eth.sendSignedTransaction('0x' + txHex);
    return hash.transactionHash;
  }

  static async sendErc20(
    wallet: WalletType,
    to: string,
    amount: BN,
    gasPrice: BN,
    gasLimit: number,
    token: Erc20Token
  ) {
    let fromAddr = '0x' + wallet.getEvmAddress();
    let tx = await buildEvmTransferErc20Tx(
      fromAddr,
      to,
      amount,
      gasPrice,
      gasLimit,
      token
    );

    let signedTx = await wallet.signEvm(tx);
    let txHex = signedTx.serialize().toString('hex');
    let hash = await web3.eth.sendSignedTransaction('0x' + txHex);
    return hash.transactionHash;
  }

  static async sendERCNft(
    wallet: WalletType,
    to: string,
    gasPrice: BN,
    gasLimit: number,
    token: ERCNftToken,
    tokenId: string
  ) {
    let fromAddr = '0x' + wallet.getEvmAddress();
    let tx = await buildEvmTransferERCNftTx(
      fromAddr,
      to,
      gasPrice,
      gasLimit,
      token,
      tokenId
    );
    let signedTx = await wallet.signEvm(tx);
    let txHex = signedTx.serialize().toString('hex');
    let hash = await web3.eth.sendSignedTransaction('0x' + txHex);
    return hash.transactionHash;
  }

  static async estimateTxGas(wallet: WalletType, tx: any) {
    let fromAddr = '0x' + wallet.getEvmAddress();
    let estGas = await tx.estimateGas({ from: fromAddr });
    return Math.round(estGas * 1.1);
  }

  static async estimateGas(
    wallet: WalletType,
    to: string,
    amount: BN,
    token: Erc20Token
  ) {
    let from = '0x' + wallet.getEvmAddress();
    let tx = token.createTransferTx(to, amount);
    let estGas = await tx.estimateGas({
      from: from,
    });
    // Return 10% more
    return Math.round(estGas * 1.1);
  }

  static async buildDepositClaimTx(
    wallet: WalletType,
    depositTxID: string | undefined,
    rewardOwner: OutputOwners,
    claimAmount: BN,
    claimValidator: boolean
  ) {
    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');

    // For change address use first available on the platform chain
    const changeAddress = wallet.getChangeAddressPlatform();

    const claimAmountParam = {
      claimType: claimValidator
        ? ClaimType.VALIDATOR_REWARD
        : ClaimType.EXPIRED_DEPOSIT_REWARD,
      amount: claimAmount,
      owners: rewardOwner,
      sigIdxs: [0],
    } as ClaimAmountParams;

    if (depositTxID) {
      claimAmountParam.id = bintools.cb58Decode(depositTxID);
      claimAmountParam.claimType = ClaimType.ACTIVE_DEPOSIT_REWARD;
    }

    const unsignedTx = await ava
      .PChain()
      .buildClaimTx(
        wallet.platformUtxoset,
        [pAddressStrings, signerAddresses],
        [changeAddress],
        Buffer.alloc(0),
        ZeroBN,
        1,
        [claimAmountParam]
      );
    let tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }

  static async buildDepositTx(
    wallet: WalletType,
    depositID: string,
    depositDuration: number,
    depositAmount: BN
  ) {
    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');
    const rewardAddress = bintools.parseAddress(
      wallet.getPlatformRewardAddress(),
      'P'
    );
    const changeAddress = wallet.getChangeAddressPlatform();

    const unsignedTx = await ava.PChain().buildDepositTx(
      0, //UpgradeVersion
      wallet.platformUtxoset,
      [pAddressStrings, signerAddresses],
      [changeAddress],
      depositID,
      depositDuration,
      new OutputOwners([rewardAddress], ZeroBN, 1),
      Buffer.alloc(20), // empty address
      [],
      [],
      [],
      Buffer.alloc(0),
      ZeroBN,
      depositAmount
    );
    let tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }

  static async buildAddDepositOfferTx(wallet: WalletType, offer: DepositOffer) {
    const pAddressStrings = wallet.getAllAddressesP();
    const signerAddresses = wallet.getSignerAddresses('P');
    const changeAddress = wallet.getChangeAddressPlatform();

    const creatorAddress = pAddressStrings[0];
    const creatorAuth: [number, Buffer | string][] = [[0, pAddressStrings[0]]];

    const unsignedTx = await ava
      .PChain()
      .buildAddDepositOfferTx(
        wallet.platformUtxoset,
        [pAddressStrings, signerAddresses],
        [changeAddress],
        offer,
        creatorAddress,
        creatorAuth,
        Buffer.alloc(0),
        ZeroBN
      );
    let tx = await wallet.signP(unsignedTx);
    return await ava.PChain().issueTx(tx);
  }
}

export { WalletHelper };
export type { DepositOffer };
