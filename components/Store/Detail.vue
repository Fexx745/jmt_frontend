<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from "@/utils/date-func"
import { decimalFix } from '@/utils/number-func';
import type { Store } from "@/misc/type";
const { getStoreByID } = useStore();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    store_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const store = ref<Store>({
    store_id: '',
    store_name: '',
    store_detail: '',
    store_no: '',
    store_tambon: '',
    store_aumper: '',
    store_province: '',
    store_code: '',
    store_tel: ''
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getStoreByID({ store_id: props.store_id });
        store.value = res;
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
                    <v-label>{{ $t('store.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ store.store_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('store.name') }}:</v-label>
                    {{ store.store_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.no') }}:</v-label>
                    {{ store.store_no }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.tel') }}:</v-label>
                    {{ store.store_tel }}
                </v-col>
                <v-col cols="12" style="margin-top: -10px;">
                    <v-label>{{ $t('store.detail') }}:</v-label>
                    <v-textarea v-model="store.store_detail" outlined dense readonly auto-grow rows="2"></v-textarea>
                </v-col>

                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.tambon') }}:</v-label>
                    {{ store.store_tambon }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.aumper') }}:</v-label>
                    {{ store.store_aumper }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.province') }}:</v-label>
                    {{ store.store_province }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('store.code') }}:</v-label>
                    {{ store.store_code }}
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
