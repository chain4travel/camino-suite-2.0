'use client';

import { useNetwork } from '@camino/ui';
import { useEffectOnce } from 'libs/ui/src/hooks/useNetwork';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isInitializing, error, initializeNetworks } = useNetwork();

  useEffectOnce(() => {
    initializeNetworks();
  });

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-950 rounded-lg p-8 max-w-md mx-4 text-center">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Loading networks, please wait.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This will only take a few seconds. Please do not close the window.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-950 rounded-lg p-8 max-w-md mx-4 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
            Network Initialization Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
