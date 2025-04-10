<script setup lang="ts">
import Main from '~/layout/full/Main.vue';
const title = ref("JMT Client");

useHead({
  meta: [{ content: title }],
  titleTemplate: () => {
    return "JMT Client";
  },
}); 
</script>

<template>
  <v-locale-provider>
    <v-app>
      <Main />
      <v-main>
        <v-container fluid class="pa-0">
          <NuxtPage />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>