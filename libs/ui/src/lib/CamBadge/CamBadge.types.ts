import { ComponentPropsWithoutRef } from "react";

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'positive'
  | 'warning'
  | 'negative'
  | 'verified'
  | 'new'
  | 'approved'
  | 'access-denied';

export type BadgeSize = 'sm' | 'md';

export interface CamBadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  variant?: BadgeVariant;
  text: string;
  size?: BadgeSize;
}
