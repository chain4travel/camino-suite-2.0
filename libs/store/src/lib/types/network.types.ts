import { BN } from '@c4tplatform/caminojs/dist';

export interface AvaNetwork {
  id?: number;
  name: string;
  url: string;
  protocol: string;
  port: number;
  networkId: number;
  ip: string;
  explorerUrl?: string;
  explorerSiteUrl?: string;
  readonly?: boolean;
  withCredentials?: boolean;

  updateCredentials(): Promise<void>;
}

export type NetworkStatus = 'disconnected' | 'connecting' | 'connected';

export interface NetworkState {
  networks: AvaNetwork[];
  networksCustom: AvaNetwork[];
  selectedNetwork: AvaNetwork | null;
  status: NetworkStatus;
  txFee: BN;
  depositAndBond: boolean;
}

export interface NetworkItem {
  name: string;
  url: string;
  protocol: string;
  port: number;
  networkId: number;
  chainId: string;
}
