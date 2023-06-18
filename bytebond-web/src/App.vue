<template>
  <v-app>
    <Header/>
    <v-main>
      <v-container>
        <RouterView/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>
