// libs/store/src/lib/modules/network/networkStore.ts
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { BN } from '@c4tplatform/caminojs/dist';
import { AvaNetwork, NetworkStatus } from '../../types/network.types';

interface NetworkStore {
  // State
  networks: AvaNetwork[];
  networksCustom: AvaNetwork[];
  selectedNetwork: AvaNetwork | null;
  status: NetworkStatus;
  txFee: BN;
  depositAndBond: boolean;
  allNetworks: AvaNetwork[]; // Add this to state

  // Actions (mutations equivalent)
  addNetwork: (network: AvaNetwork) => void;
  selectNetwork: (network: AvaNetwork) => void;
  setStatus: (status: NetworkStatus) => void;
  setTxFee: (fee: BN) => void;
  setDepositAndBond: (value: boolean) => void;
  updateAllNetworks: () => void; // Helper to update computed array

  // Complex actions (Vuex actions equivalent)
  addCustomNetwork: (network: AvaNetwork) => void;
  removeCustomNetwork: (network: AvaNetwork) => Promise<void>;
  saveSelectedNetwork: () => void;
  loadSelectedNetwork: () => Promise<boolean>;
  save: () => void;
  load: () => void;
  setNetwork: (network: AvaNetwork) => Promise<boolean>;
  updateTxFee: () => Promise<void>;
  init: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  // Initial state
  networks: [],
  networksCustom: [],
  selectedNetwork: null,
  status: 'disconnected',
  txFee: new BN(0),
  depositAndBond: false,
  allNetworks: [], // Initialize empty array

  // Helper to update computed array
  updateAllNetworks: () => {
    const { networks, networksCustom } = get();
    set({ allNetworks: [...networks, ...networksCustom] });
  },

  // Simple mutations - now also update allNetworks
  addNetwork: (network) => {
    set((state) => {
      const newNetworks = [...state.networks, network];
      return {
        networks: newNetworks,
        allNetworks: [...newNetworks, ...state.networksCustom],
      };
    });
  },

  selectNetwork: (network) =>
    set({
      selectedNetwork: network,
    }),

  setStatus: (status) => set({ status }),

  setTxFee: (fee) => set({ txFee: fee }),

  setDepositAndBond: (value) => set({ depositAndBond: value }),

  // Complex actions
  addCustomNetwork: (network) => {
    const { networksCustom, save, networks } = get();

    // Check if network already exists
    const exists = networksCustom.some((net) => net.url === network.url);
    if (exists) return;

    // Add network and update allNetworks
    set((state) => {
      const newCustomNetworks = [...state.networksCustom, network];
      return {
        networksCustom: newCustomNetworks,
        allNetworks: [...state.networks, ...newCustomNetworks],
      };
    });

    // Save to localStorage
    save();
  },

  removeCustomNetwork: async (network) => {
    set((state) => {
      const newCustomNetworks = state.networksCustom.filter(
        (net) => net !== network
      );
      return {
        networksCustom: newCustomNetworks,
        allNetworks: [...state.networks, ...newCustomNetworks],
      };
    });

    await Promise.resolve(get().save());
  },

  saveSelectedNetwork: () => {
    const { selectedNetwork } = get();
    const data = JSON.stringify(selectedNetwork?.url);
    localStorage.setItem('network_selected', data);
  },

  loadSelectedNetwork: async () => {
    const { allNetworks, setNetwork } = get();
    const data = localStorage.getItem('network_selected');

    if (!data) return false;

    try {
      for (const net of allNetworks) {
        if (JSON.stringify(net.url) === data) {
          await setNetwork(net);
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  save: () => {
    const { networksCustom } = get();
    const data = JSON.stringify(networksCustom);
    localStorage.setItem('networks', data);
  },

  load: () => {
    const { addCustomNetwork } = get();
    const data = localStorage.getItem('networks');

    if (data) {
      try {
        const networks: AvaNetwork[] = JSON.parse(data);

        networks.forEach((n) => {
          // Create new AvaNetwork instance
          // For now, we'll use a simple object - later replace with actual AvaNetwork class
          const newCustom: AvaNetwork = {
            name: n.name,
            url: n.url,
            networkId: parseInt(n.networkId.toString()),
            explorerUrl: n.explorerUrl,
            explorerSiteUrl: n.explorerSiteUrl,
            readonly: n.readonly,
            protocol: n.protocol,
            port: n.port,
            ip: n.ip,
            updateCredentials: async () => {
              // TODO: Implement when we have the actual AvaNetwork class
            },
          };

          addCustomNetwork(newCustom);
        });
      } catch (e) {
        console.error('Failed to load custom networks:', e);
      }
    }
  },

  setNetwork: async (network) => {
    const {
      selectNetwork,
      setStatus,
      setDepositAndBond,
      saveSelectedNetwork,
      updateTxFee,
    } = get();

    try {
      setStatus('connecting');

      // TODO: Implement these when we have the actual dependencies
      // await network.updateCredentials();
      // ava.setRequestConfig('withCredentials', network.withCredentials);
      // ava.setNetwork(network.ip, network.port, network.protocol, network.networkId);
      // await ava.fetchNetworkSettings();
      // ava.XChain().getAVAXAssetID(true);
      // ava.PChain().getAVAXAssetID(true);
      // ava.CChain().getAVAXAssetID(true);

      selectNetwork(network);
      saveSelectedNetwork();

      // TODO: Implement when we have ava instance
      // const depositAndBond = ava.getNetwork().P.lockModeBondDeposit && ava.getNetwork().P.verifyNodeSignature;
      // setDepositAndBond(depositAndBond);

      // TODO: Implement explorer and web3 updates
      // explorer_api.defaults.baseURL = network.explorerUrl;
      // const web3Provider = `${network.protocol}://${network.ip}:${network.port}/ext/bc/C/rpc`;
      // web3.setProvider(web3Provider);
      // setSocketNetwork(network);

      // TODO: Implement other store updates
      // commit('Assets/removeAllAssets', null, { root: true })
      // await dispatch('Assets/updateAvaAsset', null, { root: true })
      // await dispatch('Assets/onNetworkChange', network, { root: true })
      // await dispatch('Launch/onNetworkChange', network, { root: true })

      await updateTxFee();

      setStatus('connected');
      return true;
    } catch (e) {
      console.error('Failed to set network:', e);
      setStatus('disconnected');
      return false;
    }
  },

  updateTxFee: async () => {
    try {
      // TODO: Implement when we have infoApi
      // const txFeeData = await infoApi.getTxFee();
      // set({ txFee: txFeeData.txFee });
      // ava.XChain().setTxFee(txFeeData.txFee);

      // Placeholder for now
      console.log('updateTxFee called - TODO: implement');
    } catch (e) {
      console.error('Failed to update tx fee:', e);
    }
  },

  init: async () => {
    const { addNetwork, load, loadSelectedNetwork, setNetwork, networks } =
      get();

    try {
      // Create default networks - using simple objects for now
      const camino: AvaNetwork = {
        name: 'Camino',
        url: 'https://api.camino.network',
        networkId: 1000,
        explorerUrl: 'https://magellan.camino.network',
        explorerSiteUrl: 'https://explorer.camino.network',
        readonly: true,
        protocol: 'https',
        port: 443,
        ip: 'api.camino.network',
        updateCredentials: async () => {},
      };

      const columbus: AvaNetwork = {
        name: 'Columbus',
        url: 'https://columbus.camino.network',
        networkId: 1001,
        explorerUrl: 'https://magellan.columbus.camino.network',
        explorerSiteUrl: 'https://explorer.camino.network',
        readonly: true,
        protocol: 'https',
        port: 443,
        ip: 'columbus.camino.network',
        updateCredentials: async () => {},
      };

      const avaxMain: AvaNetwork = {
        name: 'Avalanche',
        url: 'https://api.avax.network',
        networkId: 1,
        explorerUrl: 'https://explorerapi.avax.network',
        explorerSiteUrl: 'https://explorer.avax.network',
        readonly: true,
        protocol: 'https',
        port: 443,
        ip: 'api.avax.network',
        updateCredentials: async () => {},
      };

      // Load custom networks
      load();

      // Add default networks
      addNetwork(camino);
      addNetwork(columbus);
      addNetwork(avaxMain);

      // Try to load selected network
      const isSet = await loadSelectedNetwork();
      if (!isSet && networks.length > 0) {
        await setNetwork(networks[0]);
      }

      return true;
    } catch (e) {
      console.error('Failed to initialize networks:', e);
      set({ status: 'disconnected' });
      return false;
    }
  },

  // Getters
  getAllNetworks: () => {
    const { networks, networksCustom } = get();
    return networks.concat(networksCustom);
  },
}));

// Selector hooks for easier usage
export const useSelectedNetwork = () =>
  useNetworkStore((state) => state.selectedNetwork);
export const useNetworkStatus = () => useNetworkStore((state) => state.status);
export const useAllNetworks = () =>
  useNetworkStore((state) => state.allNetworks);
export const useTxFee = () => useNetworkStore((state) => state.txFee);
export const useDepositAndBond = () =>
  useNetworkStore((state) => state.depositAndBond);
