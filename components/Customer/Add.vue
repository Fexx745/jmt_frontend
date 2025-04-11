<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Customer } from "@/misc/type";
const { insertCustomerBy } = useCustomer();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

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
});

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await insertCustomerBy(customer.value);
        customer.value = {
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
        };
        emit('close')
        emit('done')
        Swal.fire({
            icon: 'success',
            title: t('title.add_success'),
            text: t('text.add_success'),
        });
    } catch (error) {
        console.error("Error", error);
    }
};

const validateForm = () => {
    errors.value = {};
    let isValid = true;
    const fields = [
        { key: 'customer_name' },
        { key: 'customer_tel' },
        { key: 'customer_fax' },
        { key: 'customer_tax' },
        { key: 'customer_no' }
    ];
    fields.forEach(field => {
        if (!customer.value[field.key] || customer.value[field.key].trim() === '') {
            errors.value[field.key] = t('validation.required');
            isValid = false;
        }
    });
    return isValid;
};
</script>

<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" md="4">
                <v-label class="mb-2">
                    {{ $t('customer.name') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="customer.customer_name" :error-messages="errors.customer_name" variant="outlined"
                    density="compact" :placeholder="$t('customer.name')" />
            </v-col>
            <v-col cols="12" md="4">
                <v-label class="mb-2">
                    {{ $t('customer.gender') }}
                </v-label>
                <v-select v-model="customer.customer_gender" :items="[
                    { label: 'ชาย', value: 'Male' },
                    { label: 'หญิง', value: 'Female' }
                ]" item-title="label" item-value="value" variant="outlined" density="compact"
                    :placeholder="$t('customer.gender')" />
            </v-col>
            <v-col cols="12" md="4">
                <v-label class="mb-2">
                    {{ $t('customer.tel') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="customer.customer_tel" type="number" :error-messages="errors.customer_tel"
                    variant="outlined" density="compact" :placeholder="$t('customer.tel')" />
            </v-col>
            <v-col cols="12" md="4" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.fax') }}<span class="text-error ml-1">*</span></v-label>
                <v-text-field v-model="customer.customer_fax" type="number" :error-messages="errors.customer_fax"
                    variant="outlined" density="compact" :placeholder="$t('customer.fax')" />
            </v-col>

            <v-col cols="12" md="4" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.tax') }}<span class="text-error ml-1">*</span></v-label>
                <v-text-field v-model="customer.customer_tax" type="number" :error-messages="errors.customer_tax"
                    variant="outlined" density="compact" :placeholder="$t('customer.tax')" />
            </v-col>

            <v-col cols="12" md="4" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.no') }}<span class="text-error ml-1">*</span></v-label>
                <v-text-field v-model="customer.customer_no" type="number" :error-messages="errors.customer_no"
                    variant="outlined" density="compact" :placeholder="$t('customer.no')" />
            </v-col>

            <v-col cols="12" md="3" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.tambon') }}</v-label>
                <v-text-field v-model="customer.customer_tambon" variant="outlined" density="compact"
                    :placeholder="$t('customer.tambon')" />
            </v-col>

            <v-col cols="12" md="3" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.aumper') }}</v-label>
                <v-text-field v-model="customer.customer_aumper" variant="outlined" density="compact"
                    :placeholder="$t('customer.aumper')" />
            </v-col>

            <v-col cols="12" md="3" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.province') }}</v-label>
                <v-text-field v-model="customer.customer_province" variant="outlined" density="compact"
                    :placeholder="$t('customer.province')" />
            </v-col>
            <v-col cols="12" md="3" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('customer.code') }}</v-label>
                <v-text-field v-model="customer.customer_code" type="number" variant="outlined" density="compact"
                    :placeholder="$t('customer.code')" />
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
            <v-card-text class="d-flex justify-center py-4">
                <v-btn color="success" size="small" @click="onSubmit" class="mr-2">
                    <template v-if="submitting">
                        <v-progress-circular class="mr-2" indeterminate color="success"
                            :size="16"></v-progress-circular>
                    </template> {{ t('button.save') }}
                </v-btn>
                <v-btn color="red" size="small" @click="() => emit('close')">{{ t('button.cancel') }}</v-btn>
            </v-card-text>
        </v-row>
    </v-card-text>
</template>