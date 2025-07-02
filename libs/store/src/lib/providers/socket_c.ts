// libs/store/src/lib/providers/socket_c.ts
import { ethers, WebSocketProvider } from 'ethers';
import { AvaNetwork } from '../js/AvaNetwork';
import { WalletType } from '../js/wallets/types';
import { useWalletStore } from '../modules/wallet/walletStore';

// Constants
const SOCKET_RECONNECT_TIMEOUT = 1000;
const SUBSCRIBE_TIMEOUT = 500;

// Socket instance and state
export let socketEVM: WebSocketProvider;
let evmSubscriptionTimeout: number;

/**
 * Connect to the C-Chain WebSocket for EVM events
 */
export function connectSocketC(network: AvaNetwork) {
  try {
    const wsUrl = network.getWsUrlC();
    const wsProvider = new WebSocketProvider(wsUrl);

    if (socketEVM) {
      // For ethers v6, use destroy method
      socketEVM.destroy();
      socketEVM = wsProvider;
    } else {
      socketEVM = wsProvider;
    }

    updateEVMSubscriptions();

    // Handle connection events
    wsProvider.on('open', () => {
      console.log('C-Chain WebSocket connected');
    });

    wsProvider.on('close', (code: number, reason: string) => {
      console.log(
        'C-Chain WebSocket disconnected, attempting to reconnect...',
        { code, reason }
      );

      setTimeout(() => {
        connectSocketC(network);
      }, SOCKET_RECONNECT_TIMEOUT);
    });

    wsProvider.on('error', (error: any) => {
      console.error('C-Chain WebSocket error:', error);
    });
  } catch (e) {
    console.error('EVM Websocket connection failed:', e);
  }
}

/**
 * Update EVM subscriptions (block headers)
 */
export function updateEVMSubscriptions() {
  if (!socketEVM) {
    // Try again later
    if (evmSubscriptionTimeout) {
      clearTimeout(evmSubscriptionTimeout);
    }
    evmSubscriptionTimeout = window.setTimeout(() => {
      updateEVMSubscriptions();
    }, SUBSCRIBE_TIMEOUT);
    return;
  }

  removeBlockHeaderListener(socketEVM);
  addBlockHeaderListener(socketEVM);
}

/**
 * Remove block header event listener
 */
function removeBlockHeaderListener(provider: WebSocketProvider) {
  provider.off('block', blockHeaderCallback);
}

/**
 * Add block header event listener
 */
function addBlockHeaderListener(provider: WebSocketProvider) {
  provider.on('block', blockHeaderCallback);
}

/**
 * Handle new block events
 */
function blockHeaderCallback(blockNumber: number) {
  // console.log('New C-Chain block:', blockNumber);
  updateWalletBalanceC();
}

/**
 * Update wallet C-Chain balance
 */
function updateWalletBalanceC() {
  // Get active wallet from Zustand store
  const walletStore = useWalletStore.getState();
  const wallet: null | WalletType = walletStore.activeWallet;

  if (!wallet) {
    // console.log('No active wallet for C-Chain balance update');
    return;
  }

  try {
    // Refresh the wallet ETH balance
    wallet.getEthBalance();
    // console.log('C-Chain wallet balance updated');
  } catch (error) {
    console.error('Failed to update C-Chain wallet balance:', error);
  }
}

/**
 * Disconnect C-Chain WebSocket
 */
export function disconnectSocketC() {
  try {
    if (socketEVM) {
      socketEVM.destroy();
      // console.log('C-Chain WebSocket disconnected');
    }

    if (evmSubscriptionTimeout) {
      clearTimeout(evmSubscriptionTimeout);
      evmSubscriptionTimeout = 0;
    }
  } catch (error) {
    console.error('Error disconnecting C-Chain WebSocket:', error);
  }
}

/**
 * Check if C-Chain WebSocket is connected
 */
export function isCChainConnected(): boolean {
  try {
    return !!(socketEVM && socketEVM.ready);
  } catch {
    return false;
  }
}

/**
 * Get C-Chain WebSocket status
 */
export function getCChainStatus() {
  return {
    connected: isCChainConnected(),
    provider: socketEVM ? 'available' : 'not_available',
    ready: socketEVM?.ready ?? false,
  };
}

/**
 * Reconnect C-Chain WebSocket with current network
 */
export function reconnectSocketC() {
  // Note: You'll need to pass the current network from your network store
  // const networkStore = useNetworkStore.getState();
  // if (networkStore.selectedNetwork) {
  //   connectSocketC(networkStore.selectedNetwork);
  // }
  // console.log('Reconnect requested - network reference needed');
}
