'use client';

import { DropdownProps, OptionType } from './PlatformSwitcher.types';
import React, { useEffect, useState } from 'react';

import CaminoLogo from '../../logos/CaminoLogo';
import Dropdown from '../Dropdown';
import Logo from '../../logos/Logo';
import { MenuItem } from '@headlessui/react';
import Typography from '../Typography';
import { mdiChevronDown } from '@mdi/js';

const PlatformSwitcher = ({
  options,
  onSelect,
  activeApp,
}: DropdownProps) => {
  const [currentOption, setCurrentOption] = useState<OptionType | undefined>(
    options.find(opt => opt.name === activeApp) || options[0]
  );

  useEffect(() => {
    const newActiveOption = options.find(opt => opt.name === activeApp) || options[0];
    setCurrentOption(newActiveOption);
  }, [activeApp, options]);

  const CustomTrigger = () => (
    <div className="flex items-center justify-center gap-2 [&>h3]:mt-1">
      <Logo className="w-10 h-10 md:hidden" />
      <CaminoLogo  className="hidden lg:block" />
      <Typography variant="h3" as="h3" color="#149EED">
        {currentOption?.name}
      </Typography>
    </div>
  );

  const handleSelect = (option: OptionType) => {
    if (!option.hidden) {
      setCurrentOption(option);
      onSelect(option);
    }
  };

  const filteredOptions = options.filter(option => !option.hidden);

  return (
    <Dropdown
      trigger={<CustomTrigger />}
      endIcon={mdiChevronDown}
      menuButtonClassName="!bg-transparent !border-0 hover:!bg-transparent dark:hover:!bg-transparent"
      menuItemsClassName="absolute mt-4 origin-top-right border w-fit rounded-xl border-slate-700 bg-slate-950"
    >
      {filteredOptions.map((option, index) => (
        <div key={option.name}>
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => handleSelect(option)}
                className={`
                  group px-4 py-3 flex flex-col w-full items-start text-start gap-1.5
                  ${active ? 'bg-white/10' : ''}
                `}
              >
                <Typography variant="h6" as="h6" color="#149EED">
                  {option.name}
                </Typography>
                <Typography variant="caption" as="span">
                  {option.description}
                </Typography>
              </button>
            )}
          </MenuItem>
          {index < filteredOptions.length - 1 && (
            <div className="h-px bg-slate-700" />
          )}
        </div>
      ))}
    </Dropdown>
  );
};

export default PlatformSwitcher;
