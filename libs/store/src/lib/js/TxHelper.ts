import { ava, bintools } from './AVA';
import { BulkOrder, ITransaction } from '../types/wallet.types';
import { ZeroBN } from './constants';
import { Transaction } from '@ethereumjs/tx';
import { Chain, Common, Hardfork } from '@ethereumjs/common';
import { web3 } from './web3';
import ERCNftToken from './/ERCNftToken';
import Erc20Token from './Erc20Token';

import { BN, Buffer } from '@c4tplatform/caminojs/dist';
import {
  AssetAmountDestination,
  BaseTx,
  MinterSet,
  NFTMintOutput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOutput,
  UnsignedTx as AVMUnsignedTx,
  UTXO as AVMUTXO,
  UTXOSet,
  UTXOSet as AVMUTXOSet,
  AVMConstants,
} from '@c4tplatform/caminojs/dist/apis/avm';

import { PayloadBase } from '@c4tplatform/caminojs/dist/utils';
import { OutputOwners } from '@c4tplatform/caminojs/dist/common';
import { PlatformVMConstants } from '@c4tplatform/caminojs/dist/apis/platformvm';
import { EVMConstants } from '@c4tplatform/caminojs/dist/apis/evm';

import AvaAsset from './AvaAsset';

export function buildUnsignedTransaction(
  orders: (ITransaction | AVMUTXO)[],
  addr: string,
  derivedAddresses: string[],
  utxoset: AVMUTXOSet,
  changeAddress?: string,
  memo?: Buffer
) {
  // TODO: Get new change index.
  if (!changeAddress) {
    throw 'Unable to issue transaction. Ran out of change index.';
  }

  let fromAddrsStr: string[] = derivedAddresses;
  let fromAddrs: Buffer[] = fromAddrsStr.map((val) =>
    bintools.parseAddress(val, 'X')
  );
  let changeAddr: Buffer = bintools.stringToAddress(changeAddress);

  // This does not update on network change, causing issues
  const avaxAssetId = bintools.cb58Decode(ava.getNetwork().X.avaxAssetID);
  const toBuf = bintools.stringToAddress(addr);

  const aad: AssetAmountDestination = new AssetAmountDestination(
    [toBuf],
    1,
    fromAddrs,
    [changeAddr],
    1
  );
  let isFeeAdded = false;

  // Aggregate Fungible ins & outs
  for (let i: number = 0; i < orders.length; i++) {
    let order: ITransaction | AVMUTXO = orders[i];

    if ((order as ITransaction).asset) {
      // if fungible
      let tx: ITransaction = order as ITransaction;

      let assetId = bintools.cb58Decode(tx.asset.id);
      let amt: BN = tx.amount;

      if (assetId.compare(avaxAssetId) === 0) {
        aad.addAssetAmount(assetId, amt, ava.XChain().getTxFee());
        isFeeAdded = true;
      } else {
        aad.addAssetAmount(assetId, amt, ZeroBN);
      }
    }
  }

  // If fee isn't added, add it
  if (!isFeeAdded) {
    if (ava.XChain().getTxFee().gt(ZeroBN)) {
      aad.addAssetAmount(avaxAssetId, ZeroBN, ava.XChain().getTxFee());
    }
  }

  const success: Error = utxoset.getMinimumSpendable(aad);

  let ins: TransferableInput[] = [];
  let outs: TransferableOutput[] = [];
  if (typeof success === 'undefined') {
    ins = aad.getInputs();
    outs = aad.getAllOutputs();
  } else {
    throw success;
  }

  //@ts-ignore
  let nftUtxos: UTXO[] = orders.filter((val) => {
    if ((val as ITransaction).asset) return false;
    return true;
  });

  // If transferring an NFT, build the transaction on top of an NFT tx
  let unsignedTx: AVMUnsignedTx;
  let networkId: number = ava.getNetworkID();
  let chainId: Buffer = bintools.cb58Decode(ava.XChain().getBlockchainID());

  if (nftUtxos.length > 0) {
    let nftSet = new AVMUTXOSet();
    nftSet.addArray(nftUtxos);

    let utxoIds: string[] = nftSet.getUTXOIDs();

    // Sort nft utxos
    utxoIds.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    });

    unsignedTx = nftSet.buildNFTTransferTx(
      networkId,
      chainId,
      [toBuf],
      fromAddrs,
      fromAddrs, // change address should be something else?
      utxoIds,
      undefined,
      undefined,
      memo
    );

    let rawTx = unsignedTx.getTransaction();
    let outsNft = rawTx.getOuts();
    let insNft = rawTx.getIns();

    // TODO: This is a hackish way of doing this, need methods in caminojs
    //@ts-ignore
    rawTx.outs = outsNft.concat(outs);
    //@ts-ignore
    rawTx.ins = insNft.concat(ins);
  } else {
    let baseTx: BaseTx = new BaseTx(networkId, chainId, outs, ins, memo);
    unsignedTx = new AVMUnsignedTx(baseTx);
  }
  return unsignedTx;
}

export function buildBulkTransfer(
  from: string[],
  change: string[],
  utxoset: AVMUTXOSet,
  orders: BulkOrder[],
  asset: AvaAsset,
  memo?: Buffer
): AVMUnsignedTx {
  const fromAddrs: Buffer[] = from.map((val) =>
    bintools.parseAddress(val, 'X')
  );
  const changeAddrs: Buffer[] = change.map((val) =>
    bintools.parseAddress(val, 'X')
  );

  const aad: AssetAmountDestination = new AssetAmountDestination(
    [],
    0,
    fromAddrs,
    changeAddrs,
    1
  );
  const assetId = bintools.cb58Decode(asset.id);
  const avaAsset = ava.getNetwork().X.avaxAssetID;

  // Collect outputs
  let amount = ZeroBN;
  orders.forEach((o) => (amount = amount.add(o.amount)));
  const fee = ava.XChain().getTxFee();

  if (asset.id === avaAsset) {
    aad.addAssetAmount(assetId, amount, fee);
  } else {
    aad.addAssetAmount(assetId, amount, ZeroBN);
    aad.addAssetAmount(bintools.cb58Decode(avaAsset), ZeroBN, fee);
  }

  const success: Error = utxoset.getMinimumSpendable(aad);

  let ins: TransferableInput[] = [];
  let outs: TransferableOutput[] = [];
  if (typeof success === 'undefined') {
    ins = aad.getInputs();
    outs = aad.getChangeOutputs();
  } else {
    throw success;
  }

  // Build the other outputs
  orders.forEach((v) => {
    const addr = bintools.parseAddress(v.address, 'X');
    outs.push(
      new TransferableOutput(
        assetId,
        new SECPTransferOutput(v.amount, [addr], ZeroBN, 1)
      )
    );
  });

  let networkId: number = ava.getNetworkID();
  let chainId: Buffer = bintools.cb58Decode(ava.XChain().getBlockchainID());

  const baseTx = new BaseTx(networkId, chainId, outs, ins, memo);

  return new AVMUnsignedTx(baseTx);
}

export async function buildCreateNftFamilyTx(
  name: string,
  symbol: string,
  groupNum: number,
  fromAddrs: string[],
  minterAddr: string,
  changeAddr: string,
  utxoSet: UTXOSet
) {
  let fromAddresses = fromAddrs;
  let changeAddress = changeAddr;
  let minterAddress = minterAddr;

  const minterSets: MinterSet[] = [];

  // Create the groups
  for (var i = 0; i < groupNum; i++) {
    const minterSet: MinterSet = new MinterSet(1, [minterAddress]);
    minterSets.push(minterSet);
  }

  let unsignedTx: AVMUnsignedTx = await ava
    .XChain()
    .buildCreateNFTAssetTx(
      utxoSet,
      fromAddresses,
      [changeAddress],
      minterSets,
      name,
      symbol
    );
  return unsignedTx;
}

export async function buildMintNftTx(
  mintUtxo: AVMUTXO,
  payload: PayloadBase,
  ownerAddresses: string[],
  changeAddress: string,
  fromAddresses: string[],
  utxoSet: UTXOSet
): Promise<AVMUnsignedTx> {
  let owners = [];
  for (const addr of ownerAddresses) {
    const addrBuf = bintools.parseAddress(addr, 'X');
    let owner = new OutputOwners([addrBuf]);
    owners.push(owner);
  }

  let groupID = (mintUtxo.getOutput() as NFTMintOutput).getGroupID();

  let mintTx = await ava
    .XChain()
    .buildCreateNFTMintTx(
      utxoSet,
      owners,
      fromAddresses,
      [changeAddress],
      mintUtxo.getUTXOID(),
      groupID,
      payload
    );
  return mintTx;
}

export async function buildEvmTransferNativeTx(
  from: string,
  to: string,
  amount: BN, // in wei
  gasPrice: BN,
  gasLimit: number
) {
  const nonce = await web3.eth.getTransactionCount(from);
  const chainId = await web3.eth.getChainId();
  const networkId = await web3.eth.net.getId();
  const chainParams = {
    common: Common.custom(
      {
        networkId,
        chainId,
      },
      {
        baseChain: Chain.Mainnet,
        hardfork: Hardfork.Istanbul,
      }
    ),
  };

  let tx = new Transaction(
    {
      nonce: nonce,
      gasPrice: prefixHex(gasPrice.toString('hex')),
      gasLimit: gasLimit,
      to: to,
      value: prefixHex(amount.toString('hex')),
      data: '0x',
    },
    chainParams
  );
  return tx;
}

export async function buildEvmTransferErc20Tx(
  from: string,
  to: string,
  amount: BN, // in wei
  gasPrice: BN,
  gasLimit: number,
  token: Erc20Token
) {
  const nonce = await web3.eth.getTransactionCount(from);
  const chainId = await web3.eth.getChainId();
  const networkId = await web3.eth.net.getId();
  const chainParams = {
    common: Common.custom(
      {
        networkId,
        chainId,
      },
      {
        baseChain: Chain.Mainnet,
        hardfork: Hardfork.Istanbul,
      }
    ),
  };

  let tokenTx = token.createTransferTx(to, amount);

  let tx = new Transaction(
    {
      nonce: nonce,
      gasPrice: prefixHex(gasPrice.toString('hex')),
      gasLimit: gasLimit,
      value: '0x0',
      to: token.data.address,
      data: tokenTx.encodeABI(),
    },
    chainParams
  );
  return tx;
}

export async function buildEvmTransferERCNftTx(
  from: string,
  to: string,
  gasPrice: BN,
  gasLimit: number,
  token: ERCNftToken,
  tokenId: string
) {
  const nonce = await web3.eth.getTransactionCount(from);
  const chainId = await web3.eth.getChainId();
  const networkId = await web3.eth.net.getId();
  const chainParams = {
    common: Common.custom(
      {
        networkId,
        chainId,
      },
      {
        baseChain: Chain.Mainnet,
        hardfork: Hardfork.Istanbul,
      }
    ),
  };

  let tokenTx = token.createTransferTx(from, to, tokenId);

  let tx = new Transaction(
    {
      nonce: nonce,
      gasPrice: prefixHex(gasPrice.toString('hex')),
      gasLimit: gasLimit,
      value: '0x0',
      to: token.data.address,
      data: tokenTx.encodeABI(),
    },
    chainParams
  );
  return tx;
}

const prefixHex = (s: string): string => '0x' + s;

export enum AvmTxNameEnum {
  'Transaction' = AVMConstants.BASETX,
  'Mint' = AVMConstants.CREATEASSETTX,
  'Operation' = AVMConstants.OPERATIONTX,
  'Import' = AVMConstants.IMPORTTX,
  'Export' = AVMConstants.EXPORTTX,
}

export enum PlatfromTxNameEnum {
  'Transaction' = PlatformVMConstants.BASETX,
  'Add Validator' = PlatformVMConstants.ADDVALIDATORTX,
  'Add Delegator' = PlatformVMConstants.ADDDELEGATORTX,
  'Import' = PlatformVMConstants.IMPORTTX,
  'Export' = PlatformVMConstants.EXPORTTX,
  'Add Subnet Validator' = PlatformVMConstants.ADDSUBNETVALIDATORTX,
  'Create Chain' = PlatformVMConstants.CREATECHAINTX,
  'Create Subnet' = PlatformVMConstants.CREATESUBNETTX,
  'Advance Time' = PlatformVMConstants.ADVANCETIMETX,
  'Reward Validator' = PlatformVMConstants.REWARDVALIDATORTX,
}

// TODO: create asset transactions
export enum ParseableAvmTxEnum {
  'Transaction' = AVMConstants.BASETX,
  'Import' = AVMConstants.IMPORTTX,
  'Export' = AVMConstants.EXPORTTX,
}

export enum ParseablePlatformEnum {
  'Transaction' = PlatformVMConstants.BASETX,
  'Add Validator' = PlatformVMConstants.ADDVALIDATORTX,
  'Add Delegator' = PlatformVMConstants.ADDDELEGATORTX,
  'Import' = PlatformVMConstants.IMPORTTX,
  'Export' = PlatformVMConstants.EXPORTTX,
}

export enum ParseableEvmTxEnum {
  'Import' = EVMConstants.IMPORTTX,
  'Export' = EVMConstants.EXPORTTX,
}
