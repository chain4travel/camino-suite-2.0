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
