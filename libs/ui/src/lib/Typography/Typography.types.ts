export type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export interface TypographyProps {
  variant?: Variant;
  as?: React.ElementType;
  className?: string;
  color?: string; // Custom color class like 'text-blue-500'
  children: React.ReactNode;
}
