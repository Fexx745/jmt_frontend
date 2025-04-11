<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import type { Promotion } from '@/misc/type'

const { insertPromotionBy } = usePromotion()
const { t } = useI18n()
const emit = defineEmits(['done', 'close'])
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const promotion = ref<Promotion>({
    promotion_id: '',
    promotion_name: '',
    promotion_date: new Date().toISOString().slice(0, 10),
    promotion_end: (() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().slice(0, 10)
    })(),
    promotion_condition: '',
    promotion_description: ''
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
        await insertPromotionBy(promotion.value)
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
                <v-textarea v-model="promotion.promotion_description" :placeholder="t('promotion.description')" rows="3"
                    variant="outlined" dense />
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