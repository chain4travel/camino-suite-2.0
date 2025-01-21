export type AlertVariant = 'default' | 'primary' | 'positive' | 'warning' | 'negative';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The title of the alert
   */
  title?: string;
  /**
   * The description text of the alert
   */
  description: string;
  /**
   * The variant of the alert
   * @default 'default'
   */
  variant?: AlertVariant;
  /**
   * Additional CSS classes
   */
  className?: string;
}
