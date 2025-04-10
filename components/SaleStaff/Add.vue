<script setup lang="ts">
import Swal from 'sweetalert2';
import type { SaleStaff } from "@/misc/type";
const { insertSaleStaffBy } = useSaleStaff();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const salestaff = ref<SaleStaff>({
    salestaff_id: '',
    salestaff_name: '',
    salestaff_gender: '',
    salestaff_age: '',
    salestaff_phone: '',
    salestaff_fax: ''
});

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await insertSaleStaffBy(salestaff.value);
        salestaff.value = {
            salestaff_id: '',
            salestaff_name: '',
            salestaff_gender: '',
            salestaff_age: '',
            salestaff_phone: '',
            salestaff_fax: ''
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
        { key: 'salestaff_name' },
        { key: 'salestaff_gender' },
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
                    {{ $t('salestaff.gender') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-select v-model="salestaff.salestaff_gender" :error-messages="errors.salestaff_gender"
                    :items="['male', 'female']" variant="outlined" density="compact"
                    :placeholder="$t('salestaff.gender')" return-object />
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
            <v-col cols="12" md="12">
                <v-label class="mb-2">{{ $t('salestaff.fax') }}<span class="text-error ml-1">*</span></v-label>
                <v-text-field v-model="salestaff.salestaff_fax" :error-messages="errors.salestaff_fax"
                    variant="outlined" density="compact" :placeholder="$t('salestaff.fax')" />
            </v-col>
        </v-row> 
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="d-flex justify-center py-4">
        <v-btn color="success" @click="onSubmit" class="mr-2">
            <template v-if="submitting">
                <v-progress-circular class="mr-2" indeterminate color="success" :size="16"></v-progress-circular>
            </template> {{ t('button.save') }}
        </v-btn>
        <v-btn color="red" @click="() => emit('close')">{{ t('button.cancel') }}</v-btn>
    </v-card-text>
</template>