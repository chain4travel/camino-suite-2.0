import { Typography } from '@camino/ui';

export const CollectiblesTab = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center dark:bg-slate-900 rounded-lg shadow-sm p-6">
      <Typography variant="body1" className="text-slate-500 dark:text-slate-400 text-center">
        No collectibles found
      </Typography>
    </div>
  );
}; 