import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import PlatformSwitcher from '../PlatformSwitcher';
import { PLATFORM_SWITCHER } from '@rebuild/data';

const Navbar = () => {
  const handleSwitcherSelect = () => {
    console.log('Selected option:');
  };

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 text-white bg-gray-900">
      {/* Dropdown Select */}
      <PlatformSwitcher
        options={PLATFORM_SWITCHER}
        activeApp=""
        onSelect={handleSwitcherSelect}
      />

      {/* Other Navbar Items */}
      <div className="flex items-center gap-6">
        <button className="text-sm">Dark</button>
        <button className="text-sm">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
