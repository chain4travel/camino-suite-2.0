import { CamBtnProps } from './CamBtn.types';

export function CamBtn({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  ...rest
}: CamBtnProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'text-slate-100 bg-primary';
      case 'secondary':
        return 'text-slate-700 bg-transparent border border-slate-600 hover:border-gray-300 dark:text-slate-100 dark:bg-slate-950';
      case 'positive':
        return 'text-slate-100 bg-successLight';
      case 'negative':
        return 'text-slate-100 bg-error';
      case 'accent':
        return 'text-slate-100 bg-gradient1 ';
      case 'transparent':
        return 'bg-transparent text-slate-900 dark:text-slate-100';
      default:
        return 'bg-primary ';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-md';
    }
  };

  return (
    <button
      className={`relative overflow-hidden group font-bold font-inter rounded-lg px-4 py-2 capitalize ${getVariantClass()} ${getSizeClass()}  disabled:opacity-50 disabled:cursor-not-allowed`}
      {...rest}
      onClick={onClick}
    >
      <span className="absolute inset-0 transition-opacity bg-gray-300 opacity-0 bg-opacity-70 group-hover:opacity-70"></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default CamBtn;
