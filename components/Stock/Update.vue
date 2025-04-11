<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Stock } from "@/misc/type";
const { updateStockBy, getStockByID } = useStock();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    stock_id: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const pending = ref(false)
const errors = ref<Record<string, string>>({})

const stock = ref<Stock>({
    stock_id: '',
    stock_inventories: 0,
    stock_productall: 0,
    stock_productname: '',
});

onMounted(async () => {
    pending.value = true
    try {
        stock.value = await getStockByID({ stock_id: props.stock_id });
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await updateStockBy(stock.value);
        stock.value = {
            stock_id: '',
            stock_inventories: 0,
            stock_productall: 0,
            stock_productname: '',
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
        { key: 'stock_productname' },
        { key: 'stock_inventories' },
        { key: 'stock_productall' },
    ];
    fields.forEach(field => {
        const value = stock.value[field.key];
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
    <template v-if="pending">
        <v-card-text class="text-center py-4">
            <v-label>{{ t('any.loading') }}</v-label>
            <v-progress-circular class="ml-4" indeterminate color="primary"></v-progress-circular>
        </v-card-text>
    </template>
    <template v-else>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4">
                    <v-label class="mb-2">
                        {{ $t('stock.productname') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="stock.stock_productname" :error-messages="errors.stock_productname"
                        variant="outlined" density="compact" :placeholder="$t('stock.productname')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label class="mb-2">
                        {{ $t('stock.inventories') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="stock.stock_inventories" :error-messages="errors.stock_inventories"
                        variant="outlined" density="compact" :placeholder="$t('stock.inventories')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label class="mb-2">
                        {{ $t('stock.productall') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="stock.stock_productall" :error-messages="errors.stock_productall"
                        variant="outlined" density="compact" :placeholder="$t('stock.productall')" />
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
</template>