import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuSeparator,
} from '@headlessui/react';
import React, { useState, useRef } from 'react';
import { OptionType } from './PlatformSwitcher.types';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import Typography from '../Typography';
import { CaminoLogo } from '@rebuild/styles';

interface DropdownProps {
  options: OptionType[];
  onSelect: (selectedOption: OptionType) => void; // Callback when an option is selected
  defaultLabel: string; // Default label for the dropdown button
}

const PlatformSwitcher: React.FC<DropdownProps> = ({
  options,
  onSelect,
  activeApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: OptionType) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="fixed w-fit">
      <Menu>
        <MenuButton
          onClick={handleToggle}
          className=" flex justify-center items-center gap-2 rounded-md bg-slate-950 py-1.5 px-3 text-sm/6 font-semibold text-slate-100 shadow-inner shadow-white/10 focus:outline-none"
        >
          <CaminoLogo />
          <Typography variant="h4" as="h4" color="#B5E3FD">
            {selectedOption?.name}
          </Typography>
          <Icon path={mdiChevronDown} size={1} />
        </MenuButton>

        <MenuItems className="w-full mt-4 origin-top-right border rounded-xl border-slate-700 text-sm/6">
          {options.map((option, index) => (
            <>
              <MenuItem key={index}>
                <button
                  onClick={() => handleSelect(option)}
                  className="group m-2 flex flex-col w-full items-start text-start gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                >
                  <Typography variant="h6" as="h6" color="#149EED">
                    {option.name}
                  </Typography>
                  <Typography variant="caption" as="span">
                    {option.description}
                  </Typography>
                </button>
              </MenuItem>
              {option !== options[options.length - 1] && (
                <MenuSeparator className="h-px my-1 bg-slate-700" />
              )}
            </>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default PlatformSwitcher;
