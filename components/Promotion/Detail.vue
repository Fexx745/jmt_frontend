<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from "@/utils/date-func"
import type { Promotion } from "@/misc/type";
const { getPromotionByID } = usePromotion();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    promotion_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const promotion = ref<Promotion>({
    promotion_id: '',
    promotion_name: '',
    promotion_date: '',
    promotion_end: '',
    promotion_condition: '',
    promotion_description: ''
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getPromotionByID({ promotion_id: props.promotion_id });
        promotion.value = res;
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
                    <v-label>{{ $t('promotion.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ promotion.promotion_id }}
                    </v-chip>
                </v-col>
                <v-col cols="12" style="margin-top: -20px;">
                    <v-label>{{ $t('promotion.name') }}:</v-label>
                    {{ promotion.promotion_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('promotion.date') }}:</v-label>
                    {{ formatDate(promotion.promotion_date, 'dd/MM/yyyy') }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('promotion.end') }}:</v-label>
                    {{ formatDate(promotion.promotion_end, 'dd/MM/yyyy') }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('promotion.condition') }}:</v-label>
                    {{ promotion.promotion_condition }}
                </v-col>
                <v-col cols="12" style="margin-top: -10px;">
                    <v-label>{{ $t('promotion.description') }}:</v-label>
                    <v-textarea v-model="promotion.promotion_description" outlined dense readonly auto-grow
                        rows="2"></v-textarea>
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-card-text class="d-flex justify-center">
                    <v-btn color="primary" size="small" @click="() => emit('close')">{{ t('button.close') }}</v-btn>
                </v-card-text>
            </v-row>
        </v-card-text>
    </template>
</template>
