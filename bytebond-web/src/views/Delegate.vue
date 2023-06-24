<template>
  <v-container class="text-center">
    <v-data-table
      :headers="headers as any"
      :items="demo_eligible_traders"
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
import {TraderLevels, TraderStatus} from "../../enum";

export default {
  name: "delegate",
  computed: {
    TraderStatus() {
      return TraderStatus
    }
  },
  components: {FundTraderDialog},
  setup() {
    const demo_eligible_traders = ref<any>([
      {
        'tA': "0.0.1232478",
        'level': TraderLevels.ELITE,
        'roi': "20%",
        'wR': '50%',
        'mDD': '20%',
        'status': TraderStatus.TAKEN
      },
      {
        'tA': "0.0.1459123",
        'level': TraderLevels.ADVANCED,
        'roi': "40%",
        'wR': '45%',
        'mDD': '10%',
        'status': TraderStatus.HIRED
      },
      {
        'tA': "0.0.1423428",
        'level': TraderLevels.NOVICE,
        'roi': "5%",
        'wR': '70%',
        'mDD': '2%',
        'status': TraderStatus.VERIFIED
      }
    ])
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
    const dialog = ref<boolean>(false);
    let editedIndex = ref<number>(-1);
    let editedItem = ref<any>({});
    const fundTrader = (item: any) => {
      editedIndex.value = demo_eligible_traders.value.indexOf(item)
      editedItem.value = item
      console.log(editedItem)
      dialog.value = true
    }
    const closeDialog = () => {
      dialog.value = false
    };
    const saveFundTrader = () => {
      editedItem.value.status = TraderStatus.HIRED
      dialog.value = false
    };
    return {headers, demo_eligible_traders, fundTrader, dialog, editedItem, closeDialog, saveFundTrader}
  }
}
</script>

<style scoped>

</style>
