import { Box, Typography } from '@camino/ui';
import { Chain } from '../../views/cross_chain/types';

interface ChainCardProps {
  chain: Chain;
  type: 'source' | 'destination';
}

export const ChainCard = ({ chain, type }: ChainCardProps) => {
  return (
    <Box className="flex-1 h-fit !p-0 bg-white dark:bg-slate-950">
      <div className="w-full flex gap-4  items-start justify-between p-4">
        <div className="flex flex-col gap-2">
          <Typography variant="caption" className="!text-slate-400">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Typography>
          <Typography variant="h2">{chain.id.split(' ')[0]}</Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="caption" className="!text-slate-400">
            Name
          </Typography>
          <Typography variant="body1">{chain.name}</Typography>
          <div className="flex flex-col gap-1">
            <Typography variant="caption" className="!text-slate-400">
              Balance
            </Typography>
            <Typography variant="body1">{chain.balance}</Typography>
          </div>
        </div>
      </div>
    </Box>
  );
};
