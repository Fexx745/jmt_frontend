<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Order } from "@/misc/type";
const { insertOrderBy } = useOrder();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const order = ref<Order>({
    order_id: '',
    order_name: '',
    order_price: 0,
    order_date: new Date(),
    order_amount: 0,
    order_detail: '',
});

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await insertOrderBy(order.value);
        order.value = {
            order_id: '',
            order_name: '',
            order_price: 0,
            order_date: new Date(),
            order_amount: 0,
            order_detail: '',
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
        { key: 'order_name' },
        { key: 'order_price' },
        { key: 'order_amount' },
    ];
    fields.forEach(field => {
        const value = order.value[field.key];
        if (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        ) {
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
                    {{ $t('order.name') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="order.order_name" :error-messages="errors.order_name" variant="outlined"
                    density="compact" :placeholder="$t('order.name')" />
            </v-col>
            <v-col cols="12" md="4">
                <v-label class="mb-2">
                    {{ $t('order.price') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field type="number" v-model="order.order_price" :error-messages="errors.order_price"
                    variant="outlined" density="compact" :placeholder="$t('order.price')" />
            </v-col>
            <v-col cols="12" md="4">
                <v-label class="mb-2">
                    {{ $t('order.amount') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field type="number" v-model="order.order_amount" :error-messages="errors.order_amount"
                    variant="outlined" density="compact" :placeholder="$t('order.amount')" />
            </v-col>
            <v-col cols="12" md="12" style="margin-top: -30px;">
                <v-label>{{ t('order.detail') }}</v-label>
                <v-textarea v-model="order.order_detail" :placeholder="t('order.detail')" rows="3" variant="outlined"
                    dense />
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
            <v-card-text class="d-flex justify-center py-4">
                <v-btn color="success" size="small" @click="onSubmit" class="mr-2">
                    <template v-if="submitting">
                        <v-progress-circular class="mr-2" indeterminate color="success"
                            :size="16"></v-progress-circular>
                    </template>
                    {{ t('button.save') }}
                </v-btn>
                <v-btn color="red" size="small" @click="() => emit('close')">{{ t('button.cancel') }}</v-btn>
            </v-card-text>
        </v-row>
    </v-card-text>
</template>