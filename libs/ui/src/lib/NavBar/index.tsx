import Icon from '@mdi/react';
import { mdiWhiteBalanceSunny } from '@mdi/js';
import PlatformSwitcher from '../PlatformSwitcher';
import { PLATFORM_SWITCHER } from '@camino/data';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../Typography';
import { clsx } from 'clsx';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const handleSwitcherSelect = () => {
    console.log('Selected option:');
  };

  return (
    <nav
      className={clsx(
        'flex items-center justify-between w-full px-6 py-4 border-b border-slate-700',
        theme === 'light' ? 'bg-white' : 'bg-slate-950'
      )}
    >
      {/* Dropdown Select */}
      <PlatformSwitcher
        options={PLATFORM_SWITCHER}
        activeApp=""
        onSelect={handleSwitcherSelect}
      />

      {/* Other Navbar Items */}
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-1 text-sm capitalize"
          onClick={toggleTheme}
        >
          <Icon
            path={mdiWhiteBalanceSunny}
            size={1}
            className={
              theme === 'light'
                ? '[&>path]:!fill-slate-950'
                : '[&>path]:!fill-slate-100'
            }
          />
          <Typography>{theme}</Typography>
        </button>
        <button className="text-sm">
          <Typography>Login</Typography>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
