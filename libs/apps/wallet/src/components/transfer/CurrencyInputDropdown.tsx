'use client';

import { useEffect, useRef, useState } from 'react';
import Big from 'big.js';
import BN from 'bn.js';
import BigNumInput from './BigNumInput';
// import BalanceDropdown from '';
import { bnToBig } from '@camino/store';
import { AvaAsset } from '@camino/store';

interface CurrencyInputDropdownProps {
  walletAssetsArray: AvaAsset[];
  walletAssetsDict: Record<string, AvaAsset>;
  avaxAsset: AvaAsset | null;
  disabledAssets?: AvaAsset[];
  initial?: string;
  disabled?: boolean;
  chainId: string;
  prices: { usd: Big };
  onChange: (val: { asset: AvaAsset; amount: BN }) => void;
}

export default function CurrencyInputDropdown({
  walletAssetsArray,
  walletAssetsDict,
  avaxAsset,
  disabledAssets = [],
  initial = '',
  disabled = false,
  chainId,
  prices,
  onChange,
}: CurrencyInputDropdownProps) {
  const [assetNow, setAssetNow] = useState<AvaAsset>(
    walletAssetsArray[0] || ({} as AvaAsset)
  );
  const [amount, setAmount] = useState<BN>(new BN(0));

  const bigInRef = useRef<{ maxOut: () => void; clear: () => void }>(null);

  useEffect(() => {
    if (walletAssetsArray.length === 0) return;
    if (initial) {
      const initialAsset = walletAssetsDict[initial];
      dropChange(initialAsset);
    } else {
      dropChange(walletAssetsArray[0]);
    }
  }, []);

  const dropChange = (val: AvaAsset) => {
    setAssetNow(val);
    bigInRef.current?.clear();
    onChange({ asset: val, amount: new BN(0) });
  };

  const stepSize = (() => {
    if (assetNow?.denomination > 3) {
      return new BN(Math.pow(10, assetNow.denomination - 2).toString());
    }
    return new BN(Math.pow(10, assetNow.denomination).toString());
  })();

  const maxOut = () => {
    bigInRef.current?.maxOut();
  };

  const amountIn = (val: BN) => {
    setAmount(val);
    onChange({ asset: assetNow, amount: val });
  };

  const amountUSD = (() => {
    const usdPrice = prices.usd;
    const bigAmt = bnToBig(amount, assetNow?.denomination || 0);
    return bigAmt.times(usdPrice);
  })();

  const maxAmount = (() => {
    if (!assetNow || !avaxAsset) return null;
    const assetId = assetNow.id;
    const balance = walletAssetsDict[assetId];
    const amt = chainId === 'P' ? balance.amountExtra : balance.amount;

    const avaxId = avaxAsset.id;
    if (assetId === avaxId) {
      const fee = new BN(1000000); // replace with ava.XChain().getTxFee()
      if (fee.gte(amt)) return new BN(0);
      return amt.sub(fee);
    }
    if (amt.isZero()) return null;
    return amt;
  })();

  return (
    <div className="grid grid-cols-[1fr_90px] gap-2">
      <div className="flex items-center border p-2 rounded">
        <button
          onClick={maxOut}
          disabled={disabled}
          className="opacity-40 hover:opacity-100 text-sm"
        >
          MAX
        </button>
        <div className="flex flex-col text-right">
          <BigNumInput
            ref={bigInRef}
            denomination={assetNow?.denomination || 0}
            max={maxAmount}
            step={stepSize}
            placeholder="0.00"
            disabled={disabled}
            value={amount}
            onChange={amountIn}
          />
          <p className="text-xs text-gray-500">${amountUSD.toFixed(2)}</p>
        </div>
      </div>
      {/* <BalanceDropdown
        value={assetNow}
        onChange={dropChange}
        disabled={disabled}
        disabledAssets={disabledAssets}
      /> */}
      <div className="text-sm text-gray-500">
        Balance:{' '}
        {maxAmount
          ? bnToBig(maxAmount, assetNow?.denomination || 0).toString()
          : '0'}
      </div>
    </div>
  );
}
