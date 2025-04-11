<script setup lang="ts">
import Swal from 'sweetalert2';
import type { SaleStaff } from "@/misc/type";
const { updateSaleStaffBy, getSaleStaffByID } = useSaleStaff();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    salestaff_id: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const pending = ref(false)
const errors = ref<Record<string, string>>({})

const salestaff = ref<SaleStaff>({
    salestaff_id: '',
    salestaff_name: '',
    salestaff_gender: '',
    salestaff_age: '',
    salestaff_phone: '',
    salestaff_fax: ''
});

onMounted(async () => {
    pending.value = true
    try {
        const res = await getSaleStaffByID({ salestaff_id: props.salestaff_id });
        salestaff.value = res;
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})

const onSubmit = async () => {
    if (!validateForm()) {
        return
    }
    submitting.value = true;
    try {
        await updateSaleStaffBy(salestaff.value);
        emit('close')
        emit('done')
        Swal.fire({
            icon: 'success',
            title: t('title.edit_success'),
            text: t('text.edit_success'),
        });
    } catch (error) {
        console.error("Error", error);
    } finally {
        submitting.value = false;
    }
};

const validateForm = () => {
    errors.value = {};
    let isValid = true;
    const fields = [
        { key: 'salestaff_name' },
        { key: 'salestaff_fax' },
        { key: 'salestaff_age' },
        { key: 'salestaff_phone' },
    ];
    fields.forEach(field => {
        if (!salestaff.value[field.key] || salestaff.value[field.key].trim() === '') {
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
                <v-col cols="12" md="3">
                    <v-label class="mb-2">
                        {{ $t('salestaff.name') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="salestaff.salestaff_name" :error-messages="errors.salestaff_name"
                        variant="outlined" density="compact" :placeholder="$t('salestaff.name')" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-label class="mb-2">
                        {{ $t('salestaff.gender') }}
                    </v-label>
                    <v-select v-model="salestaff.salestaff_gender" :items="[
                        { label: 'ชาย', value: 'Male' },
                        { label: 'หญิง', value: 'Female' }
                    ]" item-title="label" item-value="value" variant="outlined" density="compact"
                        :placeholder="$t('salestaff.gender')" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-label class="mb-2">
                        {{ $t('salestaff.age') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="salestaff.salestaff_age" :error-messages="errors.salestaff_age"
                        variant="outlined" density="compact" :placeholder="$t('salestaff.age')" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-label class="mb-2">{{ $t('salestaff.phone') }}<span class="text-error ml-1">*</span></v-label>
                    <v-text-field v-model="salestaff.salestaff_phone" :error-messages="errors.salestaff_phone"
                        variant="outlined" density="compact" :placeholder="$t('salestaff.phone')" />
                </v-col>
                <v-col cols="12" md="12" style="margin-top: -30px;">
                    <v-label class="mb-2">{{ $t('salestaff.fax') }}<span class="text-error ml-1">*</span></v-label>
                    <v-text-field v-model="salestaff.salestaff_fax" :error-messages="errors.salestaff_fax"
                        variant="outlined" density="compact" :placeholder="$t('salestaff.fax')" />
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-card-text class="d-flex justify-center py-4">
                    <v-btn color="success" size="small" @click="onSubmit" class="mr-2">
                        <template v-if="submitting">
                            <v-progress-circular class="mr-2" indeterminate color="success"
                                :size="16"></v-progress-circular>
                        </template> {{ t('button.save') }}
                    </v-btn>
                    <v-btn color="red" size="small" @click="() => emit('close')">{{ t('button.cancel') }}</v-btn>
                </v-card-text>
            </v-row>
        </v-card-text>
    </template>
</template>