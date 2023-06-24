<template>
  <v-container class="text-center">
    <v-data-table
      :headers="headers as any"
      :items="agreements"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          :disabled="item.raw.status === AgreementStatus.TERMINATED"
          size="small"
          class="me-2"
          @click="deleteTrader(item.raw)"
        >
          Terminate
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {AgreementStatus} from "../../enum";
import {useWalletStore} from "@/store/wallet";
import {Agreement} from "../../types";

export default {
  name: "dashboard",
  computed: {
    AgreementStatus() {
      return AgreementStatus
    }
  },
  setup() {
    const headers = [
      {
        title: 'Trader Address',
        align: 'center',
        sortable: false,
        key: 'tA',
      },
      {
        title: 'Contract Address',
        align: 'center',
        sortable: false,
        key: 'cA',
      },
      {
        title: 'Unrealised P/L',
        align: 'center',
        sortable: false,
        key: 'uPL',
      },
      {
        title: 'Realised P/L',
        align: 'center',
        sortable: false,
        key: 'rPL',
      }, {
        title: 'Number of trades',
        align: 'center',
        sortable: false,
        key: 'nT',
      }, {
        title: 'Actions',
        align: 'end',
        sortable: false,
        key: 'actions',
      }
    ];
    const appStore = useAppStore()
    const {agreements} = storeToRefs(appStore);
    const walletStore = useWalletStore();
    const deleteTrader = (trader: Agreement) => {
      walletStore.submitTransaction().then(() => {
        appStore.terminateTrader(trader)
      })
    }
    return {headers, agreements, deleteTrader}
  },
}
</script>

<style scoped>

</style>
