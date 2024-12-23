'use client';
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
import CaminoLogo from '../../logos/CaminoLogo';
import { useTheme } from '../../context/ThemeContext';

const PlatformSwitcher: React.FC<DropdownProps> = ({
  options,
  onSelect,
  activeApp,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const handleSelect = (option: OptionType) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div ref={dropdownRef} className="w-fit">
      <Menu>
        <MenuButton className="flex h-fit items-center justify-center gap-2 [&>h3]:mt-1">
          <CaminoLogo />
          <Typography variant="h3" as="h3" color="#149EED">
            {selectedOption?.name || options[0]?.name}
          </Typography>
          <Icon
            path={mdiChevronDown}
            size={1}
            className={
              theme === 'light'
                ? '[&>path]:!fill-slate-950 mt-1.5'
                : '[&>path]:!fill-slate-100 mt-1.5'
            }
          />
        </MenuButton>

        <MenuItems className="absolute mt-4 origin-top-right border w-fit rounded-xl border-slate-700 bg-slate-950">
          {options.map((option, index) => (
            <div key={option.name + index}>
              <MenuItem>
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
            </div>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default PlatformSwitcher;
