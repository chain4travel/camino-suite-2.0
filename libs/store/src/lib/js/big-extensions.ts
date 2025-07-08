import Big from 'big.js';

declare module 'big.js' {
  interface Big {
    toLocaleString(toFixed?: number): string;
  }
}

Big.prototype.toLocaleString = function (toFixed: number = 9) {
  let value = this;

  let fixedStr = this.toFixed(toFixed);
  let split = fixedStr.split('.');
  let wholeStr = parseInt(split[0])
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u2005');

  if (split.length === 1) {
    return wholeStr;
  } else {
    let remainderStr = split[1];

    // remove trailing 0s
    let lastChar = remainderStr.charAt(remainderStr.length - 1);
    while (lastChar === '0') {
      remainderStr = remainderStr.substring(0, remainderStr.length - 1);
      lastChar = remainderStr.charAt(remainderStr.length - 1);
    }

    let trimmed = remainderStr.substring(0, toFixed);
    if (!trimmed) return wholeStr;
    return `${wholeStr}.${trimmed}`;
  }
};

// Export empty object to make this a module
export {};
