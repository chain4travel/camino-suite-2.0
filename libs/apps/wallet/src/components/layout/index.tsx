'use client';

import { Box, useTheme } from '@camino/ui';
import { Navigation } from './navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import clsx from 'clsx';

const WalletLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <div
      className={clsx(
        'flex flex-col min-h-[70vh] w-full',
        theme === 'light' ? 'bg-white text-black' : 'bg-slate-950'
      )}
    >
      {/* Navigation stays at top */}
      <Navigation />

      {/* Main container takes remaining height */}
      <div className="flex-1 flex flex-col px-4 lg:px-0">
        <div className="flex-1 container mx-auto max-w-container py-8">
          <div className="flex flex-col lg:flex-row gap-4 min-h-full">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-4">
              <Header />
              {/* Main content area */}
              <Box className="flex-1">{children}</Box>
            </div>

            {/* Right sidebar */}
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
