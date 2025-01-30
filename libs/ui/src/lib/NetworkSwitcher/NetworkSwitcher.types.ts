export interface NetworkOption {
  name: string;
  description?: string;
  hidden?: boolean;
  isCustom?: boolean;
  url?: string;
  magellanAddress?: string;
  signavaultAddress?: string;
}

export interface NetworkSwitcherProps {
  options: NetworkOption[];
  onSelect: (option: NetworkOption) => void;
  activeNetwork?: string;
  onAddNetwork: () => void;
  onEditNetwork?: (network: NetworkOption) => void;
  onDeleteNetwork?: (network: NetworkOption) => void;
}
