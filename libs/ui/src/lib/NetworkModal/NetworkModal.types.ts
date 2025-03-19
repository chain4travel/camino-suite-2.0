export interface Network {
  name: string;
  url: string;
  magellanAddress: string;
  signavaultAddress: string;
}

export interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (network: Network) => void;
  initialValues?: Network;
  editingNetworkmode: boolean;
}
