export interface LoaderProps {
  /**
   * The size of the loader
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * The color of the loader
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'white';
} 