<template>
  <v-container class="text-center">
    <v-data-table
      :headers="headers as any"
      :items="demo_eligible_traders"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          size="small"
          class="me-2"
          @click="fundTrader(item.raw)"
        >
          Fund
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import {ref} from "vue";

export default {
  name: "delegate",
  setup() {
    const demo_eligible_traders = [
      {'tA': "0.0.1232478", 'roi': "20%", 'aS': '10000USDT', 'wR': '50%', 'mDD': '20%'},
      {'tA': "0.0.1459123", 'roi': "40%", 'aS': '1000USDT', 'wR': '45%', 'mDD': '10%'},
      {'tA': "0.0.1423428", 'roi': "5%", 'aS': '1000000USDT', 'wR': '70%', 'mDD': '2%'}
    ]
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
          title: 'Challenge Performance',
          sortable: false,
          key: 'foo',
          colspan: 4,
        },

      ],
      [{
        title: 'ROI',
        align: 'end',
        key: 'roi'
      }, {
        title: 'Account Size',
        align: 'end',
        key: 'aS'
      }, {
        title: 'Win Rate',
        align: 'end',
        key: 'wR'
      }, {
        title: 'Max Drawdown',
        align: 'end',
        key: 'mDD'
      }, {
        title: 'Actions',
        align: 'end',
        sortable: false,
        key: 'actions',
      },]
    ];
    const dialog = ref<boolean>(false);
    let editedIndex = ref<number>(-1);
    let editedItem = ref<any>({});
    const fundTrader = (item: any) => {
      editedIndex.value = demo_eligible_traders.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }
    return {headers, demo_eligible_traders, fundTrader, dialog}
  }
}
</script>

<style scoped>

</style>
