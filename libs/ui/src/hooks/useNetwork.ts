'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNetworkStore } from '@camino/store';
import type { AvaNetwork } from '@camino/store';

export const useEffectOnce = (effect) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      effect();
    }
  }, []);
};

export function useNetwork() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store actions
  const {
    status,
    selectedNetwork,
    networks,
    networksCustom,
    txFee,
    depositAndBond,
    init,
    setNetwork,
    addCustomNetwork,
    removeCustomNetwork,
    getAllNetworks,
    updateTxFee,
  } = useNetworkStore();

  const initializeNetworks = async () => {
    try {
      setError(null);
      console.log('Initializing networks...');
      await init();
      console.log('Networks initialized successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize networks';
      setError(errorMessage);
      console.error('Network initialization failed:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  // Switch network with loading state
  const switchNetwork = useCallback(
    async (network: AvaNetwork) => {
      try {
        setIsSwitching(true);
        setError(null);

        const success = await setNetwork(network);
        if (!success) {
          throw new Error('Failed to switch network');
        }

        console.log(`Successfully switched to network: ${network.name}`);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to switch network';
        setError(errorMessage);
        console.error('Network switch failed:', err);
        return false;
      } finally {
        setIsSwitching(false);
      }
    },
    [setNetwork]
  );

  // Add custom network with validation
  const addNetwork = useCallback(
    async (network: AvaNetwork) => {
      try {
        setError(null);

        // Validate network before adding
        if (!network.name || !network.url) {
          throw new Error('Network name and URL are required');
        }

        addCustomNetwork(network);
        console.log(`Added custom network: ${network.name}`);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add network';
        setError(errorMessage);
        console.error('Add network failed:', err);
        return false;
      }
    },
    [addCustomNetwork]
  );

  // Remove custom network
  const removeNetwork = useCallback(
    async (network: AvaNetwork) => {
      try {
        setError(null);
        await removeCustomNetwork(network);
        console.log(`Removed custom network: ${network.name}`);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to remove network';
        setError(errorMessage);
        console.error('Remove network failed:', err);
        return false;
      }
    },
    [removeCustomNetwork]
  );

  // Get all networks (built-in + custom)
  const allNetworks = getAllNetworks();

  // Refresh transaction fee
  const refreshTxFee = useCallback(async () => {
    try {
      await updateTxFee();
      return true;
    } catch (err) {
      console.error('Failed to update transaction fee:', err);
      return false;
    }
  }, [updateTxFee]);

  return {
    // State
    isInitializing,
    isSwitching,
    error,
    status,
    selectedNetwork,
    networks,
    networksCustom,
    allNetworks,
    txFee,
    depositAndBond,

    // Actions
    initializeNetworks,
    switchNetwork,
    addNetwork,
    removeNetwork,
    refreshTxFee,

    // Utilities
    clearError: () => setError(null),
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
  };
}
