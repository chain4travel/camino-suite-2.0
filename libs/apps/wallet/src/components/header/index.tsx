import { Box } from '@camino/ui';
import BalanceCard from './BalanceCard';
import { AddressCard } from './AddressCard';

export const Header = () => {
  return (
    <Box className="w-full h-fit !p-0">
      <div className="flex w-full h-full items-start justify-between divide-x divide-slate-700">
        {/* Balance Card */}
        <BalanceCard />
        {/* Address Card */}
        <AddressCard />
      </div>
    </Box>
  );
};
