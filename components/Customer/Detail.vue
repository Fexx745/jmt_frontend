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
                <v-col cols="6">
                    <v-label>{{ $t('customer.name') }}:</v-label>
                    <div>{{ customer.customer_name }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.gender') }}:</v-label>
                    <div>{{ customer.customer_gender }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.tel') }}:</v-label>
                    <div>{{ customer.customer_tel }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.fax') }}:</v-label>
                    <div>{{ customer.customer_fax }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.tax') }}:</v-label>
                    <div>{{ customer.customer_tax }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.no') }}:</v-label>
                    <div>{{ customer.customer_no }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.tambon') }}:</v-label>
                    <div>{{ customer.customer_tambon }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.aumper') }}:</v-label>
                    <div>{{ customer.customer_aumper }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.province') }}:</v-label>
                    <div>{{ customer.customer_province }}</div>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('customer.code') }}:</v-label>
                    <div>{{ customer.customer_code }}</div>
                </v-col>
            </v-row>
        </v-card-text> 
        <v-divider></v-divider>
        <v-card-text class="d-flex justify-center py-4">
            <v-btn color="primary" @click="() => emit('close')">{{ t('button.close') }}</v-btn>
        </v-card-text>
    </template>
</template>
