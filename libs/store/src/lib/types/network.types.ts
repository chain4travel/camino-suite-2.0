import { CamNetwork } from '../js/CamNetwork';
import { BN } from '@c4tplatform/caminojs/dist';

export type NetworkStatus = 'disconnected' | 'connecting' | 'connected';

export interface NetworkState {
  networks: CamNetwork[];
  networksCustom: CamNetwork[];
  selectedNetwork: null | CamNetwork;
  status: NetworkStatus;
  txFee: BN;
  depositAndBond: boolean;
}
