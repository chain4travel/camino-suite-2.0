// libs/store/src/lib/modules/network/networkStore.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BN } from '@c4tplatform/caminojs/dist';
import { AvaNetwork } from '../../js/AvaNetwork';
import { NetworkStatus } from '../../types/network.types';
import { ava, infoApi } from '../../js/AVA';
import { explorer_api } from '../../helpers/explorer_api';
import { web3 } from '../../js/web3';
import { setSocketNetwork } from '../../providers';

interface NetworkStore {
  // State (matching original Vuex state)
  status: NetworkStatus; // 'disconnected' | 'connecting' | 'connected'
  networks: AvaNetwork[];
  networksCustom: AvaNetwork[];
  selectedNetwork: AvaNetwork | null;
  txFee: BN;
  depositAndBond: boolean;

  // Actions (converted from Vuex actions)
  addCustomNetwork: (net: AvaNetwork) => void;
  removeCustomNetwork: (net: AvaNetwork) => Promise<void>;
  saveSelectedNetwork: () => void;
  loadSelectedNetwork: () => Promise<boolean>;
  save: () => void;
  load: () => void;
  setNetwork: (net: AvaNetwork) => Promise<boolean>;
  updateTxFee: () => Promise<void>;
  init: () => Promise<boolean>;

  // Mutations (converted from Vuex mutations)
  addNetwork: (net: AvaNetwork) => void;
  selectNetwork: (net: AvaNetwork) => void;

  // Getters (converted from Vuex getters)
  getAllNetworks: () => AvaNetwork[];
  getDepositAndBond: () => boolean;
  getSelectedNetwork: () => AvaNetwork | null;
}

// Custom storage that persists only serializable data
const createNetworkStorage = () => {
  return createJSONStorage(() => localStorage);
};

export const useNetworkStore = create<NetworkStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state (matching original Vuex state)
        status: 'disconnected',
        networks: [],
        networksCustom: [],
        selectedNetwork: null,
        txFee: new BN(0),
        depositAndBond: false,

        // Mutations (converted from Vuex mutations)
        addNetwork: (net: AvaNetwork) => {
          set((state) => {
            state.networks.push(net);
          });
        },

        selectNetwork: (net: AvaNetwork) => {
          set((state) => {
            state.selectedNetwork = net;
          });
        },

        // Actions (converted from Vuex actions)
        addCustomNetwork: (net: AvaNetwork) => {
          const state = get();
          const networks = state.networksCustom;

          // Check if network already exists - do not add if there is a network already with the same url
          for (let i = 0; i < networks.length; i++) {
            const url = networks[i].url;
            if (net.url === url) {
              return;
            }
          }

          set((state) => {
            state.networksCustom.push(net);
          });

          get().save();
        },

        removeCustomNetwork: async (net: AvaNetwork) => {
          set((state) => {
            const index = state.networksCustom.indexOf(net);
            if (index >= 0) {
              state.networksCustom.splice(index, 1);
            }
          });

          await get().save();
        },

        saveSelectedNetwork: () => {
          const state = get();
          const data = JSON.stringify(state.selectedNetwork?.url);
          localStorage.setItem('network_selected', data);
        },

        loadSelectedNetwork: async (): Promise<boolean> => {
          const data = localStorage.getItem('network_selected');
          if (!data) return false;

          try {
            const nets: AvaNetwork[] = get().getAllNetworks();

            for (let i = 0; i < nets.length; i++) {
              const net = nets[i];
              if (JSON.stringify(net.url) === data) {
                await get().setNetwork(net);
                return true;
              }
            }
            return false;
          } catch (e) {
            return false;
          }
        },

        // Save custom networks to local storage
        save: () => {
          const state = get();
          const data = JSON.stringify(state.networksCustom);
          localStorage.setItem('networks', data);
        },

        // Load custom networks from local storage
        load: () => {
          const data = localStorage.getItem('networks');

          if (data) {
            const networks: AvaNetwork[] = JSON.parse(data);

            networks.forEach((n) => {
              const newCustom = new AvaNetwork(
                n.name,
                n.url,
                parseInt(n.networkId as any),
                n.explorerUrl,
                n.explorerSiteUrl,
                n.readonly
              );
              get().addCustomNetwork(newCustom);
            });
          }
        },

        setNetwork: async (net: AvaNetwork): Promise<boolean> => {
          try {
            set((state) => {
              state.status = 'connecting';
            });

            // Choose if the network should use credentials
            await net.updateCredentials();
            ava.setRequestConfig('withCredentials', net.withCredentials);
            ava.setNetwork(net.ip, net.port, net.protocol, net.networkId);

            // TODO: Reset transaction history when History store is converted
            // commit('History/clear', null, { root: true })

            // Wait until network settings are fetched
            await ava.fetchNetworkSettings();

            ava.XChain().getAVAXAssetID(true);
            ava.PChain().getAVAXAssetID(true);
            ava.CChain().getAVAXAssetID(true);

            get().selectNetwork(net);
            get().saveSelectedNetwork();

            set((state) => {
              state.depositAndBond =
                ava.getNetwork().P.lockModeBondDeposit &&
                ava.getNetwork().P.verifyNodeSignature;
            });

            // Update explorer api
            explorer_api.defaults.baseURL = net.explorerUrl;

            // Set web3 Network Settings
            const web3Provider = `${net.protocol}://${net.ip}:${net.port}/ext/bc/C/rpc`;
            web3.setProvider(web3Provider);

            // Set socket connections
            setSocketNetwork(net);

            // Dispatch to Assets store
            try {
              const { useAssetsStore } = await import('../assets/assetsStore');
              const assetsStore = useAssetsStore.getState();

              assetsStore.removeAllAssets();
              await assetsStore.updateAvaAsset();

              // If authenticated, handle wallets
              const { useWalletStore } = await import('../wallet/walletStore');
              const walletStore = useWalletStore.getState();

              if (walletStore.isAuth) {
                // Handle wallet network changes
                for (const w of walletStore.wallets) {
                  if (w.onNetworkChange) {
                    w.onNetworkChange();
                  }
                }
                if (walletStore.activeWallet) {
                  walletStore.activeWallet.initialize();
                }
              }

              await assetsStore.onNetworkChange(net);

              // Update UTXOs and platform after network change
              if (walletStore.isAuth) {
                assetsStore.updateUTXOs().then(() => {
                  // TODO: Update Platform store when converted
                  // dispatch('Platform/update', null, { root: true })
                });
              }
            } catch (error) {
              console.warn('Failed to update stores on network change:', error);
            }

            // TODO: Dispatch to Launch store when converted
            // await dispatch('Launch/onNetworkChange', net, { root: true })

            await get().updateTxFee();

            // TODO: Update transaction history when History store is converted
            // dispatch('History/getAliasChains', null, { root: true })
            // await dispatch('Signavault/updateTransaction', undefined, { root: true })
            // dispatch('History/updateTransactionHistory', null, { root: true })

            // Update wallet store with network reference
            try {
              const { useWalletStore } = await import('../wallet/walletStore');
              const walletStore = useWalletStore.getState();
              walletStore.setNetwork(net as any);
            } catch (error) {
              console.warn('Failed to update wallet store network:', error);
            }

            set((state) => {
              state.status = 'connected';
            });

            return true;
          } catch (e) {
            console.error('Failed to set network:', e);
            set((state) => {
              state.status = 'disconnected';
            });
            return false;
          }
        },

        updateTxFee: async () => {
          try {
            const txFee = await infoApi.getTxFee();
            set((state) => {
              state.txFee = txFee.txFee;
            });
            ava.XChain().setTxFee(txFee.txFee);
          } catch (e) {
            console.error('Failed to update tx fee:', e);
          }
        },

        init: async (): Promise<boolean> => {
          try {
            console.log('Initializing network store...');
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

            const avaxMain = new AvaNetwork(
              'Avalanche',
              'https://api.avax.network',
              1,
              'https://explorerapi.avax.network',
              'https://explorer.avax.network',
              true
            );

            // Load custom networks if any
            try {
              get().load();
            } catch (e) {
              console.error(e);
            }

            get().addNetwork(camino);
            get().addNetwork(columbus);
            get().addNetwork(avaxMain);

            try {
              const isSet = await get().loadSelectedNetwork();
              if (!isSet) {
                const state = get();
                if (state.networks.length > 0) {
                  await get().setNetwork(state.networks[0]);
                }
              }
              return true;
            } catch (e) {
              console.log(e);
              set((state) => {
                state.status = 'disconnected';
              });
              return false;
            }
          } catch (e) {
            console.error('Failed to initialize network store:', e);
            set((state) => {
              state.status = 'disconnected';
            });
            return false;
          }
        },

        // Getters (converted from Vuex getters)
        getAllNetworks: () => {
          const state = get();
          return state.networks.concat(state.networksCustom);
        },

        getDepositAndBond: () => {
          return get().depositAndBond;
        },

        getSelectedNetwork: () => {
          return get().selectedNetwork;
        },
      })),
      {
        name: 'network-store',
        storage: createNetworkStorage(),
        partialize: (state: NetworkStore) => ({
          // Only persist serializable data
          txFee: state.txFee.toString(), // Convert BN to string for serialization
          depositAndBond: state.depositAndBond,
          // Note: networks and selectedNetwork are handled separately via save() methods
        }),
      }
    ),
    { name: 'NetworkStore' }
  )
);

// Selector hooks for easier usage (matching original getters)
export const useSelectedNetwork = () =>
  useNetworkStore((state) => state.selectedNetwork);
export const useNetworkStatus = () => useNetworkStore((state) => state.status);
export const useAllNetworks = () =>
  useNetworkStore((state) => state.getAllNetworks());
export const useTxFee = () => useNetworkStore((state) => state.txFee);
export const useDepositAndBond = () =>
  useNetworkStore((state) => state.depositAndBond);

// Action hooks for better organization
export const useNetworkActions = () => {
  const {
    addCustomNetwork,
    removeCustomNetwork,
    setNetwork,
    init,
    updateTxFee,
  } = useNetworkStore();

  return {
    addCustomNetwork,
    removeCustomNetwork,
    setNetwork,
    init,
    updateTxFee,
  };
};
