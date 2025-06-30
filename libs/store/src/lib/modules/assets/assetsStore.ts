import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BN } from '@c4tplatform/caminojs/dist';
import {
  AVMConstants,
  AmountOutput,
  UTXOSet as AVMUTXOSet,
  UTXO,
  NFTMintOutput,
} from '@c4tplatform/caminojs/dist/apis/avm';
import { UnixNow } from '@c4tplatform/caminojs/dist/utils';
import {
  PlatformVMConstants,
  StakeableLockOut,
  LockedOut,
} from '@c4tplatform/caminojs/dist/apis/platformvm';
import axios from 'axios';

import {
  AssetsDict,
  NftFamilyDict,
  TokenList,
  TokenListToken,
  AddTokenListInput,
} from '../../types/assets.types';
import {
  IBalanceDict,
  IWalletAssetsDict,
  IWalletBalanceDict,
  IWalletNftDict,
  IWalletNftMintDict,
  PlatformBalances,
} from '../../types/wallet.types';

// Import classes and utilities
import { ava, bintools } from '../../js/AVA';
import { ZeroBN } from '../../js/constants';
import AvaAsset from '../../js/AvaAsset';
import { AvaNftFamily } from '../../js/AvaNftFamily';
import Erc20Token from '../../js/Erc20Token';
import { AvaNetwork } from '../../js/AvaNetwork';
import { web3 } from '../../js/web3';
import MnemonicWallet from '../../js/wallets/MnemonicWallet';
import { LedgerWallet } from '../../js/wallets/LedgerWallet';
import { getPayloadFromUTXO } from '../../helpers/helper';
// import { isUrlBanned } from '../../components/misc/NftPayloadView/blacklist';

// Import default token list and store references
import ERC20_TOKEN_LIST from '../../ERC20Tokenlist.json';
import { useWalletStore } from '../wallet/walletStore';
import { useNetworkStore } from '../network/networkStore';

const TOKEN_LISTS: string[] = [];

// Assets State Interface
export interface AssetsStoreState {
  balanceLoading: boolean;
  assets: AvaAsset[];
  assetsDict: AssetsDict;
  platformBalances: PlatformBalances;
  AVA_ASSET_ID: string;
  nftFams: AvaNftFamily[];
  nftFamsDict: NftFamilyDict;
  balanceDict: IWalletBalanceDict;
  nftUTXOs: UTXO[];
  nftMintUTXOs: UTXO[];
  erc20Tokens: Erc20Token[];
  erc20TokensCustom: Erc20Token[];
  evmChainId: number;
  tokenLists: TokenList[];
  tokenListUrls: string[];
  tokenListsCustom: string[];
  nftWhitelist: string[];
}

// Assets Actions Interface
export interface AssetsActions {
  // Core actions
  addAsset: (asset: AvaAsset) => void;
  addNftFamily: (family: AvaNftFamily) => void;
  removeAllAssets: () => void;

  // Network and wallet lifecycle
  onNetworkChange: (network: AvaNetwork) => Promise<void>;
  updateWallet: () => void;
  onLogout: () => void;
  onUtxosUpdated: () => Promise<void>;

  // Balance and UTXO management
  updateUTXOs: () => Promise<boolean>;
  updateUTXOsExternal: () => Promise<boolean>;
  updateBalanceDict: () => IWalletBalanceDict;
  updatePlatformBalances: () => void;
  updateUtxoArrays: () => void;
  updateERC20Balances: () => Promise<void>;

  // Asset discovery
  addUnknownAssets: () => void;
  addUnknownAsset: (assetId: string) => Promise<any>;
  addUnknownNftFamily: (assetId: string) => Promise<any>;
  updateAvaAsset: () => Promise<void>;

  // ERC20 Token management
  addErc20Token: (token: TokenListToken) => Promise<void>;
  addCustomErc20Token: (token: TokenListToken) => Promise<Erc20Token | void>;
  saveCustomErc20Tokens: () => void;
  loadCustomErc20Tokens: () => void;

  // Token list management
  addTokenList: (tokenList: TokenList) => Promise<void>;
  addTokenListUrl: (data: AddTokenListInput) => Promise<void>;
  removeTokenList: (list: TokenList) => Promise<void>;
  loadCustomTokenLists: () => void;
  saveCustomTokenLists: () => void;
  initErc20List: () => Promise<void>;

  // NFT management
  whitelistNFT: (id: string) => void;

  // Getters
  getNetworkErc20Tokens: () => Erc20Token[];
  findErc20: (contractAddr: string) => Erc20Token | null;
  getWalletNftDict: () => IWalletNftDict;
  getWalletAssetsDict: () => IWalletAssetsDict;
  getWalletAssetsArray: () => AvaAsset[];
  getWalletAvmUtxoSet: () => AVMUTXOSet | null;
  getNftMintDict: () => IWalletNftMintDict;
  getAssetIds: () => string[];
  getAssetAVA: () => AvaAsset | null;

  // Platform balance getters
  getWalletStakingBalance: () => BN;
  getWalletPlatformBalance: () => BN;
  getWalletPlatformBalanceUnlocked: () => BN;
  getWalletPlatformBalanceLocked: () => BN;
  getWalletPlatformBalanceLockedStakeable: () => BN;
  getWalletPlatformBalanceTotalLocked: () => BN;
  getWalletPlatformBalanceDeposited: () => BN;
  getWalletPlatformBalanceBonded: () => BN;
  getWalletPlatformBalanceBondedDeposited: () => BN;
}

type AssetsStore = AssetsStoreState & AssetsActions;

// Initial state
const initialState: AssetsStoreState = {
  balanceLoading: false,
  assets: [],
  assetsDict: {},
  platformBalances: {
    balances: {},
    unlocked: {},
    locked: {},
    lockedStakeable: {},
    bonded: {},
    deposited: {},
    bondedDeposited: {},
  },
  AVA_ASSET_ID: '',
  nftFams: [],
  nftFamsDict: {},
  balanceDict: {},
  nftUTXOs: [],
  nftMintUTXOs: [],
  erc20Tokens: [],
  erc20TokensCustom: [],
  evmChainId: 0,
  tokenLists: [],
  tokenListUrls: [],
  tokenListsCustom: [],
  nftWhitelist: [],
};

// Custom storage that excludes non-serializable data
const createAssetsStorage = () => {
  return createJSONStorage(() => localStorage, {
    partialize: (state: AssetsStore) => ({
      // Persist only serializable data
      AVA_ASSET_ID: state.AVA_ASSET_ID,
      evmChainId: state.evmChainId,
      tokenListUrls: state.tokenListUrls,
      tokenListsCustom: state.tokenListsCustom,
      nftWhitelist: state.nftWhitelist,
      // Note: We don't persist complex objects like assets, UTXOs, tokens
      // They will be recreated when the wallet connects
    }),
    merge: (persistedState: any, currentState: AssetsStore) => ({
      ...currentState,
      ...persistedState,
      // Always reset these on hydration
      balanceLoading: false,
      assets: [],
      assetsDict: {},
      platformBalances: {
        balances: {},
        unlocked: {},
        locked: {},
        lockedStakeable: {},
        bonded: {},
        deposited: {},
        bondedDeposited: {},
      },
      nftFams: [],
      nftFamsDict: {},
      balanceDict: {},
      nftUTXOs: [],
      nftMintUTXOs: [],
      erc20Tokens: [],
      erc20TokensCustom: [],
      tokenLists: [],
    }),
  });
};

export const useAssetsStore = create<AssetsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Core actions
        addAsset: (asset: AvaAsset) => {
          set((state) => {
            if (state.assetsDict[asset.id]) {
              return; // Asset already exists
            }
            state.assets.push(asset);
            state.assetsDict[asset.id] = asset;
          });
        },

        addNftFamily: (family: AvaNftFamily) => {
          set((state) => {
            if (state.nftFamsDict[family.id]) {
              return; // NFT Family already exists
            }
            state.nftFams.push(family);
            state.nftFamsDict[family.id] = family;
          });
        },

        removeAllAssets: () => {
          set((state) => {
            state.assets = [];
            state.assetsDict = {};
            state.platformBalances = {
              balances: {},
              unlocked: {},
              locked: {},
              lockedStakeable: {},
              bonded: {},
              deposited: {},
              bondedDeposited: {},
            };
            state.nftFams = [];
            state.nftFamsDict = {};
            state.nftUTXOs = [];
            state.nftMintUTXOs = [];
            state.balanceDict = {};
            state.AVA_ASSET_ID = '';
          });
        },

        // Network and wallet lifecycle
        onNetworkChange: async (network: AvaNetwork) => {
          try {
            const id = await web3.eth.getChainId();
            set((state) => {
              state.evmChainId = id;
              state.balanceLoading = true;
            });

            const walletStore = useWalletStore.getState();
            if (walletStore.activeWallet) {
              get().updateWallet();
            }
          } catch (error) {
            console.error('Failed to update network:', error);
          }
        },

        updateWallet: () => {
          // TODO: Dispatch to ERCNft module when it's converted
          // dispatch('ERCNft/updateUserNfts')
          // dispatch('ERCNft/scanNewNfts')
        },

        onLogout: () => {
          get().removeAllAssets();
        },

        onUtxosUpdated: async () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return;

          if (wallet.isFetchUtxos) {
            setTimeout(() => {
              get().onUtxosUpdated();
            }, 500);
            return;
          }

          get().updatePlatformBalances();
          get().updateBalanceDict();
          get().updateUtxoArrays();
          get().addUnknownAssets();

          set((state) => {
            state.balanceLoading = false;
          });
        },

        // Balance and UTXO management
        updateUTXOs: async () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return false;

          await wallet.getUTXOs();
          await get().onUtxosUpdated();
          await get().updateERC20Balances();

          // TODO: Dispatch to ERCNft when converted
          // dispatch('ERCNft/scanNewNfts')
          // dispatch('ERCNft/updateWalletBalance')

          // Update active address in wallet store
          walletStore.updateActiveAddress();
          return true;
        },

        updateUTXOsExternal: async () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return false;

          if (wallet.type === 'ledger' || wallet.type === 'mnemonic') {
            await (
              wallet as MnemonicWallet | LedgerWallet
            ).updateUTXOsExternal();
          } else {
            await wallet.updateUTXOsX();
          }

          await get().onUtxosUpdated();
          walletStore.updateActiveAddress();
          return true;
        },

        updateBalanceDict: () => {
          const utxoSet = get().getWalletAvmUtxoSet();
          if (!utxoSet) return {};

          const dict: IWalletBalanceDict = {};
          const unixNow = UnixNow();
          const ZERO = new BN(0);
          const addrUtxos = utxoSet.getAllUTXOs();

          for (let n = 0; n < addrUtxos.length; n++) {
            const utxo = addrUtxos[n];
            const outId = utxo.getOutput().getOutputID();

            if (outId !== AVMConstants.SECPXFEROUTPUTID) continue;

            const utxoOut = utxo.getOutput() as AmountOutput;
            const locktime = utxoOut.getLocktime();
            const amount = utxoOut.getAmount();
            const assetIdBuff = utxo.getAssetID();
            const assetId = bintools.cb58Encode(assetIdBuff);

            if (locktime.lte(unixNow)) {
              // Not locked
              if (!dict[assetId]) {
                dict[assetId] = {
                  locked: ZERO,
                  available: amount.clone(),
                };
              } else {
                dict[assetId].available = dict[assetId].available.add(amount);
              }
            } else {
              // Locked
              if (!dict[assetId]) {
                dict[assetId] = {
                  locked: amount.clone(),
                  available: ZERO,
                };
              } else {
                dict[assetId].locked = dict[assetId].locked.add(amount);
              }
            }
          }

          set((state) => {
            state.balanceDict = dict;
          });

          return dict;
        },

        updatePlatformBalances: () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return;

          const utxoSet = wallet.getPlatformUTXOSet();
          const utxos = utxoSet.getAllUTXOs();
          const now = UnixNow();

          const addDictAmount = (
            amt: BN,
            assetID: string,
            dict: IBalanceDict
          ) => {
            dict[assetID] = new BN(dict[assetID] ?? ZeroBN).add(amt);
          };

          const newBalance: PlatformBalances = {
            balances: {},
            unlocked: {},
            locked: {},
            lockedStakeable: {},
            bonded: {},
            deposited: {},
            bondedDeposited: {},
          };

          for (const utxo of utxos) {
            const assetID = bintools.cb58Encode(utxo.getAssetID());
            const utxoOut = utxo.getOutput();
            const outId = utxoOut.getOutputID();
            const amt = (utxoOut as AmountOutput).getAmount();

            let locktime = ZeroBN;
            if (outId === PlatformVMConstants.STAKEABLELOCKOUTID) {
              locktime = (utxoOut as StakeableLockOut).getStakeableLocktime();
            } else {
              locktime = (utxoOut as AmountOutput).getLocktime();
              if (outId === PlatformVMConstants.LOCKEDOUTID) {
                const isDeposited = !(utxoOut as LockedOut)
                  .getLockedIDs()
                  .getDepositTxID()
                  .isEmpty();
                const isBonded = !(utxoOut as LockedOut)
                  .getLockedIDs()
                  .getBondTxID()
                  .isEmpty();
                const dest = isDeposited
                  ? isBonded
                    ? newBalance.bondedDeposited
                    : newBalance.deposited
                  : newBalance.bonded;
                addDictAmount(amt, assetID, dest);
              }
            }
            addDictAmount(amt, assetID, newBalance.balances);
            if (outId !== PlatformVMConstants.LOCKEDOUTID) {
              const dest = locktime.lte(now)
                ? newBalance.unlocked
                : outId === PlatformVMConstants.STAKEABLELOCKOUTID
                ? newBalance.lockedStakeable
                : newBalance.locked;
              addDictAmount(amt, assetID, dest);
            }
          }

          set((state) => {
            state.platformBalances = newBalance;
          });
        },

        updateUtxoArrays: () => {
          const utxoSet = get().getWalletAvmUtxoSet();
          if (!utxoSet) return;

          const utxos = utxoSet.getAllUTXOs();
          const nftUtxos: UTXO[] = [];
          const nftMintUtxos: UTXO[] = [];

          for (let n = 0; n < utxos.length; n++) {
            const utxo = utxos[n];
            const outId = utxo.getOutput().getOutputID();

            if (outId === AVMConstants.NFTXFEROUTPUTID) {
              nftUtxos.push(utxo);
            } else if (outId === AVMConstants.NFTMINTOUTPUTID) {
              nftMintUtxos.push(utxo);
            }
          }

          // Filter NFT utxos
          const filteredNftUtxos = nftUtxos.filter((utxo) => {
            const payload = getPayloadFromUTXO(utxo);
            const content = payload.getContent().toString();
            // return !isUrlBanned(content); // TODO: Use a proper blacklist check
            return content; // TODO: Use a proper blacklist check
          });

          set((state) => {
            state.nftUTXOs = filteredNftUtxos;
            state.nftMintUTXOs = nftMintUtxos;
          });
        },

        updateERC20Balances: async () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet || !wallet.ethAddress) return;

          const state = get();
          const networkID = state.evmChainId;
          const tokens = get().getNetworkErc20Tokens();

          tokens.forEach((token) => {
            if (token.data.chainId !== networkID) return;
            token.updateBalance(wallet.ethAddress);
          });
        },

        // Asset discovery
        addUnknownAssets: () => {
          const state = get();
          const balanceDict = state.balanceDict;
          const nftDict = get().getWalletNftDict();
          const nftMintDict = get().getNftMintDict();

          for (const id in balanceDict) {
            if (!state.assetsDict[id]) {
              get().addUnknownAsset(id);
            }
          }

          for (const nft_id in nftDict) {
            if (!state.nftFamsDict[nft_id]) {
              get().addUnknownNftFamily(nft_id);
            }
          }

          for (const familyId in nftMintDict) {
            if (!state.nftFamsDict[familyId]) {
              get().addUnknownNftFamily(familyId);
            }
          }
        },

        addUnknownAsset: async (assetId: string) => {
          try {
            const desc = await ava.XChain().getAssetDescription(assetId);
            const newAsset = new AvaAsset(
              assetId,
              desc.name,
              desc.symbol,
              desc.denomination
            );
            get().addAsset(newAsset);
            return desc;
          } catch (error) {
            console.error('Failed to add unknown asset:', error);
            throw error;
          }
        },

        addUnknownNftFamily: async (assetId: string) => {
          try {
            const desc = await ava.XChain().getAssetDescription(assetId);
            const newFam = new AvaNftFamily(assetId, desc.name, desc.symbol);
            get().addNftFamily(newFam);
            return desc;
          } catch (error) {
            console.error('Failed to add unknown NFT family:', error);
            throw error;
          }
        },

        updateAvaAsset: async () => {
          try {
            const res = await ava
              .XChain()
              .getAssetDescription(ava.getPrimaryAssetAlias());
            const id = bintools.cb58Encode(res.assetID);
            const asset = new AvaAsset(
              id,
              res.name,
              res.symbol,
              res.denomination
            );

            set((state) => {
              state.AVA_ASSET_ID = id;
            });

            get().addAsset(asset);
          } catch (error) {
            console.error('Failed to update AVA asset:', error);
            throw error;
          }
        },

        // ERC20 Token management
        addErc20Token: async (token: TokenListToken) => {
          const state = get();
          const tokens = state.erc20TokensCustom.concat(state.erc20Tokens);

          // Check if already added
          for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            if (
              token.address === t.data.address &&
              token.chainId === t.data.chainId
            ) {
              return;
            }
          }

          const newToken = new Erc20Token(token);
          set((state) => {
            state.erc20Tokens.push(newToken);
          });
        },

        addCustomErc20Token: async (token: TokenListToken) => {
          const state = get();
          const tokens = state.erc20TokensCustom.concat(state.erc20Tokens);

          // Check if already added
          for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            if (
              token.address === t.data.address &&
              token.chainId === t.data.chainId
            ) {
              return;
            }
          }

          const newToken = new Erc20Token(token);

          set((state) => {
            state.erc20TokensCustom.push(newToken);
          });

          const walletStore = useWalletStore.getState();
          if (walletStore.activeWallet?.ethAddress) {
            newToken.updateBalance(walletStore.activeWallet.ethAddress);
          }

          get().saveCustomErc20Tokens();
          return newToken;
        },

        saveCustomErc20Tokens: () => {
          const state = get();
          const tokenRawData = state.erc20TokensCustom.map(
            (token) => token.data
          );
          localStorage.setItem('erc20_tokens', JSON.stringify(tokenRawData));
        },

        loadCustomErc20Tokens: () => {
          const tokensRaw = localStorage.getItem('erc20_tokens') || '[]';
          const tokens: TokenListToken[] = JSON.parse(tokensRaw);

          set((state) => {
            state.erc20TokensCustom = tokens.map(
              (token) => new Erc20Token(token)
            );
          });
        },

        // Token list management
        addTokenList: async (tokenList: TokenList) => {
          const tokens = tokenList.tokens;

          set((state) => {
            state.tokenLists.push(tokenList);
            if (!tokenList.readonly) {
              state.tokenListsCustom.push(tokenList.url);
            } else {
              state.tokenListUrls.push(tokenList.url);
            }
          });

          for (let i = 0; i < tokens.length; i++) {
            await get().addErc20Token(tokens[i]);
          }

          if (!tokenList.readonly) {
            get().saveCustomTokenLists();
          }
        },

        addTokenListUrl: async (data: AddTokenListInput) => {
          const state = get();

          // Check if already added
          if (
            state.tokenListUrls.includes(data.url) ||
            state.tokenListsCustom.includes(data.url)
          ) {
            throw new Error('Already added.');
          }

          try {
            const res = await axios.get(data.url);
            const tokenList: TokenList = res.data;
            tokenList.url = data.url;
            tokenList.readonly = data.readonly;

            await get().addTokenList(tokenList);
          } catch (error) {
            console.error('Failed to add token list:', error);
            throw error;
          }
        },

        removeTokenList: async (list: TokenList) => {
          set((state) => {
            // Remove token list object
            const listIndex = state.tokenLists.findIndex(
              (l) => l.url === list.url
            );
            if (listIndex >= 0) {
              state.tokenLists.splice(listIndex, 1);
            }

            // Remove custom token list URLs
            const urlIndex = state.tokenListsCustom.indexOf(list.url);
            if (urlIndex >= 0) {
              state.tokenListsCustom.splice(urlIndex, 1);
            }
          });

          get().saveCustomTokenLists();
        },

        loadCustomTokenLists: () => {
          const listRaw = localStorage.getItem('token_lists');
          if (!listRaw) return;

          const urls: string[] = JSON.parse(listRaw);
          urls.forEach((url) => {
            get()
              .addTokenListUrl({
                url: url,
                readonly: false,
              })
              .catch(console.error);
          });
        },

        saveCustomTokenLists: () => {
          const state = get();
          const lists = JSON.stringify(state.tokenListsCustom);
          localStorage.setItem('token_lists', lists);
        },

        initErc20List: async () => {
          // Load default ERC20 token contracts
          const erc20Tokens = ERC20_TOKEN_LIST as TokenList;
          erc20Tokens.readonly = true;
          erc20Tokens.url = 'Default';
          await get().addTokenList(erc20Tokens);

          // Load additional token lists
          for (let i = 0; i < TOKEN_LISTS.length; i++) {
            await get()
              .addTokenListUrl({
                url: TOKEN_LISTS[i],
                readonly: true,
              })
              .catch(console.error);
          }

          get().loadCustomTokenLists();
          get().loadCustomErc20Tokens();
        },

        // NFT management
        whitelistNFT: (id: string) => {
          set((state) => {
            state.nftWhitelist.push(id);
          });
        },

        // Getters
        getNetworkErc20Tokens: () => {
          const state = get();
          const tokens = state.erc20Tokens.concat(state.erc20TokensCustom);
          const chainId = state.evmChainId;

          return tokens.filter((t) => t.data.chainId === chainId);
        },

        findErc20: (contractAddr: string) => {
          const state = get();
          const tokens = state.erc20Tokens.concat(state.erc20TokensCustom);

          for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            if (t.data.address === contractAddr) {
              return t;
            }
          }
          return null;
        },

        getWalletNftDict: () => {
          const state = get();
          const utxos = state.nftUTXOs;
          const res: IWalletNftDict = {};

          for (let i = 0; i < utxos.length; i++) {
            const utxo = utxos[i];
            const assetIdBuff = utxo.getAssetID();
            const assetId = bintools.cb58Encode(assetIdBuff);

            if (res[assetId]) {
              res[assetId].push(utxo);
            } else {
              res[assetId] = [utxo];
            }
          }
          return res;
        },

        getWalletAssetsDict: () => {
          const state = get();
          const networkStore = useNetworkStore.getState();
          const balanceDict = state.balanceDict;
          const assetsDict = state.assetsDict;
          const res: IWalletAssetsDict = {};
          const depositAndBond = networkStore.depositAndBond;

          for (const assetId in assetsDict) {
            const balanceAmt = balanceDict[assetId];
            let asset: AvaAsset;

            if (!balanceAmt) {
              asset = assetsDict[assetId];
              asset.resetBalance();
            } else {
              asset = assetsDict[assetId];
              asset.resetBalance();
              asset.addBalance(balanceAmt.available);
              asset.addBalanceLocked(balanceAmt.locked);
            }

            // Add extras for Native token
            if (asset.id === state.AVA_ASSET_ID) {
              if (depositAndBond) {
                asset.addExtra(get().getWalletPlatformBalanceUnlocked());
                asset.addExtraLocked(
                  get().getWalletPlatformBalanceTotalLocked()
                );
              } else {
                asset.addExtra(get().getWalletPlatformBalance());
                asset.addExtraLocked(get().getWalletPlatformBalanceLocked());
                asset.addExtraLocked(
                  get().getWalletPlatformBalanceLockedStakeable()
                );
                asset.addExtraLocked(get().getWalletStakingBalance());
              }
            }

            res[assetId] = asset;
          }
          return res;
        },

        getWalletAssetsArray: () => {
          const assetsDict = get().getWalletAssetsDict();
          const res: AvaAsset[] = [];

          for (const id in assetsDict) {
            const asset = assetsDict[id];
            res.push(asset);
          }
          return res;
        },

        getWalletAvmUtxoSet: () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return null;
          return wallet.utxoset;
        },

        getNftMintDict: () => {
          const state = get();
          const res: IWalletNftMintDict = {};
          const mintUTXOs = state.nftMintUTXOs;

          for (let i = 0; i < mintUTXOs.length; i++) {
            const utxo: UTXO = mintUTXOs[i];
            const assetId = bintools.cb58Encode(utxo.getAssetID());

            const target = res[assetId];
            if (target) {
              target.push(utxo);
            } else {
              res[assetId] = [utxo];
            }
          }

          // Sort by groupID
          for (const id in res) {
            res[id].sort((a, b) => {
              const idA = (a.getOutput() as NFTMintOutput).getGroupID();
              const idB = (b.getOutput() as NFTMintOutput).getGroupID();
              return idA - idB;
            });
          }
          return res;
        },

        getAssetIds: () => {
          const state = get();
          return state.assets.map((asset) => asset.id);
        },

        getAssetAVA: () => {
          const state = get();
          const walletBalanceDict = get().getWalletAssetsDict();
          const AVA_ASSET_ID = state.AVA_ASSET_ID;

          if (AVA_ASSET_ID !== '' && walletBalanceDict[AVA_ASSET_ID]) {
            return walletBalanceDict[AVA_ASSET_ID];
          }
          return null;
        },

        // Platform balance getters
        getWalletStakingBalance: () => {
          const walletStore = useWalletStore.getState();
          const wallet = walletStore.activeWallet;
          if (!wallet) return new BN(0);
          return wallet.stakeAmount;
        },

        getWalletPlatformBalance: () => {
          const state = get();
          return state.platformBalances.balances[state.AVA_ASSET_ID] ?? ZeroBN;
        },

        getWalletPlatformBalanceUnlocked: () => {
          const state = get();
          return state.platformBalances.unlocked[state.AVA_ASSET_ID] ?? ZeroBN;
        },

        getWalletPlatformBalanceLocked: () => {
          const state = get();
          return state.platformBalances.locked[state.AVA_ASSET_ID] ?? ZeroBN;
        },

        getWalletPlatformBalanceLockedStakeable: () => {
          const state = get();
          return (
            state.platformBalances.lockedStakeable[state.AVA_ASSET_ID] ?? ZeroBN
          );
        },

        getWalletPlatformBalanceTotalLocked: () => {
          const state = get();
          const avaxAssetID = state.AVA_ASSET_ID;
          return (state.platformBalances.deposited[avaxAssetID] ?? ZeroBN)
            .add(state.platformBalances.bonded[avaxAssetID] ?? ZeroBN)
            .add(state.platformBalances.bondedDeposited[avaxAssetID] ?? ZeroBN)
            .add(state.platformBalances.locked[avaxAssetID] ?? ZeroBN)
            .add(state.platformBalances.lockedStakeable[avaxAssetID] ?? ZeroBN);
        },

        getWalletPlatformBalanceDeposited: () => {
          const state = get();
          return state.platformBalances.deposited[state.AVA_ASSET_ID] ?? ZeroBN;
        },

        getWalletPlatformBalanceBonded: () => {
          const state = get();
          return state.platformBalances.bonded[state.AVA_ASSET_ID] ?? ZeroBN;
        },

        getWalletPlatformBalanceBondedDeposited: () => {
          const state = get();
          return (
            state.platformBalances.bondedDeposited[state.AVA_ASSET_ID] ?? ZeroBN
          );
        },
      })),
      {
        name: 'assets-store',
        storage: createAssetsStorage(),
      }
    ),
    { name: 'AssetsStore' }
  )
);

// Selector hooks for stable references (following your established pattern)
export const useAssetsSelectors = () => {
  const balanceLoading = useAssetsStore((state) => state.balanceLoading);
  const assets = useAssetsStore((state) => state.assets);
  const assetsDict = useAssetsStore((state) => state.assetsDict);
  const AVA_ASSET_ID = useAssetsStore((state) => state.AVA_ASSET_ID);
  const platformBalances = useAssetsStore((state) => state.platformBalances);
  const nftFams = useAssetsStore((state) => state.nftFams);
  const erc20Tokens = useAssetsStore((state) => state.getNetworkErc20Tokens());
  const walletAssetsArray = useAssetsStore((state) =>
    state.getWalletAssetsArray()
  );
  const walletAssetsDict = useAssetsStore((state) =>
    state.getWalletAssetsDict()
  );
  const assetAVA = useAssetsStore((state) => state.getAssetAVA());

  return {
    balanceLoading,
    assets,
    assetsDict,
    AVA_ASSET_ID,
    platformBalances,
    nftFams,
    erc20Tokens,
    walletAssetsArray,
    walletAssetsDict,
    assetAVA,
  };
};

// Action hooks for better organization
export const useAssetsActions = () => {
  const {
    onNetworkChange,
    updateWallet,
    updateUTXOs,
    updateUTXOsExternal,
    updateAvaAsset,
    addCustomErc20Token,
    addTokenListUrl,
    removeTokenList,
    initErc20List,
    whitelistNFT,
  } = useAssetsStore();

  return {
    onNetworkChange,
    updateWallet,
    updateUTXOs,
    updateUTXOsExternal,
    updateAvaAsset,
    addCustomErc20Token,
    addTokenListUrl,
    removeTokenList,
    initErc20List,
    whitelistNFT,
  };
};

// Platform balance hooks for easier access
export const usePlatformBalances = () => {
  const walletStakingBalance = useAssetsStore((state) =>
    state.getWalletStakingBalance()
  );
  const walletPlatformBalance = useAssetsStore((state) =>
    state.getWalletPlatformBalance()
  );
  const walletPlatformBalanceUnlocked = useAssetsStore((state) =>
    state.getWalletPlatformBalanceUnlocked()
  );
  const walletPlatformBalanceLocked = useAssetsStore((state) =>
    state.getWalletPlatformBalanceLocked()
  );
  const walletPlatformBalanceDeposited = useAssetsStore((state) =>
    state.getWalletPlatformBalanceDeposited()
  );
  const walletPlatformBalanceBonded = useAssetsStore((state) =>
    state.getWalletPlatformBalanceBonded()
  );

  return {
    walletStakingBalance,
    walletPlatformBalance,
    walletPlatformBalanceUnlocked,
    walletPlatformBalanceLocked,
    walletPlatformBalanceDeposited,
    walletPlatformBalanceBonded,
  };
};
