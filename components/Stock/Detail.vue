<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Stock } from "@/misc/type";
const { getStockByID } = useStock();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    stock_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const stock = ref<Stock>({
    stock_id: '',
    stock_inventories: 0,
    stock_productall: 0,
    stock_productname: '',
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getStockByID({ stock_id: props.stock_id });
        stock.value = res;
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
                    <v-label>{{ $t('stock.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ stock.stock_id }}
                    </v-chip>
                </v-col>
                <v-col cols="12" style="margin-top: -20px;">
                    <v-label>{{ $t('stock.productname') }}:</v-label>
                    {{ stock.stock_productname }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('stock.inventories') }}:</v-label>
                    {{ stock.stock_inventories }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('stock.productall') }}:</v-label>
                    {{ stock.stock_productall }}
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
