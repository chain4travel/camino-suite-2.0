import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuSeparator,
} from '@headlessui/react';
import React, { useState, useRef } from 'react';
import { DropdownProps, OptionType } from './PlatformSwitcher.types';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import Typography from '../Typography';
import { CaminoLogo } from '@rebuild/styles';

const PlatformSwitcher: React.FC<DropdownProps> = ({
  options,
  onSelect,
  activeApp,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: OptionType) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div ref={dropdownRef} className="w-fit">
      <Menu>
        <MenuButton className="flex items-center justify-center gap-2 font-semibold rounded-md text-sm/6 text-slate-100">
          <CaminoLogo />
          <Typography variant="h4" as="h4" color="#149EED">
            {selectedOption?.name}
          </Typography>
          <Icon path={mdiChevronDown} size={1} />
        </MenuButton>

        <MenuItems className="absolute mt-4 origin-top-right border w-fit rounded-xl border-slate-700">
          {options.map((option, index) => (
            <>
              <MenuItem key={index}>
                <button
                  onClick={() => handleSelect(option)}
                  className="group px-4 py-3 flex flex-col w-full items-start text-start gap-1.5 rounded-lg data-[focus]:bg-white/10"
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
