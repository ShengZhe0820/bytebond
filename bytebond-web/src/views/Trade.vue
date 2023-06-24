<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Account Status:</v-card-title>
          <v-card-text>
            <v-row>
              <v-col><span class="font-weight-bold">Current Level: {{ accLevel.name }}</span></v-col>

            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <v-col><span class="font-weight-bold">Progress to new Level ({{ nextLevel.name }})</span></v-col>

                </v-row>
                <v-progress-linear model-value="40" height="10"
                                   striped></v-progress-linear>
                <v-list-item
                  v-for="(item, i) in levelUpCheckList"
                  :key="i"
                  density="compact"
                >
                  <v-checkbox
                    density="compact"
                    hide-details
                    disabled
                    :label="item"
                  ></v-checkbox>
                </v-list-item>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Delegation Status:</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                Total Profit: 100 (USD)
              </v-col>

            </v-row>
            <v-row>
              <v-col>
                Your Profit this Month: (100/500) (USD)
              </v-col>

            </v-row>
            <v-row>
              <v-col>Max drawdown: 5%</v-col>

            </v-row>
            <v-row>
              <v-col>
                Total profit: 200 (USD)
              </v-col>

            </v-row>
            <v-row>
              <v-col>Withdrawable profit: 90 (USD)</v-col>

            </v-row>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>


  <div class="mt-4">
    <Swap :records="demoRecords"/>
  </div>
</template>

<script lang="ts">
import Swap from "@/components/Swap.vue";
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {TraderLevels} from "../../enum";
import * as net from "net";
import {TradeRecord} from "../../types";

export default {
  name: "Trade",
  components: {Swap},
  computed: {
    TraderLevels() {
      return TraderLevels
    }
  },
  setup() {
    const store = useAppStore()
    const {accLevel}: { TraderLevels } = storeToRefs(store)
    let nextLevel = TraderLevels.NOVICE
    Object.keys(TraderLevels).forEach(level => {
      if (TraderLevels[level].id === (accLevel.id + 1)) {
        nextLevel = TraderLevels[level]
      }
    })
    const levelUpCheckList = [
      "Complete a minimum of 30 trading days. (20/30)",
      "Achieve a positive net profit over the last 30 trading days. (5/30)"
    ]
    const tokens = ['HBAR', 'SAUCE', 'CLXY', 'HST', 'LUCKY']
    const demoRecords: TradeRecord[] = [
      {
        id: '1',
        fSym: 'HBAR',
        tSym: 'SAUCE',
        amt: 0.01,
        date: '2023-06-24 01:04:52'
      },
      {
        id: '2',
        fSym: 'CLXY',
        tSym: 'HBAR',
        amt: 0.01,
        date: '2023-06-24 01:04:52'
      }, {
        id: '3',
        fSym: 'USDC',
        tSym: 'BTC',
        amt: 0.01,
        date: '2023-06-24 01:04:52'
      }
    ]
    return {accLevel, nextLevel, levelUpCheckList, demoRecords}
  }
}
</script>

<style scoped>
</style>
