// libs/store/src/lib/providers/socket_x.ts
import Sockette from 'sockette';
import { AvaNetwork } from '../js/AvaNetwork';
import { WalletType } from '../js/wallets/types';
import { useWalletStore } from '../modules/wallet/walletStore';
import { useAssetsStore } from '../modules/assets/assetsStore';
import { PubSub } from '@c4tplatform/caminojs/dist';

// Constants
const FILTER_ADDRESS_SIZE = 1000;
const GROUP_AMOUNT = 100; // Max addresses per message

// Socket instance and state
let socketX: Sockette;
let socketOpen = false;

/**
 * Connect to the X-Chain WebSocket for AVM events
 */
export function connectSocketX(network: AvaNetwork) {
  socketOpen = false;

  if (socketX) {
    socketX.close();
  }

  try {
    // Setup the X chain socket connection
    const wsURL = network.getWsUrlX();
    // console.log('Connecting to X-Chain WebSocket:', wsURL);

    socketX = new Sockette(wsURL, {
      onopen: xOnOpen,
      onclose: xOnClose,
      onmessage: xOnMessage,
      onerror: xOnError,
    });
  } catch (error) {
    console.error('Failed to connect X-Chain WebSocket:', error);
  }
}

/**
 * Update filter addresses for the X-Chain socket
 */
export function updateFilterAddresses(): void {
  // Get active wallet from Zustand store
  const walletStore = useWalletStore.getState();
  const wallet: null | WalletType = walletStore.activeWallet;

  if (!socketOpen || !wallet) {
    // console.log(
    //   'Cannot update filter addresses - socket not open or no wallet'
    // );
    return;
  }

  try {
    const externalAddrs = wallet.getAllDerivedExternalAddresses();
    const addrsLen = externalAddrs.length;
    const startIndex = Math.max(0, addrsLen - FILTER_ADDRESS_SIZE);
    const addrs = externalAddrs.slice(startIndex);

    // console.log(`Updating filter addresses: ${addrs.length} addresses`);

    const pubsub = new PubSub();
    const bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
    socketX.send(bloom);

    // Divide addresses by GROUP_AMOUNT and send multiple messages
    // There is a max msg size ~10kb
    let index = 0;
    while (index < addrs.length) {
      const chunk = addrs.slice(index, index + GROUP_AMOUNT);
      const addAddrs = pubsub.addAddresses(chunk);
      socketX.send(addAddrs);
      index += GROUP_AMOUNT;
    }

    // console.log('Filter addresses updated successfully');
  } catch (error) {
    console.error('Failed to update filter addresses:', error);
  }
}

/**
 * Clear the filter listening to X chain transactions
 */
function clearFilter() {
  if (!socketOpen) {
    // console.log('Cannot clear filter - socket not open');
    return;
  }

  try {
    const pubsub = new PubSub();
    const bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
    socketX.send(bloom);
    // console.log('X-Chain filter cleared');
  } catch (error) {
    console.error('Failed to clear filter:', error);
  }
}

/**
 * Update wallet X-Chain balance
 */
function updateWalletBalanceX() {
  // Get active wallet from Zustand store
  const walletStore = useWalletStore.getState();
  const wallet: null | WalletType = walletStore.activeWallet;

  if (!socketOpen || !wallet) {
    // console.log('Cannot update wallet balance - socket not open or no wallet');
    return;
  }

  // console.log('Updating X-Chain wallet balance...');

  // Use Zustand assets store instead of Vuex dispatch
  const assetsStore = useAssetsStore.getState();

  // Refresh the wallet balance using the new Zustand store
  assetsStore
    .updateUTXOsExternal()
    .then(() => {
      // console.log('X-Chain balance updated successfully');

      // TODO: Update this when History module is converted to Zustand
      // For now, we'll just log
      console.log('History update pending - convert History module to Zustand');

      // When you have a history store converted, replace with:
      // const historyStore = useHistoryStore.getState();
      // historyStore.updateTransactionHistory();
    })
    .catch((error) => {
      console.error('Failed to update X-Chain balance:', error);
    });
}

// ==========================================
// Socket Event Listeners
// ==========================================

/**
 * Handle X-Chain WebSocket open event
 */
function xOnOpen() {
  // console.log('X-Chain WebSocket connected');
  socketOpen = true;
  updateFilterAddresses();
}

/**
 * Handle X-Chain WebSocket message event
 */
function xOnMessage(event: MessageEvent) {
  // console.log('X-Chain WebSocket message received');
  updateWalletBalanceX();
}

/**
 * Handle X-Chain WebSocket close event
 */
function xOnClose(event?: CloseEvent) {
  // console.log('X-Chain WebSocket disconnected');
  socketOpen = false;

  if (event) {
    // console.log('Close code:', event.code, 'Reason:', event.reason);
  }
}

/**
 * Handle X-Chain WebSocket error event
 */
function xOnError(error: Event) {
  console.error('X-Chain WebSocket error:', error);
  socketOpen = false;
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * Disconnect X-Chain WebSocket
 */
export function disconnectSocketX() {
  try {
    if (socketX) {
      socketX.close();
      // console.log('X-Chain WebSocket disconnected');
    }
    socketOpen = false;
  } catch (error) {
    console.error('Error disconnecting X-Chain WebSocket:', error);
  }
}

/**
 * Check if X-Chain WebSocket is connected
 */
export function isXChainConnected(): boolean {
  return socketOpen;
}

/**
 * Get X-Chain WebSocket status
 */
export function getXChainStatus() {
  return {
    connected: socketOpen,
    socket: socketX ? 'available' : 'not_available',
  };
}

/**
 * Manually clear X-Chain filter (useful for debugging)
 */
export function clearXFilter(): void {
  clearFilter();
}

/**
 * Force update filter addresses (useful for debugging)
 */
export function forceUpdateFilterAddresses(): void {
  // console.log('Force updating filter addresses...');
  updateFilterAddresses();
}

/**
 * Reconnect X-Chain WebSocket with current network
 */
export function reconnectSocketX() {
  // Note: You'll need to pass the current network from your network store
  // const networkStore = useNetworkStore.getState();
  // if (networkStore.selectedNetwork) {
  //   connectSocketX(networkStore.selectedNetwork);
  // }
  // console.log('Reconnect requested - network reference needed');
}

// Export socket instance for external access if needed
export { socketX };
