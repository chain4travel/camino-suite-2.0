import { TranslationType } from '@camino/ui';

declare module '*.json' {
  const value: TranslationType;
  export default value;
}
