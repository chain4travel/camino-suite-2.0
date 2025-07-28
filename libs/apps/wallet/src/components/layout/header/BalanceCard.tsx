import { Typography } from '@camino/ui';
import { mdiRefresh, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { UTXOModal } from './UTXOModal';
import {
  Big,
  BN,
  bnToBig,
  cleanAvaxBN,
  useAssetsSelectors,
  useAssetsStore,
  useComputedAssets,
  useNetworkStore,
  usePlatformBalances,
  useWalletStore,
} from '@camino/store';
import { ava } from 'libs/store/src/lib/js/AVA';

const formatNumber = (num: string) => {
  const [whole, decimal] = num.split('.');
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return { whole: formattedWhole, decimal };
};

const AmountInfo = ({
  title,
  amount,
  className,
  subtitle,
  ...rest
}: {
  title: string;
  amount: string;
  className?: string;
  subtitle?: string;
}) => {
  return (
    <div className={clsx('flex flex-col gap-1', className)} {...rest}>
      <Typography variant="body2" className="!text-slate-400">
        {title}{' '}
        {subtitle && <span className="text-slate-400">({subtitle})</span>}
      </Typography>
      <Typography
        variant="body1"
        className="text-slate-950 dark:text-slate-100"
      >
        {amount}
      </Typography>
    </div>
  );
};

const BalanceCard = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showUTXOs, setShowUTXOs] = useState(false);
  const networkStore = useNetworkStore();
  const depositAndBond = networkStore.depositAndBond;
  const { getAssetAVA, updateUTXOs, balanceDict, assetsDict, balanceLoading } =
    useAssetsStore();
  const {
    walletPlatformBalanceUnlocked,
    walletPlatformBalanceDeposited,
    walletPlatformBalanceBonded,
    walletPlatformBalanceBondedDeposited,
    walletStakingBalance,
  } = usePlatformBalances();

  const { platformBalances } = useAssetsSelectors();
  const { activeWallet } = useWalletStore();
  const { assetAVA } = useComputedAssets();

  const avmUnlocked = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    const ava_asset = getAssetAVA();
    if (!ava_asset) return cleanAvaxBN(new BN(0));
    return cleanAvaxBN(ava_asset.amount);
  }, [balanceDict, assetsDict, balanceLoading]);

  const platromUnlocked = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    return cleanAvaxBN(walletPlatformBalanceUnlocked);
  }, [walletPlatformBalanceUnlocked, balanceLoading]);

  const platromDeposited = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    return cleanAvaxBN(walletPlatformBalanceDeposited);
  }, [walletPlatformBalanceDeposited, balanceLoading]);

  const platformBonded = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    return cleanAvaxBN(walletPlatformBalanceBonded);
  }, [walletPlatformBalanceBonded, balanceLoading]);

  const platformBondedDeposited = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    return cleanAvaxBN(walletPlatformBalanceBondedDeposited);
  }, [walletPlatformBalanceBondedDeposited, balanceLoading]);

  const evmUnlocked = useMemo(() => {
    if (!activeWallet) return cleanAvaxBN(new BN(0));
    if (balanceLoading) return '--';
    // convert from ^18 to ^9
    const bal = activeWallet.ethBalance;
    return cleanAvaxBN(bal.div(new BN(Math.pow(10, 9).toString())));
  }, [activeWallet?.ethBalance, balanceLoading]);

  const unlockedText: string = useMemo(() => {
    if (balanceLoading) return '--';
    const ava_asset = getAssetAVA();
    if (ava_asset) {
      const xUnlocked = ava_asset.amount;
      const pUnlocked = walletPlatformBalanceUnlocked;
      const denom = ava_asset.denomination;
      const evmUnlockedBn = activeWallet?.ethBalance.div(
        new BN(Math.pow(10, 9).toString())
      );
      const total = xUnlocked.add(pUnlocked).add(evmUnlockedBn!);
      return cleanAvaxBN(total);
    }
  }, [
    activeWallet?.ethBalance,
    getAssetAVA,
    walletPlatformBalanceUnlocked,
    balanceLoading,
  ]);

  const balanceTextLocked: string = useMemo(() => {
    if (balanceLoading) return '--';
    const ava_asset = getAssetAVA();
    if (ava_asset) {
      const denom = ava_asset.denomination;
      if (depositAndBond) {
        const total = walletPlatformBalanceDeposited
          .add(walletPlatformBalanceBonded)
          .add(walletPlatformBalanceBondedDeposited);
        const totalDenominated = Big(total.toString()).div(Math.pow(10, denom));
        return totalDenominated.toLocaleString(denom);
      } else {
        const total = walletStakingBalance;
        return total.toLocaleString(denom);
      }
    }
    return '--';
  }, [
    balanceLoading,
    depositAndBond,
    getAssetAVA,
    walletPlatformBalanceBonded,
    walletPlatformBalanceBondedDeposited,
    walletPlatformBalanceDeposited,
    walletStakingBalance,
  ]);

  const totalBalance: BN = useMemo(() => {
    const ava_asset = getAssetAVA();
    if (!ava_asset) return new BN(0);
    let total = ava_asset.getTotalAmount();
    // add EVM balance
    let balEvm = activeWallet?.ethBalance;
    balEvm = balEvm?.div(new BN(Math.pow(10, 9).toString()));
    total = total.add(balEvm!);
    return total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    avmUnlocked,
    platromUnlocked,
    platformBondedDeposited,
    platformBonded,
    platromDeposited,
    evmUnlocked,
  ]);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap gap-2 items-center justify-between px-4 pt-3">
          <div
            onClick={() => {
              updateUTXOs();
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon
              path={mdiRefresh}
              size={1}
              className="text-slate-950 dark:text-slate-100"
            />
            <Typography variant="body2" className="font-medium">
              Balance (Singleton Wallet)
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-sm text-slate-950 dark:text-slate-100"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <Icon
                path={!showBreakdown ? mdiEyeOutline : mdiEyeOffOutline}
                size={0.9}
              />
              <Typography variant="body2">Show Breakdown</Typography>
            </button>
            <button
              className="text-sm text-slate-950 dark:text-slate-100"
              onClick={() => setShowUTXOs(!showUTXOs)}
            >
              <Typography variant="body2">Show UTXOs</Typography>
            </button>
          </div>
        </div>

        {/* Balance Amount */}
        <div className="px-4">
          <Typography
            variant="h1"
            className="!font-extralight text-lg text-slate-950 dark:text-slate-100 flex items-baseline"
          >
            {formatNumber(cleanAvaxBN(totalBalance)).whole}
            <span className="text-sm lg:text-2xl mr-2">
              {!totalBalance.isZero() && <>.</>}
              {formatNumber(cleanAvaxBN(totalBalance)).decimal}
            </span>
            CAM
          </Typography>
        </div>

        {/* Available/Locked or Breakdown */}
        {!showBreakdown ? (
          <div className="flex gap-8 px-4 divide-x divide-slate-700">
            <AmountInfo title="Available" amount={unlockedText} />
            <AmountInfo
              title="Locked"
              amount={balanceTextLocked}
              className="pl-6"
            />
          </div>
        ) : (
          <div className="flex px-4 divide-x divide-slate-700 w-fit">
            <div className="flex flex-col gap-2 w-fit pr-6">
              <AmountInfo title="Available" subtitle="X" amount={avmUnlocked} />
              <AmountInfo
                title="Available"
                subtitle="P"
                amount={platromUnlocked}
              />
              <AmountInfo title="Available" subtitle="C" amount={evmUnlocked} />
            </div>
            <div className="flex flex-col gap-2 pl-6 w-fit">
              <AmountInfo
                title="Deposited"
                subtitle="P"
                amount={platromDeposited}
              />
              <AmountInfo title="Bonded" subtitle="P" amount={platformBonded} />
              <AmountInfo
                title="Bonded & Deposited"
                subtitle="P"
                amount={platformBondedDeposited}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Typography variant="body1">Collectibles</Typography>
          <Typography variant="body2" className="!text-slate-400">
            You have not collected any non fungible tokens.
          </Typography>
        </div>
      </div>
      <UTXOModal isOpen={showUTXOs} onClose={() => setShowUTXOs(false)} />
    </>
  );
};

export default BalanceCard;
