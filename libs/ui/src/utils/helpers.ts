export function displayLongString(val: string, maxLength = 12): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 5) / 2;
    const remainder = (maxLength - 5) % 2;
    const firstPartSize = partSize + remainder;
    return (
      val.substring(0, firstPartSize) +
      '&nbsp;&hellip; ' +
      val.substring(val.length + 1 - partSize, val.length)
    );
  } else {
    return val;
  }
}

export function displayFirstPartLongString(
  val: string,
  maxLength = 12
): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 1) / 2;
    const remainder = (maxLength - 1) % 2;
    const firstPartSize = partSize + remainder;
    return val.substring(0, firstPartSize);
  } else {
    return val;
  }
}

export function displaySecondPartLongString(
  val: string,
  maxLength = 12
): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 1) / 2;
    return val.substring(val.length + 1 - partSize, val.length);
  } else {
    return val;
  }
}
