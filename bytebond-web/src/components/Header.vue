<template>
  <v-app-bar>
    <h1 class="mx-5" @click="$router.push('/')">ByteBond</h1>
    <v-btn @click="$router.push('/delegate')">
      Hire
    </v-btn>
    <v-btn @click="$router.push('/trade')">
      Trade
    </v-btn>
    <!--    <v-btn v-if="!isConnectedToPeraWallet" @click="connectWallet" class="text-none" stacked>-->
    <!--      <v-icon color="info">mdi-wallet</v-icon>-->
    <!--      Connect Wallet-->
    <!--    </v-btn>-->
    <!--    <v-btn v-else @click="disconnectWallet" class="text-none" stacked>-->
    <!--      <v-icon color="success">mdi-wallet</v-icon>-->
    <!--      Disconnect:-->
    <!--      {{ connectedAccount }}-->
    <!--    </v-btn>-->
  </v-app-bar>
</template>

<script>
import router from "@/router";
import {defineComponent} from "vue";

export default defineComponent({
  methods: {router}
})

</script>

<style scoped>
h1{
user-select: none;
}
</style>
