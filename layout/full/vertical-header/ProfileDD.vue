<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

interface MenuItem {
  title: string;
  href?: string;
  icon?: string;
  action?: () => void;
}

const items = computed<MenuItem[]>(() => [
  {
    title: t('profile_dropdown.title'),
    href: '/user/profile',
    icon: 'mdi-account',
  },
]);
</script>

<template>
  <div class="profileDD">
    <v-menu>
      <template #activator="{ props }">
        <v-btn color="primary" v-bind="props">
          <v-icon size="x-large">mdi-account-circle</v-icon>
        </v-btn>
      </template> 
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index"
          @click="() => item.href ? router.push(item.href) : item.action?.()">
          <template #default>
            <div class="d-flex align-center">
              <v-icon v-if="item.icon" class="mr-3">{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
