<template>
  <v-dialog :model-value="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>{{ trader.tA }}</v-card-title>
      <v-card-text>
        <v-card class="my-1" variant="tonal" theme="dark">
          <v-card-text>
            <v-row class="mt-1 mb-2" justify="center"><h3>{{ trader.level.name }}</h3></v-row>
            <p class="text-h5">
              Account size: {{ trader.level.accountSize }} USDC
            </p>
          </v-card-text>
        </v-card>
        <v-card variant="tonal" theme="dark">
          <v-card-text>
            <v-row class="mt-1 mb-2" justify="center"><h3>Paper Trade Performance</h3></v-row>
            <v-row class="ma-1">
              <v-col>
                <v-row justify="center">
                  <span class="font-weight-bold">ROI:</span>
                </v-row>
                <v-row justify="center">{{ trader.roi }}</v-row>

              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-row justify="center">
                  <span class="font-weight-bold">Win Rate:</span>
                </v-row>
                <v-row justify="center">{{ trader.wR }}</v-row>

              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-row justify="center">
                  <span class="font-weight-bold">Max Drawndown:</span>
                </v-row>
                <v-row justify="center">{{ trader.mDD }}</v-row>

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="fundTrader">Fund</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import {TraderStatus} from "../../enum";

export default {
  name: "FundTraderDialog",
  props: {
    trader: {
      required: true,
      default: {},
    },
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, {emit}) {
    const closeDialog = () => {
      // emit event to parent component to save task
      emit('close')
    }
    const fundTrader = () => {
      // emit event to parent component to save task
      emit('fundTrader')
    }
    return {closeDialog, fundTrader}
  }
}
</script>

<style scoped>

</style>
