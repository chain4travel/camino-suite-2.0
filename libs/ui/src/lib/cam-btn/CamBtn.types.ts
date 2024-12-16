export type CamBtnProps = {
  variant: 'primary' | 'secondary' | 'positive' | 'negative' | 'accent' | 'transparent';
  size: 'sm' | 'md' | 'lg';

  children: React.ReactNode;
  onClick: () => void;
  [key: string]: unknown; // Additional props that might be passed
};
