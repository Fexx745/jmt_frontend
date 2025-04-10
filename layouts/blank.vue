<script setup lang="ts"> 

const title = ref("JMT Client");

useHead({
  meta: [{ content: title }],
  titleTemplate: () => {
    return "JMT Client";
  },
});
</script>
<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>