<template>
  <h2>Trader List</h2>
  <v-container class="text-center">
<<<<<<< Updated upstream
    <v-data-table :headers="headers as any" :items="traders" class="elevation-1">
=======
    <v-data-table :headers="headers as any" :items="demo_eligible_traders" class="elevation-1">
>>>>>>> Stashed changes
      <template v-slot:item.level="{ item }">
        <div>{{ item.columns.level.name }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn :disabled="item.raw.status === TraderStatus.TAKEN || item.raw.status === TraderStatus.HIRED" size="small"
          class="me-2" @click="fundTrader(item.raw)">
          Fund
        </v-btn>
      </template>
    </v-data-table>

    <FundTraderDialog :trader="editedItem" :dialog="dialog" @close="closeDialog" @fundTrader="saveFundTrader" />
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";
import FundTraderDialog from "@/components/FundTraderDialog.vue";
import { TraderLevels, TraderStatus } from "../../enum";
import { ContractCreateFlow, ContractFunctionParameters, AccountId, ContractCreateTransaction, FileCreateTransaction } from "@hashgraph/sdk";
import { useWalletStore } from "@/store/wallet";
import { storeToRefs } from "pinia";
import { hethers } from '@hashgraph/hethers';
import fs from 'fs/promises';
import internal from "stream";

export default {
  name: "delegate",
  computed: {
    TraderStatus() {
      return TraderStatus
    }
  },
  components: { FundTraderDialog },
  setup() {
    const headers = [
      [
        {
          title: 'Trader',
          align: 'center',
          sortable: false,
          key: 'tA',
          rowspan: 2,

        },
        {
          title: 'Performance',
          sortable: false,
          key: 'foo',
          colspan: 3,
        },
      ],
      [{
        title: 'ROI',
        align: 'end',
        key: 'roi'
      }, {
        title: 'Win Rate',
        align: 'end',
        key: 'wR'
      }, {
        title: 'Max Drawdown',
        align: 'end',
        key: 'mDD'
      }, {
        title: 'Level',
        align: 'end',
        key: 'level'
      }, {
        title: 'Status',
        sortable: false,
        align: 'center',
        key: 'status',

      }, {
        title: 'Actions',
        align: 'end',
        sortable: false,
        key: 'actions',
      },
      ]
    ];
    const store = useAppStore()
    const { traders } = storeToRefs(store);
    const dialog = ref<boolean>(false);
    let editedIndex = ref<number>(-1);
    let editedItem = ref<any>({});

    const fundTrader = (item: any) => {
      editedItem.value = item
      console.log(editedItem)
      dialog.value = true
    }

    const closeDialog = () => {
      dialog.value = false
    };

    const saveFundTrader = async () => {
      try {

        const json_data = await import("@/contract_abi/funder_trader.json")
        const bytecodeString = json_data.data.bytecode.object;

        const store = useWalletStore();
        const { connectedAccount, hashConnect } = storeToRefs(store);

        const provider = hashConnect.value.getProvider(store.pairingData.network, store.pairingData.topic, connectedAccount.value);
        const signer = hashConnect.value.getSigner(provider);

        const myAccountId = AccountId.fromString(connectedAccount.value);
        const traderId = AccountId.fromString(editedItem.value.tA);
        // Get contract file
        const fileCreateTx = new FileCreateTransaction()
          .freezeWithSigner(signer);

        let res = (await fileCreateTx).executeWithSigner(signer);
        let receipt = await (await res).getReceiptWithSigner(signer);
        console.log(receipt);
      } catch (error) {
        console.error("There was an error creating the contract", error);
      }
    };
    return { headers, demo_eligible_traders, fundTrader, dialog, editedItem, closeDialog, saveFundTrader }
  }
}
</script>

<style scoped></style>
