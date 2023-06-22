<template>
  <v-app-bar>
    <h1 class="mx-5" @click="$router.push('/')">BlockTradeLabs</h1>
    <v-btn @click="$router.push('/paperTrade')">
      Paper Trade
    </v-btn>
    <v-btn @click="$router.push('/delegate')">
      Hire
    </v-btn>
    <v-btn @click="$router.push('/trade')">
      Trade
    </v-btn>
    <v-spacer></v-spacer>
    <div v-if="isReadyToConnect">
      <v-btn v-if="!connectedAccount" class="text-none" @click="connectWallet">
        <v-icon color="info">mdi-wallet</v-icon>
        Connect Wallet
      </v-btn>
      <v-btn v-else class="text-none" @click="disconnectWallet">
        <v-icon color="success">mdi-wallet</v-icon>
        Disconnect:
        {{ connectedAccount }}
      </v-btn>
    </div>

  </v-app-bar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useWalletStore} from "@/store/wallet";
import {storeToRefs} from "pinia";
// p4w@&0Q7C3^Z
export default defineComponent({
  setup() {
    const store = useWalletStore()
    store.initHashConnect()

    const {connectedAccount, isReadyToConnect} = storeToRefs(store);

    const connectWallet = async () => {
      await store.connectWallet()
    };

    const disconnectWallet = async () => {
      await store.disconnectWallet()
    }
    return {connectedAccount, isReadyToConnect, connectWallet, disconnectWallet}
  }
})

</script>

<style scoped>
h1 {
  user-select: none;
}
</style>
