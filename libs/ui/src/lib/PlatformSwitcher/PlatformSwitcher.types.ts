export interface OptionType {
  name: string;
  description?: string;
  url: string;
  private: boolean;
  hidden?: boolean;
}

export interface DropdownProps {
  options: OptionType[];
  onSelect: (selectedOption: OptionType) => void;
  activeApp: string;
}
