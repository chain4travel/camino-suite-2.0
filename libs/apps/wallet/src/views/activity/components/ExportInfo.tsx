import { Typography } from '@camino/ui';

interface ExportInfoProps {
  amount?: string;
  chain?: string;
}

export const ExportInfo = ({ amount, chain }: ExportInfoProps) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-8 w-full lg:w-auto">
    <Typography variant="caption" className="!text-slate-400">
      Export ({chain})
    </Typography>
    <Typography variant="body2" className="!text-red-500">
      {amount}
    </Typography>
  </div>
);
