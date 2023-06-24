import {defineStore} from "pinia";
import {HashConnect, HashConnectTypes, MessageTypes} from 'hashconnect';
global = globalThis

interface State {
  initData: HashConnectTypes.InitilizationData
  hashConnect: HashConnect
  pairingData: MessageTypes.ApprovePairing
  isReadyToConnect: Boolean
}

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    initData: {} as HashConnectTypes.InitilizationData,
    hashConnect: {} as HashConnect,
    pairingData: {} as MessageTypes.ApprovePairing,
    isReadyToConnect: false
  }),
  getters: {
    connectedAccount(state) {
      if ('accountIds' in this.pairingData) {
        return state.pairingData.accountIds[0]
      }
      return ''
    }
  },
  actions: {
    async initHashConnect() {
      const appMetadata = {
        name: "dApp Example",
        description: "An example hedera dApp",
        icon: "https://absolute.url/to/icon.png"
      }
      this.hashConnect = new HashConnect();
      this.initData = await this.hashConnect.init(appMetadata, "testnet", false)
      if ('savedPairings' in this.initData && this.initData['savedPairings'].length > 0) {
        this.setAcc(this.initData['savedPairings'][0])
      }

      this.hashConnect.foundExtensionEvent.once((walletMetadata) => {
        // @ts-ignore
        this.setIsReadyToConnect(true);
      })

      this.hashConnect.pairingEvent.once((pairingData) => {
        this.setAcc(pairingData)
      })

    },

    async connectWallet() {
      this.hashConnect.connectToLocalWallet();
    },

    disconnectWallet() {
      this.hashConnect.disconnect(this.initData.topic).then(() => {
        this.clearAcc()
      })

    },
    setAcc(pairingData: MessageTypes.ApprovePairing) {
      this.pairingData = pairingData;
    },
    setIsReadyToConnect(value: Boolean) {
      this.isReadyToConnect = value
    },
    clearAcc() {
      this.pairingData = {} as MessageTypes.ApprovePairing
    }
  }
});
