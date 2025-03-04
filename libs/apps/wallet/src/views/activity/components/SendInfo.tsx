import { Typography } from '@camino/ui';

interface SendInfoProps {
  amount?: string;
  to?: string;
  from?: string;
  type: 'send' | 'receive';
}

export const SendInfo = ({ amount, to, from, type }: SendInfoProps) => (
  <div className="lg:w-1/3 flex justify-between items-end gap-8">
    <div className="flex flex-col items-start gap-1">
    <Typography variant="caption" className="!text-slate-400">
      {type === 'send' ? 'Send' : 'Receive'}
    </Typography>
    {to && (
      <Typography variant="caption" className="!text-slate-400">
        to {to}
      </Typography>
    )}
    {from && (
      <Typography variant="caption" className="!text-slate-400">
        from {from}
      </Typography>
      )}
    </div>
    <Typography
      variant="body2"
      className={type === 'send' ? '!text-red-500' : '!text-green-500'}
    >
      {amount}
    </Typography>
  </div>
);
