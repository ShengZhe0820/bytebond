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
          v-for="(item, i) in requirementCheckList"
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
      </v-card-text>
    </v-card>
    <div class="mt-4">
      <Swap/>
    </div>

  </div>
</template>

<script lang="ts">
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {AccStatus, TraderStatus} from "../../enum";
import Swap from "@/components/Swap.vue";
import {Evaluation_Requirement} from "../../data";

export default {
  name: "Demo",
  components: {Swap},
  computed: {
    AccStatus() {
      return AccStatus
    }
  },

  setup() {
    const app = useAppStore()
    const {accStatus} = storeToRefs(app)
    const requirementCheckList = Evaluation_Requirement

    const startEvaluation = () => {
      app.changeAccStatus(AccStatus.EVALUATING)
    }
    return {accStatus, startEvaluation, requirementCheckList}
  }
}

</script>

<style scoped>

</style>
