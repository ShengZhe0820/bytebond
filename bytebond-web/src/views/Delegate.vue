<template>
  <v-container class="text-center">
    <v-data-table
      :headers="headers"
      :items="eligible_traders"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "delegate",
  setup() {
    const eligible_traders = [{'traderAddress':"0xasdkfljh12lu3hflk2uh"},
    {'traderAddress':"0xasdkfljh12lu3hflk212312h"},
    {'traderAddress':"0xasdkfljh12lu3hflk2uhasdfasdad"}]
    const headers = [
    {
        title: 'Trader',
        key: 'traderAddress',
    },
];
    return {headers,eligible_traders}
  }
}
</script>

<style scoped>

</style>
