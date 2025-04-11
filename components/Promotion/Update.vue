<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import type { Promotion } from '@/misc/type'

const { updatePromotionBy, getPromotionByID } = usePromotion()
const { t } = useI18n()
const emit = defineEmits(['done', 'close'])
const submitting = ref(false)
const pending = ref(false)
const errors = ref<Record<string, string>>({})

const props = defineProps({
    promotion_id: {
        type: String,
        required: true,
    },
}) 
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
        promotion.value = await getPromotionByID({ promotion_id: props.promotion_id });
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})

const validateForm = () => {
    errors.value = {};
    let isValid = true;
    const fields = [
        { key: 'promotion_name' },
        { key: 'promotion_condition' },
    ];
    fields.forEach(field => {
        const value = promotion.value[field.key];
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
const onSubmit = async () => {
    if (!validateForm()) return
    submitting.value = true
    try {
        await updatePromotionBy(promotion.value)
        Swal.fire({
            icon: 'success',
            title: t('title.add_success'),
            text: t('text.add_success')
        })
        emit('done')
        emit('close')
    } catch (error) {
        console.error(error)
        Swal.fire({
            icon: 'error',
            title: t('title.add_failed'),
            text: t('text.add_failed')
        })
    } finally {
        submitting.value = false
    }
}
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
                <v-col cols="12" md="6">
                    <v-label class="mb-2">
                        {{ $t('promotion.name') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="promotion.promotion_name" :error-messages="errors.promotion_name"
                        variant="outlined" density="compact" :placeholder="$t('promotion.name')" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-label class="mb-2">
                        {{ $t('promotion.condition') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="promotion.promotion_condition" :error-messages="errors.promotion_condition"
                        variant="outlined" density="compact" :placeholder="$t('promotion.condition')" />
                </v-col>
                <v-col cols="12" md="12" style="margin-top: -30px;">
                    <v-label>{{ t('promotion.description') }}</v-label>
                    <v-textarea v-model="promotion.promotion_description" :placeholder="t('promotion.description')"
                        rows="3" variant="outlined" dense />
                </v-col>
                <v-col cols="12" md="6" style="margin-top: -30px;">
                    <v-label class="mb-2">{{ $t('promotion.date') }}</v-label>
                    <Datepicker v-model="promotion.promotion_date" :format="(e: any) => formatDate(e, 'dd / MM / yyyy')"
                        :placeholder="t('promotion.date')" :enable-time-picker="false"
                        @update:modelValue="(e: any) => promotion.promotion_date = formatDate(e, 'yyyy-MM-dd')" />
                </v-col>
                <v-col cols="12" md="6" style="margin-top: -30px;">
                    <v-label class="mb-2">{{ $t('promotion.end') }}</v-label>
                    <Datepicker v-model="promotion.promotion_end" :format="(e: any) => formatDate(e, 'dd / MM / yyyy')"
                        :placeholder="t('promotion.end')" :enable-time-picker="false"
                        @update:modelValue="(e: any) => promotion.promotion_end = formatDate(e, 'yyyy-MM-dd')" />
                </v-col>
                <v-col cols="12" md="12">
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