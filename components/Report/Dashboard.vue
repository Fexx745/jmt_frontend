<script setup lang="ts">
import { decimalFix } from "@/utils/number-func"
import type { Report } from "@/misc/type"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { getReportBy } = useReport()

const report = ref<Report[]>([])
const loading = ref(false)

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

const totalProduct = computed(() =>
    report.value.reduce((sum, r) => sum + Number(r.report_product), 0)
)
const totalSales = computed(() =>
    report.value.reduce((sum, r) => sum + Number(r.report_sales), 0)
) 
</script>

<template>
    <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="primary">mdi-box</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">{{ t('report.product') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ totalProduct }} ฿</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="success">mdi-cash-register</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">{{ t('report.sales') }}</div>
                <div style="font-size: 1.5rem; font-weight: 500;">{{ decimalFix(totalSales) }} ฿</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="warning">mdi-calendar-month-outline</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">ไม่มีการการ ...</div>
                <div style="font-size: 1.5rem;">จะมีเร็วๆนี้ ...</div>
            </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-card elevation="10" class="pa-4 text-center">
                <v-icon size="36" color="error">mdi-calendar-today-outline</v-icon>
                <div style="font-size: 1.25rem; margin-top: 0.5rem;color: gray;">ไม่มีการการ ...</div>
                <div style="font-size: 1.5rem;">จะมีเร็วๆนี้ ...</div>
            </v-card>
        </v-col>
    </v-row>
</template>
