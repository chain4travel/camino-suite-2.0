'use client';

import { useEffect, useState } from 'react';
import Big from 'big.js';
import BN from 'bn.js';

Big.PE = 32;

function bnToBig(val: BN, denomination: number) {
  return new Big(val.toString()).div(Math.pow(10, denomination));
}

function bigToBN(val: Big, denomination: number) {
  return new BN(val.mul(Math.pow(10, denomination)).toString());
}

interface BigNumInputProps {
  denomination?: number;
  max?: BN | null;
  min?: number;
  step?: BN | null;
  placeholder?: string;
  value: BN;
  initial?: BN | null;
  onChange: (val: BN) => void;
}

export default function BigNumInput({
  denomination = 0,
  max = null,
  min = 0,
  step = null,
  placeholder,
  value,
  initial = null,
  onChange,
}: BigNumInputProps) {
  const [val, setVal] = useState<string | undefined>(
    initial ? bnToBig(initial, denomination).toString() : undefined
  );

  const maxNumBN = max;
  const maxNumString = max ? bnToBig(max, denomination).toString() : undefined;

  const stepNum = step
    ? bnToBig(step, denomination).toString()
    : denomination >= 2
    ? '0.01'
    : Math.pow(10, -denomination).toString();

  // Watch for parent value changes
  useEffect(() => {
    setVal(value ? bnToBig(value, denomination).toString() : undefined);
  }, [value, denomination]);

  // Handle changes from the input
  const handleChange = (inputVal: string) => {
    setVal(inputVal);

    if (!inputVal) {
      onChange(new BN(0));
      return;
    }

    const splitVal = inputVal.split('.');
    if (splitVal[1] && splitVal[1].length > denomination) {
      setVal(`${splitVal[0]}.${splitVal[1].substring(0, denomination)}`);
      return;
    }

    if (parseFloat(inputVal) < min) {
      setVal(min.toString());
      return;
    }

    const valBn = bigToBN(new Big(inputVal), denomination);
    onChange(valBn);
  };

  const enforceMax = () => {
    if (!val || !maxNumBN) return;
    const valBN = bigToBN(new Big(val), denomination);
    if (valBN.gt(maxNumBN)) {
      setVal(maxNumString);
    }
  };

  const maxOut = () => {
    if (maxNumBN) {
      setVal(maxNumString);
      onChange(maxNumBN);
    }
  };

  const clear = () => setVal(undefined);

  return (
    <input
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      value={val ?? ''}
      min={min}
      max={maxNumString}
      step={stepNum}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={enforceMax}
      className="text-right outline-none"
    />
  );
}
