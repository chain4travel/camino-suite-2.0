import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkState } from '../types/network.types';
import { BN, Avalanche as Camino } from '@c4tplatform/caminojs/dist';
import { CamNetwork } from '../js/CamNetwork';
import { AppDispatch, RootState } from '../store';
import { caminoService } from '../js/CaminoService';

const initialState: NetworkState = {
  networks: [],
  networksCustom: [],
  selectedNetwork: null,
  status: 'disconnected',
  txFee: new BN(0),
  depositAndBond: false,
};

export const loadSelectedNetwork = createAsyncThunk<
  boolean,
  void,
  {
    state: RootState;
    dispatch: AppDispatch;
  }
>('network/loadSelectedNetwork', async (_, { getState, dispatch }) => {
  const data = localStorage.getItem('network_selected');
  if (!data) return false;

  try {
    const networks = selectAllNetworks(getState());
    const matchingNetwork = networks.find(
      (net) => JSON.stringify(net.url) === data
    );

    if (matchingNetwork) {
      dispatch(selectNetwork(matchingNetwork));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading selected network:', error);
    return false;
  }
});

export const setNetwork = createAsyncThunk<
  boolean,
  CamNetwork,
  {
    state: RootState;
    dispatch: AppDispatch;
  }
>('network/setNetwork', async (net, { dispatch, getState }) => {
  try {
    // Update network connection
    await net.updateCredentials();
    const camino = caminoService.getCamino();
    camino.setRequestConfig('withCredentials', net.withCredentials);
    camino.setNetwork(net.ip, net.port, net.protocol, net.networkId);

    // Fetch network settings
    await camino.fetchNetworkSettings();

    // Update AVAX Asset IDs
    camino.XChain().getAVAXAssetID(true);
    camino.PChain().getAVAXAssetID(true);
    camino.CChain().getAVAXAssetID(true);

    dispatch(selectNetwork(net));
    // dispatch(saveNetwork());

    // Update assets
    // dispatch(removeAllAssets());
    // await dispatch(updateAvaAsset());

    // Handle authenticated state
    // const state = getState();
    // if (state.auth.isAuth) {
    // Update wallets (You'll need to implement this part based on your wallet management)
    // state.wallets.forEach(w => w.onNetworkChange());
    // if (state.activeWallet) state.activeWallet.initialize();
    // }

    // Update various states
    // await dispatch(updateUTXOs());
    // await dispatch(updatePlatform());
    // dispatch(updateTxFee());
    // dispatch(getAliasChains());
    // await dispatch(updateTransaction());
    // dispatch(updateTransactionHistory());

    return true;
  } catch (error) {
    console.error('Failed to set network:', error);
    throw error;
  }
});

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    addNetwork: (state, action: PayloadAction<CamNetwork>) => {
      state.networks.push(action.payload);
    },
    selectNetwork: (state, action: PayloadAction<CamNetwork>) => {
      state.selectedNetwork = action.payload;
    },
    addCustomNetwork(state, action: PayloadAction<CamNetwork>) {
      const networkExists = state.networksCustom.some(
        (net) => net.url === action.payload.url
      );
      if (!networkExists) {
        state.networksCustom.push(action.payload);
        networkSlice.caseReducers.save(state);
      }
    },
    removeCustomNetwork(state, action: PayloadAction<CamNetwork>) {
      const index = state.networksCustom.indexOf(action.payload);
      state.networksCustom.splice(index, 1);
    },
    saveSelectedNetwork(_state, action: PayloadAction<CamNetwork>) {
      const data = JSON.stringify(action.payload.url);
      localStorage.setItem('network_selected', data);
    },
    save(state) {
      const data = JSON.stringify(state.networksCustom);
      localStorage.setItem('networks', data);
    },
    loadCustomNetworks(state) {
      const data = localStorage.getItem('networks');
      if (!data) return;

      const networks: CamNetwork[] = JSON.parse(data);
      networks.forEach((n) => {
        const newCustom = new CamNetwork(
          n.name,
          n.url,
          Number(n.networkId),
          n.explorerUrl,
          n.explorerSiteUrl,
          n.readonly
        );

        const exists = state.networksCustom.some(
          (net) => net.url === newCustom.url
        );
        if (!exists) {
          state.networksCustom.push(newCustom);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSelectedNetwork.pending, (state) => {
        state.status = 'connecting';
      })
      .addCase(loadSelectedNetwork.fulfilled, (state) => {
        state.status = 'connected';
      })
      .addCase(loadSelectedNetwork.rejected, (state) => {
        state.status = 'disconnected';
      })
      .addCase(setNetwork.pending, (state) => {
        state.status = 'connecting';
      })
      .addCase(setNetwork.fulfilled, (state) => {
        state.status = 'connected';
      })
      .addCase(setNetwork.rejected, (state) => {
        state.status = 'disconnected';
      });
  },
});

export const selectAllNetworks = (state: RootState) =>
  state.network.networks.concat(state.network.networksCustom);

export const selectDepositAndBond = (state: RootState) =>
  state.network.depositAndBond;

export const selectActivatedNetwork = (state: RootState) =>
  state.network.selectedNetwork;

export const {
  addNetwork,
  selectNetwork,
  addCustomNetwork,
  removeCustomNetwork,
  saveSelectedNetwork,
  save,
  loadCustomNetworks,
} = networkSlice.actions;

export default networkSlice.reducer;
