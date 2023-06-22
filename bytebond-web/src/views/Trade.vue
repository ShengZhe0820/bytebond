<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-card width="600">
        <template v-slot:title>
          Swap Coins
        </template>
        <template v-slot:text>
          <v-row>
            <v-col>
              <v-text-field label="Amount"
                            type="number"
                            variant="underlined"
                            placeholder="0.0" hide-details>
              </v-text-field>
            </v-col>
            <v-col>
              <v-select :items="tokens" label="From"></v-select>
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
                            placeholder="0.0" hide-details>
              </v-text-field>
            </v-col>
            <v-col>
              <v-select :items="tokens" label="To"></v-select>
            </v-col>

          </v-row>
        </template>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn>Swap Coins</v-btn>
        </v-card-actions>

      </v-card>
    </v-row>

  </v-container>
  <v-card>
    <v-card-title>
      <v-row>
        Your Profit this Month: 100 USDT
      </v-row>
      <v-row>
        Profit Target: 500 USDT
      </v-row>
      <v-row>
        Remaining Day(s): 20
      </v-row>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "Trade",
  setup() {
    const tokens = ['ETH', 'BTC', 'ADA']
    return {tokens}
  }
}
</script>

<style scoped>
</style>
