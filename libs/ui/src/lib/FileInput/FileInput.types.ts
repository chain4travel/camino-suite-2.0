export interface FileInputProps {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  value?: File | null;
  onChange?: (file: File) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}
