import { Table, Typography } from '@camino/ui';
import Image from 'next/image';
import { Asset } from './types';

interface TokensTabProps {
  assets: Asset[];
}

export const TokensTab = ({ assets }: TokensTabProps) => {
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (asset: Asset) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 relative">
            <Image
              src={asset.icon}
              alt={asset.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <Typography variant="body1" className="font-medium">
              {asset.name}
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              {asset.symbol}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'send',
      header: 'Send',
      align: 'center' as const,
      render: () => (
        <button className="text-blue-500 hover:text-blue-600">
          <Typography variant="body2">Send</Typography>
        </button>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right' as const,
      render: (asset: Asset) => (
        <Typography variant="body1" className="font-medium">
          {asset.balance}
        </Typography>
      ),
    },
  ];

  return (
    <Table<Asset>
      columns={columns}
      data={assets}
      emptyMessage="No assets found"
      className="shadow-sm"
      layout="spaceBetween"
    />
  );
};
