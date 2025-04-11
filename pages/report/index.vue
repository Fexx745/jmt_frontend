<script setup lang="ts">
import { decimalFix } from "@/utils/number-func"
import { formatDate } from "@/utils/date-func"
import type { Report } from "@/misc/type"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { getReportBy } = useReport()

const report = ref<Report[]>([])
const loading = ref(false)
const search = ref('')

onMounted(async () => {
    await fetchReport()
})

const fetchReport = async () => {
    loading.value = true
    try {
        report.value = await getReportBy()
    } catch (error) {
        console.error("Error loading report", error)
    } finally {
        loading.value = false
    }
}

const headers = computed(() => [
    { title: t('report.id'), key: 'report_id' },
    { title: t('report.date'), key: 'report_date' },
    { title: t('report.product'), key: 'report_product' },
    { title: t('report.sales'), key: 'report_sales' }
])

</script>

<template>
    <v-container>
        <ReportDashboard />
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('report.title') }}
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="report" :search="search" :loading="loading"
                    loading-text="Loading...">
                    <template v-slot:item.report_date="{ item }">
                        <span>{{ formatDate(item.report_date, "dd/MM/yyyy") }}</span>
                    </template>
                    <template v-slot:item.report_product="{ item }">
                        <span>{{ decimalFix(item.report_product) }}</span>
                    </template>
                    <template v-slot:item.report_sales="{ item }">
                        <span>{{ decimalFix(item.report_sales) }}</span>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>
