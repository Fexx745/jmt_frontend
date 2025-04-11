<script setup lang="ts">
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./vertical-header/LanguageSwitcher.vue";
import ProfileDD from "./vertical-header/ProfileDD.vue";

const { t } = useI18n();

const sidebar_menus = computed(() => [
    {
        header: t("sidebar.title.general_info"),
        childs: [
            { text: t("sidebar.customer"), href: "/customer", icon: "mdi-account" },
            { text: t("sidebar.salestaff"), href: "/sale-staff", icon: "mdi-account-tie" },
            { text: t("sidebar.staff"), href: "/staff", icon: "mdi-account-multiple" },
            { text: t("sidebar.manager"), href: "/manager", icon: "mdi-account-star" },
        ]
    },
    {
        header: t("sidebar.title.warehouse"),
        childs: [
            { text: t("sidebar.stock"), href: "/stock", icon: "mdi-warehouse" },
            { text: t("sidebar.store"), href: "/store", icon: "mdi-storefront" },
            { text: t("sidebar.product"), href: "/product", icon: "mdi-cube" },
            { text: t("sidebar.promotion"), href: "/promotion", icon: "mdi-gift" },
            { text: t("sidebar.order"), href: "/order", icon: "mdi-cart" },
            { text: t("sidebar.slip"), href: "/slip", icon: "mdi-file-document" },
        ]
    },
    {
        header: t("sidebar.title.statistics"),
        childs: [
            { text: t("sidebar.sales"), href: "/sales", icon: "mdi-chart-line" },
            { text: t("sidebar.report"), href: "/report", icon: "mdi-file-chart-outline" },
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
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>