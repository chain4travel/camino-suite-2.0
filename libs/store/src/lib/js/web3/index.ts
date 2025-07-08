import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import ERC721Abi from '../abi/IERC721MetaData.json';
import ERC20Abi from '../abi/IERC20.json';
// @ts-ignore
import abiDecoder from 'abi-decoder';

abiDecoder.addABI(ERC721Abi);
abiDecoder.addABI(ERC20Abi);

const rpcUrl = `https://api.avax.network/ext/bc/C/rpc`;

const web3 = new Web3(rpcUrl);

export { web3, Contract, abiDecoder };
export type { AbiItem };
