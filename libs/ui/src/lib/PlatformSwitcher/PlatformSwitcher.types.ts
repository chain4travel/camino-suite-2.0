export interface OptionType {
  name: string;
  description?: string;
  url: string;
  private: boolean;
  hidden?: boolean;
}

export interface DropdownProps {
  options: OptionType[];
  onSelect: (selectedOption: OptionType) => void; // Callback when an option is selected
  activeApp: string; // Default label for the dropdown button
}
