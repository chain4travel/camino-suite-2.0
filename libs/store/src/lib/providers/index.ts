import { AvaNetwork } from '../js/AvaNetwork';
import { connectSocketX } from './socket_x';
import { connectSocketC } from './socket_c';

export function setSocketNetwork(network: AvaNetwork) {
  // Setup X chain connection
  connectSocketX(network);
  // Setup EVM socket connection
  connectSocketC(network);
}

export * from './socket_x';
export * from './socket_c';
