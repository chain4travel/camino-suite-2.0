// libs/store/src/lib/providers/socketX.ts (or wherever this file is located)
import Sockette from 'sockette';
import { WalletType } from '../js/wallets/types';
import { useWalletStore } from '../modules/wallet/walletStore';
import { AvaNetwork } from '../js/AvaNetwork';
import { PubSub } from '@c4tplatform/caminojs/dist';

const FILTER_ADDRESS_SIZE = 1000;

let socketX: Sockette;
let socketOpen = false;

export function connectSocketX(network: AvaNetwork) {
  socketOpen = false;
  if (socketX) {
    socketX.close();
  }

  // Setup the X chain socket connection
  let wsURL = network.getWsUrlX();
  socketX = new Sockette(wsURL, {
    onopen: xOnOpen,
    onclose: xOnClose,
    onmessage: xOnMessage,
    onerror: xOnError,
  });
}

export function updateFilterAddresses(): void {
  // Get active wallet from Zustand store instead of Vuex
  const walletStore = useWalletStore.getState();
  const wallet: null | WalletType = walletStore.activeWallet;

  if (!socketOpen || !wallet) return;

  let externalAddrs = wallet.getAllDerivedExternalAddresses();
  let addrsLen = externalAddrs.length;
  let startIndex = Math.max(0, addrsLen - FILTER_ADDRESS_SIZE);
  let addrs = externalAddrs.slice(startIndex);

  let pubsub = new PubSub();
  let bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
  socketX.send(bloom);

  // Divide addresses by 100 and send multiple messages
  // There is a max msg size ~10kb
  const GROUP_AMOUNT = 100;
  let index = 0;
  while (index < addrs.length) {
    let chunk = addrs.slice(index, index + GROUP_AMOUNT);
    let addAddrs = pubsub.addAddresses(chunk);
    socketX.send(addAddrs);
    index += GROUP_AMOUNT;
  }
}

// Clears the filter listening to X chain transactions
function clearFilter() {
  if (!socketOpen) return;

  let pubsub = new PubSub();
  let bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
  socketX.send(bloom);
}

function updateWalletBalanceX() {
  // Get active wallet from Zustand store instead of Vuex
  const walletStore = useWalletStore.getState();
  const wallet: null | WalletType = walletStore.activeWallet;

  if (!socketOpen || !wallet) return;

  // TODO: Replace these Vuex store dispatches with appropriate actions
  // when you have converted the Assets and History modules to Zustand

  // Refresh the wallet balance
  // OLD Vuex way:
  // store.dispatch('Assets/updateUTXOsExternal').then(() => {
  //   store.dispatch('History/updateTransactionHistory');
  // });

  // NEW: For now, we'll call the wallet's update method directly
  // You'll need to implement these when you convert Assets and History modules
  try {
    // Direct wallet update - you might need to adjust this based on your wallet implementation
    if (wallet.updateBalance) {
      wallet.updateBalance();
    }

    // TODO: When you convert Assets and History modules, call their Zustand actions:
    // const assetsStore = useAssetsStore.getState();
    // const historyStore = useHistoryStore.getState();
    // await assetsStore.updateUTXOsExternal();
    // await historyStore.updateTransactionHistory();

    console.log('Wallet balance update triggered for X chain');
  } catch (error) {
    console.error('Failed to update wallet balance:', error);
  }
}

// AVM Socket Listeners

function xOnOpen() {
  socketOpen = true;
  updateFilterAddresses();
}

function xOnMessage() {
  updateWalletBalanceX();
}

function xOnClose() {
  socketOpen = false;
}

function xOnError(error: any) {
  console.error('X Chain websocket error:', error);
  socketOpen = false;
}

// Utility function to get socket status
export function getSocketXStatus(): boolean {
  return socketOpen;
}

// Utility function to manually clear the filter (useful for debugging)
export function clearXFilter(): void {
  clearFilter();
}
