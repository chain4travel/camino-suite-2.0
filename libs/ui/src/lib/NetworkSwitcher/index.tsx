'use client';

import { NetworkOption, NetworkSwitcherProps } from './NetworkSwitcher.types';
import React, { useEffect, useState } from 'react';
import { mdiChevronDown, mdiPencil, mdiPlus, mdiTrashCan } from '@mdi/js';

import CamBadge from '../CamBadge';
import CamBtn from '../CamBtn';
import Dropdown from '../Dropdown';
import Icon from '@mdi/react';
import { MenuItem } from '@headlessui/react';
import Typography from '../Typography';

const NetworkSwitcher = ({
  options,
  onSelect,
  activeNetwork,
  onAddNetwork,
  onEditNetwork,
  onDeleteNetwork,
}: NetworkSwitcherProps) => {
  const [currentOption, setCurrentOption] = useState<NetworkOption | undefined>(
    options.find((opt) => opt.name === activeNetwork) || options[0]
  );

  useEffect(() => {
    const newActiveOption =
      options.find((opt) => opt.name === activeNetwork) || options[0];
    setCurrentOption(newActiveOption);
  }, [activeNetwork, options]);

  const CustomTrigger = () => (
    <div className="relative flex items-center justify-center gap-2">
      <CamBadge
        size="sm"
        variant="primary"
        className="absolute top-[-20px] right-[-25px]"
        text= {currentOption?.name || ''}
      />
      <Typography>{currentOption?.name}</Typography>
    </div>
  );

  const handleSelect = (option: NetworkOption) => {
    if (!option.hidden) {
      setCurrentOption(option);
      onSelect(option);
    }
  };

  const filteredOptions = options.filter((option) => !option.hidden);

  return (
    <Dropdown
      trigger={<CustomTrigger />}
      endIcon={mdiChevronDown}
      menuButtonClassName="!bg-transparent !border-0 hover:!bg-transparent dark:hover:!bg-transparent"
      menuItemsClassName="absolute mt-4 origin-top-right border w-[300px] rounded-xl border-slate-700 bg-slate-950"
      placement="bottom-end"
    >

      {filteredOptions.map((option, index) => (
        <div key={option.name} className="relative group">
          <MenuItem>
            {({ active }) => (
              <div className="flex items-center w-full">
                <button
                  onClick={() => handleSelect(option)}
                  className={`
                    flex-1 px-4 py-3 flex items-center
                    ${active ? 'bg-white/10' : ''}
                  `}
                >
                  <Typography>{option.name}</Typography>
                </button>
                {option.isCustom && (
                  <div className="flex items-center gap-1 px-2">
                    <CamBtn
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNetwork?.(option);
                      }}
                      title="Edit Network"
                      className='!p-2 hover:!bg-primary !border-primary'
                    >
                      <Icon path={mdiPencil} size={0.5} />
                    </CamBtn>
                    <CamBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNetwork?.(option);
                      }}
                      title="Delete Network"
                      className='!p-2'
                    >
                      <Icon
                        path={mdiTrashCan}
                        size={0.5}
                      />
                    </CamBtn>
                  </div>
                )}
              </div>
            )}
          </MenuItem>
          {index < filteredOptions.length - 1 && (
            <div className="h-px bg-slate-700" />
          )}
        </div>
      ))}
      <div className="h-px bg-slate-700" />
      <MenuItem>
        {({ active }) => (
          <button
            onClick={onAddNetwork}
            className={`
              w-full px-4 py-3 flex items-center gap-2 text-left
              ${active ? 'bg-white/10' : ''}
            `}
          >
            <Icon
              path={mdiPlus}
              size={0.8}
              className="text-slate-950 dark:text-slate-100"
            />
            <Typography>Add Custom Network</Typography>
          </button>
        )}
      </MenuItem>
    </Dropdown>
  );
};

export default NetworkSwitcher;
