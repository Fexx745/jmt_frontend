<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SaleStaff } from "@/misc/type";
const { getSaleStaffByID } = useSaleStaff();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    salestaff_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const salestaff = ref<SaleStaff>({
    salestaff_id: '',
    salestaff_name: '',
    salestaff_gender: '',
    salestaff_age: '',
    salestaff_phone: '',
    salestaff_fax: ''
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getSaleStaffByID({ salestaff_id: props.salestaff_id });
        salestaff.value = res;
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})
</script>

<template>
    <template v-if="pending">
        <v-card-text class="text-center py-4">
            <v-label>{{ t('any.loading') }}</v-label>
            <v-progress-circular class="ml-4" indeterminate color="primary"></v-progress-circular>
        </v-card-text>
    </template>
    <template v-else>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.id') }}:</v-label>
                    <div>{{ salestaff.salestaff_id }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.name') }}:</v-label>
                    <div>{{ salestaff.salestaff_name }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.gender') }}:</v-label>
                    <div>{{ salestaff.salestaff_gender }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.age') }}:</v-label>
                    <div>{{ salestaff.salestaff_age }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.phone') }}:</v-label>
                    <div>{{ salestaff.salestaff_phone }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('salestaff.fax') }}:</v-label>
                    <div>{{ salestaff.salestaff_fax }}</div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-text class="d-flex justify-center py-4">
            <v-btn color="primary" @click="() => emit('close')">{{ t('button.close') }}</v-btn>
        </v-card-text>
    </template>
</template>
