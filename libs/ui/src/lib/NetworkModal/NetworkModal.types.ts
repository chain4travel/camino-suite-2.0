import { AvaNetwork } from '@camino/store';

export interface Network {
  name: string;
  url: string;
  magellanAddress: string;
  signavaultAddress: string;
  status: string;
}

export interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (network: AvaNetwork) => void;
  initialValues?: Network;
  editingNetworkmode: boolean;
}
