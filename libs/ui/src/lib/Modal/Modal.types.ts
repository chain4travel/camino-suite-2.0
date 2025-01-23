import { DialogProps } from '@headlessui/react';

export interface ModalProps extends Omit<DialogProps<'div'>, 'open' | 'onClose'> {
  /**
   * Controls whether the modal is displayed
   */
  isOpen: boolean;
  /**
   * Called when the modal should close
   */
  onClose: () => void;
  /**
   * The title of the modal
   */
  title?: string;
  /**
   * The content of the modal
   */
  children: React.ReactNode;
  /**
   * The size of the modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Additional classes for the modal container
   */
  className?: string;
}
