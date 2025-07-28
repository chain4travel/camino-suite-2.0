import 'big.js';

declare module 'big.js' {
  interface Big {
    toLocaleString(toFixed?: number): string;
  }
}
