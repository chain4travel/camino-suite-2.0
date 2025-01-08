import { ComponentPropsWithoutRef } from "react";

export interface AccessOptionProps extends ComponentPropsWithoutRef<'button'> {
  icon: string;
  text: string;
}
