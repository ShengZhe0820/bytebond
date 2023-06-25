<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-card width="600">
        <template v-slot:title>
          <v-row>
            <v-col align="left">
              Swap Coins
            </v-col>
            <v-col cols="auto">
              <v-img
                width="50"
                src="https://styles.redditmedia.com/t5_56nsub/styles/communityIcon_nwmqga58seb91.png"
              ></v-img>
            </v-col>
          </v-row>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col>
              <v-text-field label="Amount"
                            type="number"
                            v-model="fromAmt"
                            variant="underlined"
                            placeholder="0.0" hide-details>
              </v-text-field>
            </v-col>
            <v-col>
              <v-select v-model="formToken" :items="tokens" label="From"></v-select>
            </v-col>

          </v-row>
          <v-row justify="center">
            <v-icon icon="mdi-swap-vertical-bold"></v-icon>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field label="Amount"
                            type="number"
                            variant="underlined"
                            :model-value="toAmt"
                            hide-details>
              </v-text-field>
            </v-col>
            <v-col>
              <v-select v-model="toToken" :items="tokens" label="To"></v-select>
            </v-col>

          </v-row>
        </template>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn @click="submitSwap">Swap Coins</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

  </v-container>
  <v-card class="mt-2">
    <v-card-title>Trade Records</v-card-title>
    <v-data-table
      :headers="headers as any"
      :items="records"
      class="elevation-1"
    >
    </v-data-table>
  </v-card>

</template>

<script lang="ts">

import {computed, ref} from "vue";
import {useWalletStore} from "@/store/wallet";

export default {
  name: "swap",
  props: {
    records: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const headers = [
      {
        title: 'ID',
        align: 'center',
        sortable: false,
        key: 'id',

      },
      {
        title: 'From Token',
        sortable: false,
        key: 'fSym',
      }, {
        title: 'To Token',
        sortable: false,
        key: 'tSym',
      },
      {
        title: 'Amount',
        sortable: false,
        key: 'amt',
      },
      {
        title: 'Created Date',
        sortable: false,
        key: 'date',
      },
    ];
    const tokens = ['HBAR', 'SAUCE', 'CLXY', 'HST', 'LUCKY']

    const formToken = ref("")
    const toToken = ref("")
    const fromAmt = ref(0)
    const toAmt = computed(() => {
      return fromAmt.value * 123.82923;
    });
    const walletStore = useWalletStore();
    const submitSwap = () => {
      walletStore.submitTransaction().then(() => {
        props.records.push({
          id: (props.records.length + 1).toLocaleString(),
          fSym: formToken,
          tSym: toToken,
          amt: Number(fromAmt.value),
          date: (new Date()).toISOString()
        })
      })
    }
    return {headers, tokens, formToken, toToken, fromAmt, toAmt, submitSwap}
  }
}
</script>

<style scoped>

</style>
