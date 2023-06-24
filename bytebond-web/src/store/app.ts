// Utilities
import {defineStore} from 'pinia'
import {Agreement, Trader} from "../../types";
import {AgreementStatus, TraderStatus} from "../../enum";
import {Demo_Agreement, Demo_Eligible_Trader} from "../../data";

interface State {
  agreements: Agreement[];
  traders: Trader[]
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    agreements: [...Demo_Agreement],
    traders: [...Demo_Eligible_Trader]
  }),

  actions: {
    hireTrader(trader: Trader) {
      trader.status = TraderStatus.HIRED
      this.agreements.push({
        'tA': trader.tA,
        'cA': '0xadkj4kfgoecwes1f',
        'uPL': "0%",
        'rPL': "0%",
        'nT': 0,
        status: AgreementStatus.ACTIVE
      })
    },
    terminateTrader(agreement: Agreement) {
      agreement.status = AgreementStatus.TERMINATED
      const trader = this.traders.find(t => t.tA === agreement.tA)
      if (trader) {
        trader.status = TraderStatus.VERIFIED
      }
    }
  }
})
