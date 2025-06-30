// libs/store/src/lib/modules/network/networkStore.ts
import { create } from 'zustand';
import { BN } from '@c4tplatform/caminojs/dist';
import { AvaNetwork } from '../../js/AvaNetwork';
import { NetworkStatus } from '../../types/network.types';
import { ava, infoApi } from '../../js/AVA';
import { explorer_api } from '../../helpers/explorer_api';
import { web3 } from '../../js/web3';
import { setSocketNetwork } from '../../providers';

interface NetworkStore {
  // State
  networks: AvaNetwork[];
  networksCustom: AvaNetwork[];
  selectedNetwork: AvaNetwork | null;
  status: NetworkStatus;
  txFee: BN;
  depositAndBond: boolean;
  allNetworks: AvaNetwork[];

  // Actions
  addNetwork: (network: AvaNetwork) => void;
  selectNetwork: (network: AvaNetwork) => void;
  setStatus: (status: NetworkStatus) => void;
  setTxFee: (fee: BN) => void;
  setDepositAndBond: (value: boolean) => void;
  updateAllNetworks: () => void;

  // Complex actions
  addCustomNetwork: (network: AvaNetwork) => void;
  removeCustomNetwork: (network: AvaNetwork) => Promise<void>;
  saveSelectedNetwork: () => void;
  loadSelectedNetwork: () => Promise<boolean>;
  save: () => void;
  load: () => void;
  setNetwork: (network: AvaNetwork) => Promise<boolean>;
  updateTxFee: () => Promise<void>;
  init: () => Promise<boolean>;

  // Getters
  getAllNetworks: () => AvaNetwork[];
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  // Initial state
  networks: [],
  networksCustom: [],
  selectedNetwork: null,
  status: 'disconnected',
  txFee: new BN(0),
  depositAndBond: false,
  allNetworks: [],

  // Helper to update computed array
  updateAllNetworks: () => {
    const { networks, networksCustom } = get();
    set({ allNetworks: [...networks, ...networksCustom] });
  },

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

  addCustomNetwork: (network) => {
    const { networksCustom, save } = get();

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
    if (selectedNetwork) {
      const data = JSON.stringify(selectedNetwork.url);
      localStorage.setItem('network_selected', data);
    }
  },

  loadSelectedNetwork: async () => {
    const { allNetworks, setNetwork } = get();
    const data = localStorage.getItem('network_selected');

    if (!data) return false;

    try {
      const savedUrl = JSON.parse(data);
      const network = allNetworks.find((net) => net.url === savedUrl);

      if (network) {
        await setNetwork(network);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to load selected network:', e);
      return false;
    }
  },

  save: () => {
    const { networksCustom } = get();

    // Convert AvaNetwork instances to serializable data
    const serializableNetworks = networksCustom.map((network) => ({
      name: network.name,
      url: network.url,
      networkId: network.networkId,
      explorerUrl: network.explorerUrl,
      explorerSiteUrl: network.explorerSiteUrl,
      readonly: network.readonly,
      protocol: network.protocol,
      port: network.port,
      ip: network.ip,
    }));

    const data = JSON.stringify(serializableNetworks);
    localStorage.setItem('networks', data);
  },

  load: () => {
    const { addCustomNetwork } = get();
    const data = localStorage.getItem('networks');

    if (data) {
      try {
        const networkData = JSON.parse(data);

        networkData.forEach((n: any) => {
          // Create new AvaNetwork instance from saved data
          const customNetwork = new AvaNetwork(
            n.name,
            n.url,
            n.networkId,
            n.explorerUrl,
            n.explorerSiteUrl,
            n.readonly
          );

          addCustomNetwork(customNetwork);
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

      // Update network credentials
      await network.updateCredentials();

      // Configure ava instance with new network
      ava.setRequestConfig('withCredentials', network.withCredentials);
      ava.setNetwork(
        network.ip,
        network.port,
        network.protocol,
        network.networkId
      );

      // Fetch network settings
      await ava.fetchNetworkSettings();

      // Update chain asset IDs
      ava.XChain().getAVAXAssetID(true);
      ava.PChain().getAVAXAssetID(true);
      ava.CChain().getAVAXAssetID(true);

      selectNetwork(network);
      saveSelectedNetwork();

      // Set deposit and bond configuration
      const avaNetwork = ava.getNetwork();
      const depositAndBond =
        avaNetwork.P.lockModeBondDeposit && avaNetwork.P.verifyNodeSignature;
      setDepositAndBond(depositAndBond);

      // Update explorer API base URL
      explorer_api.defaults.baseURL = network.explorerUrl;

      // Update Web3 provider
      // const web3Provider = `${network.protocol}://${network.ip}:${network.port}/ext/bc/C/rpc`;
      // web3.setProvider(web3Provider);

      // Update socket network (if you have setSocketNetwork available)
      // setSocketNetwork(network);

      // TODO: Dispatch to other stores when they're available
      // dispatch('Assets/removeAllAssets')
      // await dispatch('Assets/updateAvaAsset')
      // await dispatch('Assets/onNetworkChange', network)
      // await dispatch('Launch/onNetworkChange', network)

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
      const txFeeData = await infoApi.getTxFee();
      set({ txFee: txFeeData.txFee });
      ava.XChain().setTxFee(txFeeData.txFee);
    } catch (e) {
      console.error('Failed to update tx fee:', e);
    }
  },

  init: async () => {
    const { addNetwork, load, loadSelectedNetwork, setNetwork, networks } =
      get();

    try {
      // Load custom networks first
      load();

      // Create default networks using AvaNetwork class
      const camino = new AvaNetwork(
        'Camino',
        'https://api.camino.network',
        1000,
        'https://magellan.camino.network',
        'https://explorer.camino.network',
        true
      );

      const columbus = new AvaNetwork(
        'Columbus',
        'https://columbus.camino.network',
        1001,
        'https://magellan.columbus.camino.network',
        'https://explorer.camino.network',
        true
      );

      // const avaxMain = new AvaNetwork(
      //   'Avalanche',
      //   'https://api.avax.network',
      //   1,
      //   'https://explorerapi.avax.network',
      //   'https://explorer.avax.network',
      //   true
      // );

      // Add default networks
      addNetwork(camino);
      addNetwork(columbus);
      // addNetwork(avaxMain);

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
