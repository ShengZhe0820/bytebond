import {defineStore} from "pinia";
import {HashConnect, HashConnectTypes, MessageTypes} from 'hashconnect';
import {ContractExecuteTransaction, FileCreateTransaction, AccountId, ContractId, ContractFunctionParameters} from "@hashgraph/sdk";

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

    async createContract() {
      const provider = this.hashConnect.getProvider(this.pairingData.network, this.pairingData.topic, this.connectedAccount);
      const signer = this.hashConnect.getSigner(provider);

      // Get contract file
      const fileCreateTx = new FileCreateTransaction()
        .freezeWithSigner(signer);

      let res = await (await fileCreateTx).executeWithSigner(signer)
    },
    async submitTransaction() {
      const contractId = ContractId.fromString("0.0.14978015");
      const provider = this.hashConnect.getProvider(this.pairingData.network, this.pairingData.topic, this.connectedAccount);
      const signer = this.hashConnect.getSigner(provider);

      // Get contract file
      const contractCallTx = new ContractExecuteTransaction()
        .setGas(10000000)
        .setContractId(contractId)
        .setFunction(
          "set_message", new ContractFunctionParameters()
          .addString('hello_world')
        )
        .freezeWithSigner(signer);

      let res = await (await contractCallTx).executeWithSigner(signer)
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
