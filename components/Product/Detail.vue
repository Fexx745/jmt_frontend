<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from "@/utils/date-func"
import { decimalFix } from '@/utils/number-func';
import type { Product } from "@/misc/type";
const { getProductByID } = useProduct();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    product_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const product = ref<Product>({
    product_id: '',
    product_name: '',
    product_moo: '',
    product_type: '',
    product_mxp: '',
    product_exp: '',
    product_price: 0
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getProductByID({ product_id: props.product_id });
        product.value = res;
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
                    <v-label>{{ $t('product.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ product.product_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.name') }}:</v-label>
                    {{ product.product_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.moo') }}:</v-label>
                    {{ product.product_moo }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.type') }}:</v-label>
                    {{ product.product_type }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.price') }}:</v-label>
                    {{ decimalFix(product.product_price, 2) }} ฿
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.mxp') }}:</v-label>
                    {{ formatDate(product.product_mxp, "dd/MM/yyyy") }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('product.exp') }}:</v-label>
                    {{ formatDate(product.product_exp, "dd/MM/yyyy") }}
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
