import { Box, Typography } from '@camino/ui';

export const ImportCard = () => {
  return (
    <Box className="flex-1 h-fit !p-0 bg-white dark:bg-slate-950">
      <div className="w-full flex flex-col gap-2 p-4">
        <Typography variant="caption" className="!text-slate-400">
          Import
        </Typography>
        <div className="flex flex-col gap-1">
          <Typography variant="caption" className="!text-slate-400">
            ID
          </Typography>
          <Typography variant="body1">-</Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="caption" className="!text-slate-400">
            Status
          </Typography>
          <Typography variant="body1">Not Started</Typography>
        </div>
      </div>
    </Box>
  );
};
