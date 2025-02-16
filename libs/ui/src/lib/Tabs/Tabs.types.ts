import { ReactNode } from "react";

export interface Tab {
  id: string;
  label: ReactNode;
  icon?: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
