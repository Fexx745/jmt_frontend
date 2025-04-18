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
                <v-col cols="12">
                    <v-label>{{ $t('salestaff.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ salestaff.salestaff_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('salestaff.name') }}:</v-label>
                    {{ salestaff.salestaff_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label class="mr-2">{{ $t('salestaff.gender') }}:</v-label>
                    <v-chip :color="salestaff.salestaff_gender === 'Male' ? 'blue' :
                        salestaff.salestaff_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                        {{ salestaff.salestaff_gender === 'Male' ? 'ชาย' :
                            salestaff.salestaff_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('salestaff.age') }}:</v-label>
                    {{ salestaff.salestaff_age }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('salestaff.phone') }}:</v-label>
                    {{ salestaff.salestaff_phone }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('salestaff.fax') }}:</v-label>
                    {{ salestaff.salestaff_fax }}
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-card-text class="d-flex justify-center py-4">
                    <v-btn color="primary" size="small" @click="() => emit('close')">{{ t('button.close') }}</v-btn>
                </v-card-text>
            </v-row>
        </v-card-text>
    </template>
</template>
