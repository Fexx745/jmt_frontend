<script setup lang="ts">
import { decimalFix } from "@/utils/number-func"
import type { Sales } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getSalesBy } = useSales();

const sales = ref<Sales[]>([]);
const loading = ref(false);
onMounted(async () => {
    await fetchSales();
});

const fetchSales = async () => {
    loading.value = true;
    try {
        sales.value = await getSalesBy();
    } catch (error) {
        console.error("Error loading sales", error);
    } finally {
        loading.value = false;
    }
};

const totalProductAll = computed(() =>
    sales.value.reduce((acc, item) => acc + (item.sales_productall || 0), 0)
);
const totalDay = computed(() =>
    sales.value.reduce((acc, item) => acc + (item.sales_day || 0), 0)
);
const totalMonth = computed(() =>
    sales.value.reduce((acc, item) => acc + (item.sales_month || 0), 0)
);
const totalYear = computed(() =>
    sales.value.reduce((acc, item) => acc + (item.sales_year || 0), 0)
); 
</script>

<template>
    <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="primary">mdi-cart</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem; color: gray;">{{ t('sales.productall') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ decimalFix(totalProductAll) }} ฿</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="success">mdi-calendar-today</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem; color: gray;">{{ t('sales.day') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ decimalFix(totalDay) }} ฿</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="warning">mdi-calendar-month</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">{{ t('sales.month') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ decimalFix(totalMonth) }} ฿</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="error">mdi-calendar-range</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">{{ t('sales.year') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ decimalFix(totalYear) }} ฿</div>
            </v-card>
        </v-col>
    </v-row>
</template>