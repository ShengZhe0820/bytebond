<template>
  <h2>Trader List</h2>
  <v-container class="text-center">
    <v-data-table
      :headers="headers as any"
      :items="traders"
      class="elevation-1"
    >
      <template v-slot:item.level="{ item }">
        <div>{{ item.columns.level.name }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          :disabled="item.raw.status === TraderStatus.TAKEN || item.raw.status === TraderStatus.HIRED"
          size="small"
          class="me-2"
          @click="fundTrader(item.raw)"
        >
          Fund
        </v-btn>
      </template>
    </v-data-table>

    <FundTraderDialog :trader="editedItem" :dialog="dialog" @close="closeDialog" @fundTrader="saveFundTrader"/>
  </v-container>

</template>

<script lang="ts">
import {ref} from "vue";
import FundTraderDialog from "@/components/FundTraderDialog.vue";
import {TraderStatus} from "../../enum";
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {Trader} from "../../types";

export default {
  name: "delegate",
  computed: {
    TraderStatus() {
      return TraderStatus
    }
  },
  components: {FundTraderDialog},
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
    const {traders} = storeToRefs(store);
    const dialog = ref<boolean>(false);
    let editedItem = ref<Trader>({} as Trader);
    const fundTrader = (item: any) => {
      editedItem.value = item
      console.log(editedItem)
      dialog.value = true
    }
    const closeDialog = () => {
      dialog.value = false
    };
    const saveFundTrader = () => {
      store.hireTrader(editedItem.value)
      dialog.value = false
    };
    return {headers, traders, fundTrader, dialog, editedItem, closeDialog, saveFundTrader}
  }
}
</script>

<style scoped>

</style>
