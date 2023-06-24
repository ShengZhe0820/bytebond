<template>
  <h1>Evaluation</h1>
  <v-card v-if="accStatus === AccStatus.NEW">
    <v-card-text class="ma-2">
      <p>
        "Welcome to our Trader Evaluation page! Before we can fund your trading account, we need to ensure that you are
        ready to manage an investment responsibly and profitably.
      </p>
      <p>
        To qualify as a funded trader, you need to meet a set of criteria over a 3-month evaluation period:
      </p>
      <div class="mx-4">
        <ul>
          <li>Execute a minimum of 50 trades.</li>
          <li>Demonstrate consistent profitability month over month.</li>
          <li>Maintain a maximum drawdown of less than 10%.</li>
          <li>Diversify your trades across various asset classes.</li>
        </ul>
      </div>

      <p>
        Strictly adhere to our platform's trading rules and guidelines.
        Our evaluation process is designed to identify talented traders who can manage a portfolio wisely and generate
        consistent returns. If you believe you have what it takes to become a professional trader, click 'Start
        Evaluation' and begin your journey towards a funded trading account."
      </p>


    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-center">

      <v-btn @click="startEvaluation">Start
        Evaluation
      </v-btn>
    </v-card-actions>
  </v-card>
  <div v-else>

    <v-card>
      <v-card-title>Requirement CheckList</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list-item
          density="compact"
        >
          <v-checkbox
            density="compact"
            hide-details
            disabled
            :label=r1
          ></v-checkbox>
        </v-list-item>
        <v-list-item
          density="compact"
        >
          <v-checkbox
            density="compact"
            hide-details
            disabled
            label="Demonstrate consistent profitability month over month. (0/3)"
          ></v-checkbox>
        </v-list-item>
        <v-list-item
          density="compact"
        >
          <v-checkbox
            density="compact"
            hide-details
            disabled
            label="Maintain a maximum drawdown of less than 10%. (0/3)"
          ></v-checkbox>
        </v-list-item>
        <v-list-item
          density="compact"
        >
          <v-checkbox
            density="compact"
            hide-details
            disabled
            label="Diversify your trades across 5 asset classes. (0/5)"
          ></v-checkbox>
        </v-list-item>
      </v-card-text>
    </v-card>
    <div class="mt-4">
      <Swap :records="demoRecords"/>
    </div>

  </div>
</template>

<script lang="ts">
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {AccStatus} from "../../enum";
import Swap from "@/components/Swap.vue";
import {computed, ref} from "vue";
import {TradeRecord} from "../../types";

export default {
  name: "Demo",
  components: {Swap},
  computed: {
    AccStatus() {
      return AccStatus
    },
  },

  setup() {
    const app = useAppStore()
    const {accStatus} = storeToRefs(app)
    const demoRecords = ref<TradeRecord[]>([]);
    const startEvaluation = () => {
      app.changeAccStatus(AccStatus.EVALUATING)
    }

    const numberOfTrade = computed(() => {
      return demoRecords.value.length
    });
    const r1 = computed(() => {
      return `Execute a minimum of 50 trades. (${numberOfTrade.value}/50)`
    });

    return {accStatus, startEvaluation, r1, demoRecords}
  }
}

</script>

<style scoped>

</style>
