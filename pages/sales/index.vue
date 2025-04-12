<script setup lang="ts">
import { decimalFix } from "@/utils/number-func"
import { formatDate } from "@/utils/date-func"
import type { Sales } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getSalesBy } = useSales();

const sales = ref<Sales[]>([]);
const loading = ref(false);
const search = ref('');

const headers = computed(() => [
    { title: t('sales.id'), key: 'sales_id', sortable: false },
    { title: t('sales.date'), key: 'sales_date' },
    { title: t('sales.productone'), key: 'sales_productone' },
    { title: t('sales.productall'), key: 'sales_productall' },
    { title: t('sales.day'), key: 'sales_day' },
    { title: t('sales.month'), key: 'sales_month' },
    { title: t('sales.year'), key: 'sales_year' },
]);

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

</script>

<template>
    <v-container>
        <SalesDashboard />
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('sales.title') }}
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="sales" :search="search" :loading="loading">
                    <template v-slot:item.sales_date="{ item }">
                        <span>{{ formatDate(item.sales_date, "dd/MM/yyyy") }}</span>
                    </template>
                    <template v-slot:item.sales_productone="{ item }">
                        <span>{{ decimalFix(item.sales_productone) }}</span>
                    </template>
                    <template v-slot:item.sales_productall="{ item }">
                        <span>{{ decimalFix(item.sales_productall) }}</span>
                    </template>
                    <template v-slot:item.sales_day="{ item }">
                        <span>{{ decimalFix(item.sales_day) }}</span>
                    </template>
                    <template v-slot:item.sales_month="{ item }">
                        <span>{{ decimalFix(item.sales_month) }}</span>
                    </template>
                    <template v-slot:item.sales_year="{ item }">
                        <span>{{ decimalFix(item.sales_year) }}</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>