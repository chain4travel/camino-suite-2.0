import { Typography } from '@camino/ui';

interface ExportInfoProps {
  amount?: string;
  chain?: string;
}

export const ExportInfo = ({ amount, chain }: ExportInfoProps) => (
  <div className="w-full lg:w-1/3 flex justify-between items-end gap-8 self-end">
    <Typography variant="caption" className="!text-slate-400">
      Export ({chain})
    </Typography>
    <Typography variant="body2" className="!text-red-500">
      {amount}
    </Typography>
  </div>
);
