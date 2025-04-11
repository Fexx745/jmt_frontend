<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Store } from "@/misc/type";
const { updateStoreBy, getStoreByID } = useStore();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    store_id: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const pending = ref(false)
const errors = ref<Record<string, string>>({})

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
});

onMounted(async () => {
    pending.value = true
    try {
        store.value = await getStoreByID({ store_id: props.store_id });
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})


const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await updateStoreBy(store.value);
        store.value = {
            store_id: '',
            store_name: '',
            store_detail: '',
            store_no: '',
            store_tambon: '',
            store_aumper: '',
            store_province: '',
            store_code: '',
            store_tel: ''
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
        { key: 'store_name' },
        { key: 'store_no' },
        { key: 'store_tel' },
    ];
    fields.forEach(field => {
        const value = store.value[field.key];
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
                        {{ $t('store.name') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="store.store_name" :error-messages="errors.store_name" variant="outlined"
                        density="compact" :placeholder="$t('store.name')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label class="mb-2">
                        {{ $t('store.no') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="store.store_no" type="number" :error-messages="errors.store_no"
                        variant="outlined" density="compact" :placeholder="$t('store.no')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label class="mb-2">
                        {{ $t('store.tel') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="store.store_tel" type="number" :error-messages="errors.store_tel"
                        variant="outlined" density="compact" :placeholder="$t('store.tel')" />
                </v-col>
                <v-col cols="12" md="12" style="margin-top: -30px;">
                    <v-label class="mb-2">
                        {{ $t('store.detail') }}
                    </v-label>
                    <v-textarea v-model="store.store_detail" variant="outlined" density="compact"
                        :placeholder="$t('store.detail')" />
                </v-col>
                <v-col cols="12" md="3" style="margin-top: -30px;">
                    <v-label class="mb-2">
                        {{ $t('store.tambon') }}
                    </v-label>
                    <v-text-field v-model="store.store_tambon" variant="outlined" density="compact"
                        :placeholder="$t('store.tambon')" />
                </v-col>
                <v-col cols="12" md="3" style="margin-top: -30px;">
                    <v-label class="mb-2">
                        {{ $t('store.aumper') }}
                    </v-label>
                    <v-text-field v-model="store.store_aumper" variant="outlined" density="compact"
                        :placeholder="$t('store.aumper')" />
                </v-col>
                <v-col cols="12" md="3" style="margin-top: -30px;">
                    <v-label class="mb-2">
                        {{ $t('store.province') }}
                    </v-label>
                    <v-text-field v-model="store.store_province" variant="outlined" density="compact"
                        :placeholder="$t('store.province')" />
                </v-col>
                <v-col cols="12" md="3" style="margin-top: -30px;">
                    <v-label class="mb-2">
                        {{ $t('store.code') }}
                    </v-label>
                    <v-text-field v-model="store.store_code" type="number" variant="outlined" density="compact"
                        :placeholder="$t('store.code')" />
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