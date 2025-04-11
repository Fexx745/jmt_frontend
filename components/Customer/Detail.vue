<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Customer } from "@/misc/type";
const { getCustomerByID } = useCustomer();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    customer_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const customer = ref<Customer>({
    customer_id: '',
    customer_name: '',
    customer_gender: '',
    customer_tel: '',
    customer_fax: '',
    customer_tax: '',
    customer_no: '',
    customer_tambon: '',
    customer_aumper: '',
    customer_province: '',
    customer_code: '',
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getCustomerByID({ customer_id: props.customer_id });
        customer.value = res;
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
                    <v-label>{{ $t('customer.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ customer.customer_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.name') }}:</v-label>
                    {{ customer.customer_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label class="mr-2">{{ $t('customer.gender') }}:</v-label>
                    <v-chip :color="customer.customer_gender === 'Male' ? 'blue' :
                        customer.customer_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                        {{ customer.customer_gender === 'Male' ? 'ชาย' :
                            customer.customer_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.tel') }}:</v-label>
                    {{ customer.customer_tel }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.fax') }}:</v-label>
                    {{ customer.customer_fax }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.tax') }}:</v-label>
                    {{ customer.customer_tax }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.no') }}:</v-label>
                    {{ customer.customer_no }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.tambon') }}:</v-label>
                    {{ customer.customer_tambon }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.aumper') }}:</v-label>
                    {{ customer.customer_aumper }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.province') }}:</v-label>
                    {{ customer.customer_province }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('customer.code') }}:</v-label>
                    {{ customer.customer_code }}
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
