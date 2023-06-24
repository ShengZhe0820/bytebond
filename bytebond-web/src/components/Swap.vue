<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-card width="600">
        <template v-slot:title>
          <v-row>   <v-col align="left">
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
  <v-card class="mt-2">
    <v-card-title>Trade Records</v-card-title>
    <v-data-table
      :headers="headers"
      :items="records"
      class="elevation-1"
    >
    </v-data-table>
  </v-card>

</template>

<script>

export default {
  name: "swap",
  props: {
    records: {
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
    const tokens = ['HBAR','SAUCE','CLXY','HST','LUCKY']
    return {headers, tokens}
  }
}
</script>

<style scoped>

</style>
