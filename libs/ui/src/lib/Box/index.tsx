import { clsx } from 'clsx';

const Box = ({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center p-4 border rounded-xl border-slate-700 overflow-hidden',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Box;
