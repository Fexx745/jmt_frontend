<script setup lang="ts">
import type { Slip } from "@/misc/type";
import { formatDate } from "@/utils/date-func"
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getSlipBy } = useSlip();

const slips = ref<Slip[]>([]);
const loading = ref(false);
const search = ref('');
let jsPDF: any;
let autoTable: any;

const headers = computed(() => [
    { title: t('slip.id'), key: 'slip_id', sortable: false },
    { title: t('slip.date'), key: 'slip_date' },
    { title: t('slip.total'), key: 'slip_total' },
    { title: t('slip.store'), key: 'slip_store', sortable: false },
    { title: t('slip.VAT'), key: 'slip_VAT' },
    { title: t('slip.pdf'), key: 'pdf', sortable: false }
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
                : formatDate(slip.slip_date),
            String(slip.slip_total),
            String(slip.slip_store),
            String(slip.slip_VAT)
        ]
    ];

    autoTable(doc, {
        head: [tableColumn],
        body: tableRow,
        styles: { font: "THSarabun", fontSize: 12 },
        headStyles: {
            fillColor: [0, 102, 204],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        theme: 'grid'
    });
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
};

const dateFilter = ref(""); // ใช้สำหรับเก็บค่าของวันที่ที่ผู้ใช้เลือก
const dateMenu = ref(false); // ใช้สำหรับควบคุมการแสดง/ซ่อนของ date picker

const filteredSlips = computed(() => {
    if (!dateFilter.value) {
        return slips.value;
    }
    return slips.value.filter((slip) => {
        // เปลี่ยน slip_date เป็น string หรือ date เพื่อการเปรียบเทียบ
        const slipDate = typeof slip.slip_date === "object" && slip.slip_date instanceof Date
            ? slip.slip_date.toLocaleDateString()
            : formatDate(slip.slip_date, 'dd/MM/yyyy');

        return slipDate === dateFilter.value;
    });
});


</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('slip.title') }}
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="filteredSlips" :search="search" :loading="loading">
                    <template v-slot:item.pdf="{ item }">
                        <v-btn color="red" size="small" @click="exportToPDF(item.slip_id)">
                            PDF
                        </v-btn>
                    </template>
                    <template v-slot:item.slip_date="{ item }">
                        <span>{{ formatDate(item.slip_date, 'dd/MM/yyyy') }}</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>