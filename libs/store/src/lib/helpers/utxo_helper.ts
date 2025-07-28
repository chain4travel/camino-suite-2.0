import { UTXOSet as AVMUTXOSet } from '@c4tplatform/caminojs/dist/apis/avm/utxos';
import {
  UTXO as PlatformUTXO,
  UTXOSet as PlatformUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/platformvm/utxos';
import {
  UTXO as EVMUTXO,
  UTXOSet as EVMUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/evm/utxos';
import { ava } from '../js/AVA';
import { BN } from '@c4tplatform/caminojs/dist';
import {
  AmountOutput,
  UTXO as AVMUTXO,
  AVMConstants,
} from '@c4tplatform/caminojs/dist/apis/avm';
import {
  PlatformVMConstants,
  StakeableLockOut,
} from '@c4tplatform/caminojs/dist/apis/platformvm';
// import { AvaAsset } from '';
import { BaseOutput } from '@c4tplatform/caminojs/dist/common';
import { bnToBig } from './helper';
import AvaAsset from '../js/AvaAsset';

export async function getStakeForAddresses(addrs: string[]): Promise<BN> {
  if (addrs.length <= 256) {
    let stakeData = await ava.PChain().getStake(addrs);
    return stakeData.staked;
  } else {
    //Break the list in to 1024 chunks
    let chunk = addrs.slice(0, 256);
    let remainingChunk = addrs.slice(256);

    let stakeData = await ava.PChain().getStake(chunk);
    let chunkStake = stakeData.staked;
    return chunkStake.add(await getStakeForAddresses(remainingChunk));
  }
}

export async function avmGetAllUTXOs(
  addrs: string[],
  sourceChain?: string
): Promise<AVMUTXOSet> {
  if (addrs.length <= 1024) {
    let utxos = await avmGetAllUTXOsForAddresses(addrs, sourceChain);
    return utxos;
  } else {
    //Break the list in to 1024 chunks
    let chunk = addrs.slice(0, 1024);
    let remainingChunk = addrs.slice(1024);

    let newSet = await avmGetAllUTXOsForAddresses(chunk, sourceChain);
    return newSet.merge(await avmGetAllUTXOs(remainingChunk));
  }
}

export async function avmGetAllUTXOsForAddresses(
  addrs: string[],
  sourceChain?: string,
  endIndex: any = undefined
): Promise<AVMUTXOSet> {
  if (addrs.length > 1024)
    throw new Error('Maximum length of addresses is 1024');
  let response;
  if (!endIndex) {
    response = await ava.XChain().getUTXOs(addrs, sourceChain);
  } else {
    response = await ava.XChain().getUTXOs(addrs, sourceChain, 0, endIndex);
  }

  let utxoSet = response.utxos;
  let nextEndIndex = response.endIndex;
  let len = response.numFetched;

  if (len >= 1024) {
    let subUtxos = await avmGetAllUTXOsForAddresses(
      addrs,
      sourceChain,
      nextEndIndex
    );
    return utxoSet.merge(subUtxos);
  }
  return utxoSet;
}

// helper method to get utxos for more than 1024 addresses
export async function platformGetAllUTXOs(
  addrs: string[],
  sourceChain?: string
): Promise<PlatformUTXOSet> {
  if (addrs.length <= 1024) {
    let newSet = await platformGetAllUTXOsForAddresses(addrs, sourceChain);
    return newSet;
  } else {
    //Break the list in to 1024 chunks
    let chunk = addrs.slice(0, 1024);
    let remainingChunk = addrs.slice(1024);

    let newSet = await platformGetAllUTXOsForAddresses(chunk, sourceChain);

    return newSet.merge(await platformGetAllUTXOs(remainingChunk));
  }
}

export async function platformGetAllUTXOsForAddresses(
  addrs: string[],
  sourceChain?: string,
  endIndex: any = undefined
): Promise<PlatformUTXOSet> {
  let response;
  if (!endIndex) {
    response = await ava.PChain().getUTXOs(addrs, sourceChain);
  } else {
    response = await ava.PChain().getUTXOs(addrs, sourceChain, 0, endIndex);
  }

  let utxoSet = response.utxos;
  let nextEndIndex = response.endIndex;
  let len = response.numFetched;

  if (len >= 1024) {
    let subUtxos = await platformGetAllUTXOsForAddresses(
      addrs,
      sourceChain,
      nextEndIndex
    );
    return utxoSet.merge(subUtxos);
  }

  return utxoSet;
}

export function platformUTXOsToEvmSet(utxos: PlatformUTXO[]): EVMUTXOSet {
  const ret = new EVMUTXOSet();
  ret.addArray(
    utxos.map(
      (pu) =>
        new EVMUTXO(
          pu.getCodecID(),
          pu.getTxID(),
          pu.getOutputIdx(),
          pu.getAssetID(),
          pu.getOutput()
        )
    )
  );
  return ret;
}

export function sortFnc<UTXO extends AVMUTXO | PlatformUTXO>(a: UTXO, b: UTXO) {
  let aOut = a.getOutput();
  let bOut = b.getOutput();

  let aType = aOut.getTypeID();
  let bType = bOut.getTypeID();

  if (aType === bType) {
    let aLock = aOut.getLocktime().toNumber();
    let bLock = bOut.getLocktime().toNumber();

    if (aType === PlatformVMConstants.STAKEABLELOCKOUTID) {
      let aStakeLock = (aOut as StakeableLockOut)
        .getStakeableLocktime()
        .toNumber();
      let bStakeLock = (bOut as StakeableLockOut)
        .getStakeableLocktime()
        .toNumber();

      aLock = Math.max(aLock, aStakeLock);
      bLock = Math.max(bLock, bStakeLock);
    }

    if (aLock !== bLock) return bLock - aLock;
    return 0;
  } else {
    if (aType === AVMConstants.SECPXFEROUTPUTID) {
      return -1;
    } else if (bType === AVMConstants.SECPXFEROUTPUTID) {
      return 1;
    }

    if (aType === AVMConstants.NFTXFEROUTPUTID) {
      return -1;
    } else if (bType === AVMConstants.NFTXFEROUTPUTID) {
      return 1;
    }

    if (aType === AVMConstants.NFTMINTOUTPUTID) {
      return -1;
    } else if (bType === AVMConstants.NFTMINTOUTPUTID) {
      return 1;
    }

    if (aType === AVMConstants.SECPMINTOUTPUTID) {
      return -1;
    } else if (bType === AVMConstants.SECPMINTOUTPUTID) {
      return 1;
    }

    // if(aType === AVMConstants.)
  }

  return 0;
}

export function typeName(typeID: number): string {
  switch (typeID) {
    case AVMConstants.SECPMINTOUTPUTID:
      return 'SECP Mint Output';
    case AVMConstants.SECPXFEROUTPUTID:
      return 'SECP Transfer Output';
    case AVMConstants.NFTMINTOUTPUTID:
      return 'NFT Mint Output';
    case AVMConstants.NFTXFEROUTPUTID:
      return 'NFT Transfer Output';
    case PlatformVMConstants.STAKEABLELOCKOUTID:
      return 'Stakeable Lock Output';
    case PlatformVMConstants.LOCKEDOUTID:
      return 'Locked Output';
  }
  return '';
}

export function balanceText(
  typeID: number,
  out: BaseOutput,
  asset?: AvaAsset
): string {
  if (
    typeID === AVMConstants.SECPMINTOUTPUTID ||
    typeID === PlatformVMConstants.SECPXFEROUTPUTID ||
    typeID === PlatformVMConstants.STAKEABLELOCKOUTID ||
    typeID === PlatformVMConstants.LOCKEDOUTID
  ) {
    const ot = out as AmountOutput;
    const denom = (asset as AvaAsset).denomination;
    const bn = ot.getAmount();
    return bnToBig(bn, denom).toLocaleString();
  }

  if ([6, 10, 11].includes(typeID)) {
    return '1';
  }

  return '-';
}
