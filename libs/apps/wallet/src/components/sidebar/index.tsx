import { Box } from '@camino/ui';

export const Sidebar = () => {
  return (
    <Box className="w-full lg:w-72 min-h-[70vh]">
      <div className="p-4">
        {/* Wallet Balance */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-neutral-400">Balance (Singleton Wallet)</h2>
          <div className="mt-1 text-2xl font-semibold text-white">
            1,307.04827265 CAM
          </div>
          
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-400">Available</span>
            <span className="text-white">1,307.04827265 CAM</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-neutral-400">Locked</span>
            <span className="text-white">0 CAM</span>
          </div>
        </div>

        {/* Collectibles Section */}
        <div>
          <h2 className="text-sm font-medium text-neutral-400">Collectibles</h2>
          <p className="mt-1 text-sm text-neutral-500">
            You have not collected any non fungible tokens.
          </p>
        </div>
      </div>
    </Box>
  );
}; 