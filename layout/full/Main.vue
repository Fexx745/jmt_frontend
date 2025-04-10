<script setup lang="ts">
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./vertical-header/LanguageSwitcher.vue";
import ThemeSwitcher from "./vertical-header/ThemeSwitcher.vue";
import ProfileDD from "./vertical-header/ProfileDD.vue";

const { t } = useI18n();

const sidebar_menus = ref([
    {
        header: "หน้าหลัก",
        childs: [
            { text: "แดชบอร์ด", href: "/dashboard", icon: "mdi-view-dashboard" },
            { text: "รายการลูกค้า", href: "/clients", icon: "mdi-account-group" },
        ]
    },
    {
        header: "จัดการข้อมูล",
        childs: [
            { text: "รายงาน", href: "/reports", icon: "mdi-file-chart" },
            { text: "การเงิน", href: "/finance", icon: "mdi-currency-usd" },
            { text: "การตั้งค่า", href: "/settings", icon: "mdi-cog" },
        ]
    }
]);

const sDrawer = ref(true); 
</script>

<template>
    <v-navigation-drawer left elevation="0" app class="leftSidebar" v-model="sDrawer">
        <div class="pa-2 ml-n4">
            <LayoutFullLogo />
        </div>
        <perfect-scrollbar class="scrollnavbar">
            <v-list class="py-2 px-4">
                <template v-for="(menu, i) in sidebar_menus" :key="menu.header">
                    <v-list-subheader v-if="menu.header" class="text-uppercase font-weight-bold">
                        {{ menu.header }}
                    </v-list-subheader>
                    <template v-for="(item, index) in menu.childs" :key="index">
                        <v-list-item :to="item.href" :value="item.href" color="primary" class="mb-1" rounded="lg">
                            <template v-slot:prepend>
                                <v-icon :icon="item.icon"></v-icon>
                            </template>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item>
                    </template>
                </template>
            </v-list>
        </perfect-scrollbar>
    </v-navigation-drawer>

    <v-app-bar elevation="0" height="70">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn class="ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat"
                    size="small">
                    <v-app-bar-nav-icon />
                </v-btn>
            </div>
            <div class="d-flex align-center">
                <LanguageSwitcher />
                <ThemeSwitcher />
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>