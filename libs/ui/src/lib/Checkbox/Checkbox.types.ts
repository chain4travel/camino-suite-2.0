export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * The id of the checkbox
   */
  id: string;
  /**
   * Additional classes for the checkbox
   */
  className?: string;
}
