import { Box, Typography, useTheme } from '@camino/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV_ITEMS = [
  { label: 'Portfolio', href: '/wallet' },
  { label: 'Send', href: '/wallet/send' },
  { label: 'Cross Chain', href: '/wallet/cross-chain' },
  { label: 'Validator', href: '/wallet/validator' },
  { label: 'Earn', href: '/wallet/earn' },
  { label: 'Studio', href: '/wallet/studio' },
  { label: 'Activity', href: '/wallet/activity' },
  { label: 'Manage Keys', href: '/wallet/keys' },
  { label: 'Advanced', href: '/wallet/advanced' },
];

export const Navigation = () => {
  const { theme } = useTheme();
  const pathname = usePathname();

  const isDarkMode = theme === 'dark';

  return (
    <div 
      className={clsx(
        'w-full border-b',
        isDarkMode 
          ? 'border-slate-700 bg-slate-950' 
          : 'border-slate-200 bg-white'
      )}
    >
      <div className="container flex items-center justify-between mx-auto max-w-container">
        <nav className="flex h-14 items-center space-x-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/wallet' && pathname.startsWith('/wallet') && pathname.split('/').length === 2);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex h-full items-center px-4 transition-colors relative',
                  isActive && 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500'
                )}
              >
                <Typography
                  variant="body2"
                  className={clsx(
                    'transition-colors capitalize',
                    isActive 
                      ? isDarkMode ? '!text-white' : '!text-slate-900'
                      : isDarkMode ? '!text-neutral-400 hover:!text-white' : '!text-slate-500 hover:!text-slate-900'
                  )}
                >
                  {item.label}
                </Typography>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
