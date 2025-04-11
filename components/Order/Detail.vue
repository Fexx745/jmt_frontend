<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Order } from "@/misc/type";
const { getOrderByID } = useOrder();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['close'])
const props = defineProps({
    order_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const order = ref<Order>({
    order_id: '',
    order_name: '',
    order_price: 0,
    order_date: '',
    order_amount: 0,
    order_detail: '',
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getOrderByID({ order_id: props.order_id });
        order.value = res;
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
                    <v-label>{{ $t('order.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ order.order_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('order.name') }}:</v-label>
                    {{ order.order_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('order.amount') }}:</v-label>
                    {{ order.order_amount }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('order.price') }}:</v-label>
                    {{ order.order_price }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('order.date') }}:</v-label>
                    {{ formatDate(order.order_date, "dd/MM/yyyy") }}
                </v-col>
                <v-col cols="12" style="margin-top: -20px;">
                    <v-label>{{ $t('order.detail') }}:</v-label>
                    <v-textarea v-model="order.order_detail" outlined dense readonly auto-grow rows="2"></v-textarea>
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
