// @ts-nocheck
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Buffer as BufferAvalanche } from '@c4tplatform/caminojs/dist';
import { MultisigAliasReply } from '@c4tplatform/caminojs/dist/apis/platformvm';
import { privateToAddress } from '@ethereumjs/util';
import createHash from 'create-hash';

// Import wallet types and classes
import { WalletType, HotWalletType, INetwork } from '../../js/wallets/types';
import MnemonicWallet from '../../js/wallets/MnemonicWallet';
import { LedgerWallet } from '../../js/wallets/LedgerWallet';
import { SingletonWallet } from '../../js/wallets/SingletonWallet';
// import { MultisigWallet } from '../../wallets/MultisigWallet';
import { AllKeyFileDecryptedTypes } from '../../js/IKeystore';
import {
  extractKeysFromDecryptedFile,
  KEYSTORE_VERSION,
  makeKeyfile,
  readKeyFile,
} from '../../js/Keystore';
import {
  IssueBatchTxInput,
  ImportKeyfileInput,
  ExportWalletsInput,
  AccessWalletMultipleInput,
  AccessWalletMultipleInputParams,
  priceDict,
} from '../../types/wallet.types';
import { ava, bintools } from '../../js/AVA';
import { updateFilterAddresses } from '../../providers';
import { getAvaxPriceUSD } from '../../helpers/price_helper';
import { useNetworkStore } from '../network/networkStore';
import { useAssetsStore } from '../assets/assetsStore';

// Wallet State Interface
export interface WalletState {
  // Core authentication state
  isAuth: boolean;

  // Active wallet management
  activeWallet: WalletType | null;
  storedActiveWallet: WalletType | null;
  address: string | null; // current active derived address

  // Wallet collections
  wallets: WalletType[];
  volatileWallets: WalletType[]; // will be forgotten when tab is closed

  // State flags
  warnUpdateKeyfile: boolean; // If true will prompt user to export new keyfile
  walletsDeleted: boolean;

  // Price data
  prices: priceDict;

  // Network reference (for compatibility)
  network: { name: string };
}

// Wallet Actions Interface
export interface WalletActions {
  // Core authentication actions
  accessWallet: (mnemonic: string) => Promise<MnemonicWallet>;
  accessWalletMultiple: (
    params: AccessWalletMultipleInputParams
  ) => Promise<void>;
  accessWalletLedger: (wallet: LedgerWallet) => Promise<void>;
  accessWalletSingleton: (key: string) => Promise<void>;
  onAccess: (wallet?: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  timeoutLogout: () => Promise<void>;

  // Wallet management actions
  addWalletMnemonic: (params: {
    key?: string;
    file?: AccessWalletMultipleInput;
  }) => Promise<MnemonicWallet | SingletonWallet | null>;
  addWalletSingleton: (params: {
    key?: string;
    file?: AccessWalletMultipleInput;
  }) => Promise<SingletonWallet | null>;
  addWalletsMultisig: (params: {
    keys?: string[];
    file?: AccessWalletMultipleInput;
  }) => Promise<MultisigWallet[] | null>;
  removeWallet: (wallet: WalletType) => void;
  updateMultisigWallets: () => void;
  removeAllKeys: () => Promise<void>;

  // Wallet operations
  activateWallet: (wallet: MnemonicWallet | LedgerWallet) => void;
  issueBatchTx: (data: IssueBatchTxInput) => Promise<string>;

  // Import/Export
  importKeyfile: (
    data: ImportKeyfileInput
  ) => Promise<{ success: boolean; message: string }>;
  exportWallets: (input: ExportWalletsInput) => Promise<void>;

  // Utilities
  updateAvaxPrice: () => Promise<void>;
  updateTransaction: (options: {
    fullHistory?: boolean;
    onlyMultisig?: boolean;
    withMultisig?: boolean;
    withDeposit?: boolean;
    msgType?: 'success' | 'error' | 'warning';
    msgTitle?: string;
    msgText?: string;
  }) => void;
  updateBalances: () => void;

  // Mutations (converted from Vuex mutations)
  updateActiveAddress: () => void;
  setActiveWallet: (wallet: WalletType | null) => void;
  setNetwork: (network: INetwork) => void;

  // Getters (converted from Vuex getters)
  getAddresses: () => string[];
  getStaticAddresses: (chain: string) => string[];
  getAccountChanged: () => boolean;
}

type WalletStore = WalletState & WalletActions;

// Initial state
const initialState: WalletState = {
  isAuth: false,
  activeWallet: null,
  storedActiveWallet: null,
  address: null,
  wallets: [],
  volatileWallets: [],
  warnUpdateKeyfile: false,
  walletsDeleted: false,
  prices: {
    usd: 0,
  },
  network: { name: '' },
};

export const useWalletStore = create<WalletStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Core authentication actions
      accessWallet: async (mnemonic: string) => {
        const wallet = await get().addWalletMnemonic({ key: mnemonic });
        if (wallet) {
          get().setActiveWallet(wallet);
          await get().onAccess();
        }
        return wallet as MnemonicWallet;
      },

      accessWalletMultiple: async ({
        keys: keyList,
        activeIndex,
      }: AccessWalletMultipleInputParams) => {
        const state = get();

        for (let i = 0; i < keyList.length; i++) {
          try {
            const keyInfo = keyList[i];
            if (keyInfo.type === 'mnemonic') {
              await get().addWalletMnemonic({ file: keyInfo });
            } else if (keyInfo.type === 'singleton') {
              await get().addWalletSingleton({ file: keyInfo });
            } else {
              await get().addWalletsMultisig({ file: keyInfo });
            }
          } catch (e) {
            continue;
          }
        }

        const currentState = get();
        if (activeIndex >= keyList.length) activeIndex = 0;
        get().setActiveWallet(currentState.wallets[activeIndex]);
        await get().onAccess(currentState.wallets[activeIndex]);
        get().updateMultisigWallets();
      },

      accessWalletLedger: async (wallet: LedgerWallet) => {
        set((state) => {
          state.wallets = [wallet];
        });
        get().setActiveWallet(wallet);
        await get().onAccess();
      },

      accessWalletSingleton: async (key: string) => {
        const wallet = await get().addWalletSingleton({ key });
        if (wallet) {
          get().setActiveWallet(wallet);
          await get().onAccess();
        }
      },

      onAccess: async (wallet?: WalletType) => {
        set((state) => {
          state.isAuth = true;
        });
        // Dispatch to other modules would happen here
        // For now, we'll just activate the wallet
        const currentState = get();
        const activeWallet = wallet || currentState.activeWallet;
        if (activeWallet) {
          console.log('Wallet accessed:', activeWallet);
          get().activateWallet(activeWallet as MnemonicWallet | LedgerWallet);
        }
      },

      logout: async () => {
        set((state) => {
          state.wallets = [];
          state.volatileWallets = [];
          state.activeWallet = null;
          state.storedActiveWallet = null;
          state.address = null;
          state.isAuth = false;
        });

        // Dispatch logout to other modules would happen here
        // dispatch('Accounts/onLogout')
        // dispatch('Assets/onLogout')
        // dispatch('Launch/onLogout')
      },

      timeoutLogout: async () => {
        // Add notification would happen here
        // dispatch('Notifications/add', { ... })
        await get().logout();
      },

      // Wallet management actions
      addWalletMnemonic: async ({ key, file }) => {
        const state = get();

        // Cannot add mnemonic wallets on ledger mode
        if (state.activeWallet?.type === 'ledger') return null;

        // Get mnemonic either from key or from file
        const mnemonic = file ? file.key : (key as string);
        const accountHash = createHash('sha256').update(mnemonic).digest();

        // Split mnemonic and seed hash
        const mParts = mnemonic.split('\n');

        // Make sure wallet doesn't exist already
        for (const w of state.wallets) {
          if (
            w.type === 'mnemonic' &&
            (w as any).accountHash &&
            (w as any).accountHash.equals(accountHash)
          ) {
            throw new Error('Wallet already exists.');
          }
        }

        const wallet = new SingletonWallet('', mParts[0], mParts[1]);
        if (file?.name) wallet.name = file.name;
        (wallet as any).accountHash = accountHash;

        set((state) => {
          state.wallets.push(wallet);
          state.volatileWallets.push(wallet);
        });

        if (!file) get().updateMultisigWallets();
        return wallet;
      },

      addWalletSingleton: async ({ key, file }) => {
        const state = get();
        let pk = file ? file.key : (key as string);
        const accountHash = createHash('sha256').update(pk).digest();

        try {
          const keyBuf = Buffer.from(pk, 'hex');
          privateToAddress(keyBuf);
          pk = `PrivateKey-${bintools.cb58Encode(
            BufferAvalanche.from(keyBuf)
          )}`;
        } catch (e) {
          // Handle error silently
        }

        // Cannot add singleton wallets on ledger mode
        if (state.activeWallet?.type === 'ledger') return null;

        // Make sure wallet doesn't exist already
        for (const w of state.wallets) {
          if (
            w.type === 'singleton' &&
            (w as any).accountHash &&
            w.accountHash === accountHash
          ) {
            throw new Error('Wallet already exists.');
          }
        }

        const wallet = new SingletonWallet(pk);
        if (file?.name) wallet.name = file.name;
        (wallet as any).accountHash = accountHash;

        set((state) => {
          state.wallets.push(wallet);
          state.volatileWallets.push(wallet);
        });

        // if (!file) get().updateMultisigWallets();
        return wallet;
      },

      addWalletsMultisig: async ({ keys, file }) => {
        const state = get();

        // Cannot add multisig wallets on ledger mode
        if (state.activeWallet?.type === 'ledger') return null;

        if (file) {
          const wallet = new MultisigWallet();
          if (file.name) wallet.name = file.name;
          (wallet as any).accountHash = createHash('sha256')
            .update(file.key)
            .digest();
          wallet.setKey(file.key);

          set((state) => {
            state.wallets.push(wallet);
            state.volatileWallets.push(wallet);
          });

          return [wallet];
        }

        const wallets: MultisigWallet[] = [];
        const staticAddresses = get().getStaticAddresses('P');

        for (const alias of keys as string[]) {
          let response: MultisigAliasReply;
          try {
            response = await ava.PChain().getMultisigAlias(alias);
          } catch (e) {
            continue;
          }

          const aliasBuffer = bintools.stringToAddress(alias);

          // Make sure wallet doesn't exist already
          for (const wallet of state.wallets) {
            if (wallet.type === 'multisig') {
              if (
                (wallet as MultisigWallet).alias().compare(aliasBuffer) === 0
              ) {
                throw new Error('Wallet already exists.');
              }
            }
          }

          // Check that we have at least one staticAddress in owner
          if (
            !response.addresses.some((address) =>
              staticAddresses.includes(address)
            )
          ) {
            continue;
          }

          const wallet = new MultisigWallet(
            aliasBuffer,
            response.memo,
            response
          );
          (wallet as any).accountHash = createHash('sha256')
            .update(wallet.getKey())
            .digest();
          wallets.push(wallet);

          set((state) => {
            state.wallets.push(wallet);
            state.volatileWallets.push(wallet);
          });
        }

        get().updateMultisigWallets();
        return wallets;
      },

      removeWallet: (wallet: WalletType) => {
        set((state) => {
          const index = state.wallets.indexOf(wallet);
          if (index >= 0) {
            state.wallets.splice(index, 1);
            state.walletsDeleted = true;
          }

          const volatileIndex = state.volatileWallets.indexOf(wallet);
          if (volatileIndex >= 0) {
            state.volatileWallets.splice(volatileIndex, 1);
          }
        });

        // Commit to accounts module would happen here
        // commit('Accounts/deleteKey', wallet)
        get().updateMultisigWallets();
      },

      removeAllKeys: async () => {
        const state = get();
        const wallets = [...state.wallets];

        while (wallets.length > 0) {
          const wallet = wallets[0];
          get().removeWallet(wallet);
          wallets.shift();

          // Add notification would happen here
          // dispatch('Notifications/add', { ... })
        }

        set((state) => {
          state.wallets = [];
          state.volatileWallets = [];
        });
      },

      updateMultisigWallets: () => {
        const state = get();
        state.wallets.forEach((w) => {
          if (w instanceof MultisigWallet) {
            w.updateWallets(state.wallets);
          }
        });
      },

      // Wallet operations
      issueBatchTx: async (data: IssueBatchTxInput) => {
        const state = get();
        const wallet = state.activeWallet;
        if (!wallet) return 'error';

        const txId: string = await wallet.issueBatchTx(
          data.chainId,
          data.orders,
          data.toAddress,
          data.memo
        );
        return txId;
      },

      activateWallet: async (wallet: MnemonicWallet | LedgerWallet) => {
        if (wallet) {
          wallet.initialize();
          get().setActiveWallet(wallet);
          get().updateActiveAddress();
        }

        // Add the missing asset updates using dynamic import
        const updateAssets = async () => {
          try {
            const assetsStore = useAssetsStore.getState();

            assetsStore.updateWallet();
            await assetsStore.updateAvaAsset();

            // TODO: Add Accounts KYC update when that module is converted
            // dispatch('Accounts/updateKycStatus')

            await assetsStore.updateUTXOs();
            console.log(
              'balance before in dunction:',
              wallet.ethBalance.toString()
            );
            // ← This loads the funds!
            console.log('Assets updated after wallet activation');
          } catch (error) {
            console.warn(
              'Failed to update assets on wallet activation:',
              error
            );
          }
        };
        console.log('balance before:', wallet.ethBalance.toString());
        // Execute the async asset updates
        await updateAssets();
        console.log('balance after:', wallet.ethBalance.toString());
        console.log('Wallet activated Balance:', wallet.ethBalance.toString());
        updateFilterAddresses();
      },

      // Import/Export
      exportWallets: async (input: ExportWalletsInput) => {
        const state = get();
        try {
          const pass = input.password;
          const wallets = input.wallets;
          const wallet = state.activeWallet as
            | MnemonicWallet
            | SingletonWallet
            | null;
          if (!wallet) throw new Error('No active wallet.');

          const activeIndex = wallets.findIndex((w) => w.id === wallet.id);
          const fileData = await makeKeyfile(wallets, pass, activeIndex);

          // Download the file
          const text = JSON.stringify(fileData);
          const utcDate = new Date();
          const dateString = utcDate.toISOString().replace(' ', '_');
          const filename = `NATIVE_${dateString}.json`;

          const blob = new Blob([text], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const element = document.createElement('a');

          element.setAttribute('href', url);
          element.setAttribute('download', filename);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        } catch (e) {
          // Add notification would happen here
          // dispatch('Notifications/add', { ... })
          throw e;
        }
      },

      importKeyfile: async (data: ImportKeyfileInput) => {
        const state = get();
        const pass = data.password;
        const fileData = data.data;
        const version = fileData.version;

        // Decrypt the key file with the password
        const keyFile: AllKeyFileDecryptedTypes = await readKeyFile(
          fileData,
          pass
        );
        // Extract wallet keys
        const keys = extractKeysFromDecryptedFile(keyFile);

        // If not auth, login user then add keys
        if (!state.isAuth) {
          await get().accessWalletMultiple({
            keys,
            activeIndex: keyFile.activeIndex,
          });
        } else {
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (key.type === 'mnemonic') {
              await get().addWalletMnemonic({ file: key });
            } else if (key.type === 'singleton') {
              await get().addWalletSingleton({ file: key });
            } else if (key.type === 'multisig') {
              await get().addWalletsMultisig({ file: key });
            }
          }
        }

        set((state) => {
          // Keystore warning flag asking users to update their keystore files
          state.warnUpdateKeyfile = version !== KEYSTORE_VERSION;
          state.volatileWallets = [];
        });

        return {
          success: true,
          message: 'success',
        };
      },

      // Utilities
      updateAvaxPrice: async () => {
        const usd = await getAvaxPriceUSD();
        set((state) => {
          state.prices = { usd };
        });
      },

      updateTransaction: (options) => {
        // This would dispatch to other modules
        // Implementation depends on how you handle other store modules
        if (options.onlyMultisig) {
          setTimeout(() => {
            // dispatch('Signavault/updateTransaction').then(() => {
            //   dispatch('History/updateMultisigTransactionHistory')
            // })
          }, 3000);
        } else if (options.withMultisig) {
          setTimeout(() => {
            // dispatch('Assets/updateUTXOs').then(() => { ... })
          }, 3000);
        } else {
          setTimeout(() => {
            // dispatch('Assets/updateUTXOs').then(() => { ... })
          }, 3000);
        }

        if (options.msgType) {
          // Add notification would happen here
          // dispatch('Notifications/add', { ... })
        }
      },

      updateBalances: () => {
        // This would dispatch to other modules
        // dispatch('Assets/updateUTXOs').then(() => { ... })
      },

      // Mutations (converted from Vuex mutations)
      updateActiveAddress: () => {
        set((state) => {
          if (!state.activeWallet) {
            state.address = null;
          } else {
            const addrNow = state.activeWallet.getCurrentAddressAvm();
            state.address = addrNow;
            // Update the websocket addresses
            updateFilterAddresses();
          }
        });
      },

      setActiveWallet: (wallet: WalletType | null) => {
        set((state) => {
          state.activeWallet = wallet;
          if (!state.storedActiveWallet) {
            state.storedActiveWallet = wallet;
          }
        });
      },

      setNetwork: (net: INetwork) => {
        set((state) => {
          state.network = net;
        });
      },

      // Getters (converted from Vuex getters)
      getAddresses: () => {
        const state = get();
        const wallet = state.activeWallet;
        if (!wallet) return [];
        return wallet.getAllAddressesX();
      },

      getStaticAddresses: (chain: string) => {
        const state = get();
        return state.wallets
          .map((w) => w.getStaticAddress(chain as any))
          .filter((e) => e !== '');
      },

      getAccountChanged: () => {
        const state = get();
        return (
          state.volatileWallets.length > 0 ||
          state.warnUpdateKeyfile ||
          state.walletsDeleted ||
          state.activeWallet !== state.storedActiveWallet
        );
      },
    })),
    { name: 'WalletStore' }
  )
);

// Selector hooks for stable references (following your network store pattern)
export const useWalletSelectors = () => {
  const isAuth = useWalletStore((state) => state.isAuth);
  const activeWallet = useWalletStore((state) => state.activeWallet);
  const address = useWalletStore((state) => state.address);
  const wallets = useWalletStore((state) => state.wallets);
  const addresses = useWalletStore((state) => state.getAddresses());
  const accountChanged = useWalletStore((state) => state.getAccountChanged());

  return {
    isAuth,
    activeWallet,
    address,
    wallets,
    addresses,
    accountChanged,
  };
};

// Action hooks for better organization
export const useWalletActions = () => {
  const {
    accessWallet,
    accessWalletMultiple,
    accessWalletLedger,
    accessWalletSingleton,
    logout,
    addWalletMnemonic,
    addWalletSingleton,
    removeWallet,
    importKeyfile,
    exportWallets,
    activateWallet,
    updateAvaxPrice,
  } = useWalletStore();

  return {
    accessWallet,
    accessWalletMultiple,
    accessWalletLedger,
    accessWalletSingleton,
    logout,
    addWalletMnemonic,
    addWalletSingleton,
    removeWallet,
    importKeyfile,
    exportWallets,
    activateWallet,
    updateAvaxPrice,
  };
};
