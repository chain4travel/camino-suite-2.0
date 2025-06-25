import Avalanche from '@c4tplatform/caminojs/dist';
import BinTools from '@c4tplatform/caminojs/dist/utils/bintools';
import { TestNetworkID } from '@c4tplatform/caminojs/dist/utils';

// Connect to TestNet by default
const ip = 'path.to.nowhere';
const port = 0;
const protocol = 'http';
const network_id: number = TestNetworkID;
const bintools: BinTools = BinTools.getInstance();
const ava: Avalanche = new Avalanche(ip, port, protocol, network_id);

function isValidAddress(addr: string) {
  try {
    let res = bintools.stringToAddress(addr);
    return true;
  } catch (err) {
    return false;
  }
}

export { ava, bintools, isValidAddress };
