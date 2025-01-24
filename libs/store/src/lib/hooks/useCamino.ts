import { caminoService } from '../js/CaminoService';

export const useCamino = () => {
  return {
    avalanche: caminoService.getCamino(),
    infoApi: caminoService.getInfoApi(),
    isValidAddress: caminoService.isValidAddress.bind(caminoService),
    stringToAddress: caminoService.stringToAddress.bind(caminoService),
    addressToString: caminoService.addressToString.bind(caminoService),
  };
};
