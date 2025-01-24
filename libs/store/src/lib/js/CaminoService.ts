import { Avalanche as Camino } from '@c4tplatform/caminojs/dist';
import { InfoAPI } from '@c4tplatform/caminojs/dist/apis/info';
import { TestNetworkID } from '@c4tplatform/caminojs/dist/utils';
import BinTools from '@c4tplatform/caminojs/dist/utils/bintools';

class CaminoService {
  private static instance: CaminoService;
  private camino: Camino;
  private infoApi: InfoAPI;
  private bintools: BinTools;

  private constructor() {
    this.camino = new Camino('path.to.nowhere', 0, 'http', TestNetworkID);
    this.infoApi = this.camino.Info();
    this.bintools = BinTools.getInstance();
  }

  static getInstance(): CaminoService {
    if (!CaminoService.instance) {
      CaminoService.instance = new CaminoService();
    }
    return CaminoService.instance;
  }

  updateConnection(
    ip: string,
    port: number,
    protocol: string,
    networkId: number = TestNetworkID
  ) {
    this.camino = new Camino(ip, port, protocol, networkId);
    this.infoApi = this.camino.Info();
  }

  getCamino(): Camino {
    return this.camino;
  }

  getInfoApi(): InfoAPI {
    return this.infoApi;
  }

  isValidAddress(addr: string): boolean {
    try {
      this.bintools.stringToAddress(addr);
      return true;
    } catch {
      return false;
    }
  }

  stringToAddress(str: string): Uint8Array {
    return this.bintools.stringToAddress(str);
  }

  addressToString(addr: Uint8Array): string {
    return this.bintools.addressToString(addr);
  }
}

export const caminoService = CaminoService.getInstance();
