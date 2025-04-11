<script setup lang="ts">
import type { Slip } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getSlipBy } = useSlip();

const slips = ref<Slip[]>([]);
const loading = ref(false);
const search = ref('');
let jsPDF: any;
let autoTable: any;

const headers = computed(() => [
    { title: t('slip.id'), key: 'slip_id' },
    { title: t('slip.date'), key: 'slip_date' },
    { title: t('slip.total'), key: 'slip_total' },
    { title: t('slip.store'), key: 'slip_store' },
    { title: t('slip.VAT'), key: 'slip_VAT' },
    { title: t('any.actions'), key: 'actions' }
]);

onMounted(async () => {
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    jsPDF = jsPDFModule.jsPDF;
    autoTable = autoTableModule.default;

    await fetchSlips();
});


const fetchSlips = async () => {
    loading.value = true;
    try {
        slips.value = await getSlipBy();
    } catch (error) {
        console.error("Error loading slips", error);
    } finally {
        loading.value = false;
    }
};

const exportToPDF = (slip_id: string) => {
    const slip = slips.value.find(s => s.slip_id === slip_id);
    if (!slip) return; 
    const doc = new jsPDF(); 
    const tableColumn = [
        t('slip.id'),
        t('slip.date'),
        t('slip.total'),
        t('slip.store'),
        t('slip.VAT')
    ]; 
    const tableRow = [
        [
            slip.slip_id,
            typeof slip.slip_date === 'object' && slip.slip_date instanceof Date
                ? slip.slip_date.toLocaleDateString()
                : String(slip.slip_date),
            String(slip.slip_total),
            String(slip.slip_store),
            String(slip.slip_VAT)
        ]
    ]; 
    autoTable(doc, {
        head: [tableColumn],
        body: tableRow,
        styles: { font: "THSarabun", fontSize: 12 },
        theme: 'grid'
    }); 
    doc.save(`slip-${slip.slip_id}.pdf`);
};

</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('slip.manage') }}
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="slips" :search="search" :loading="loading">
                    <template v-slot:item.actions="{ item }">
                        <v-btn color="red" size="small" @click="exportToPDF(item.slip_id)">
                            PDF
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>