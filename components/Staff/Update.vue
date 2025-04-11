<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Staff } from "@/misc/type";
const { updateStaffBy, getStaffByID } = useStaff();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const props = defineProps({
    staff_id: {
        type: String,
        required: true,
    },
})
const submitting = ref(false)
const pending = ref(false)
const errors = ref<Record<string, string>>({})
const staff = ref<Staff>({
    staff_id: '',
    staff_name: '',
    staff_gender: '',
    staff_age: '',
    staff_salary: '',
    staff_position: '',
    staff_study: ''
});

onMounted(async () => {
    pending.value = true
    try {
        staff.value = await getStaffByID({ staff_id: props.staff_id });
    } catch (error) {
        console.error("Error", error);
    } finally {
        pending.value = false
    }
})

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await updateStaffBy(staff.value);
        staff.value = {
            staff_id: '',
            staff_name: '',
            staff_gender: '',
            staff_age: '',
            staff_salary: '',
            staff_position: '',
            staff_study: ''
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
        { key: 'staff_name' },
        { key: 'staff_gender' },
        { key: 'staff_age' },
        { key: 'staff_salary' },
    ];
    fields.forEach(field => {
        if (!staff.value[field.key] || staff.value[field.key].trim() === '') {
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
                    <v-label>
                        {{ $t('staff.name') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="staff.staff_name" :error-messages="errors.staff_name" variant="outlined"
                        density="compact" :placeholder="$t('staff.name')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label>
                        {{ $t('staff.gender') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-select v-model="staff.staff_gender" :items="[
                        { label: 'ชาย', value: 'Male' },
                        { label: 'หญิง', value: 'Female' }
                    ]" item-title="label" item-value="value" variant="outlined" density="compact"
                        :placeholder="$t('staff.gender')" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-label>
                        {{ $t('staff.age') }}<span class="text-error ml-1">*</span>
                    </v-label>
                    <v-text-field v-model="staff.staff_age" :error-messages="errors.staff_age" variant="outlined"
                        density="compact" :placeholder="$t('staff.age')" />
                </v-col>
                <v-col cols="12" md="4" style="margin-top: -30px;">
                    <v-label>{{ $t('staff.salary') }}<span class="text-error ml-1">*</span></v-label>
                    <v-text-field v-model="staff.staff_salary" :error-messages="errors.staff_salary" variant="outlined"
                        density="compact" :placeholder="$t('staff.salary')" />
                </v-col>
                <v-col cols="12" md="4" style="margin-top: -30px;">
                    <v-label>{{ $t('staff.position') }}</v-label>
                    <v-select v-model="staff.staff_position" :items="[
                        { value: 'Manager' },
                        { value: 'Accountant' },
                        { value: 'Engineer' },
                        { value: 'Sales' },
                        { value: 'Technician' }
                    ]" item-title="value" item-value="value" variant="outlined" density="compact"
                        :placeholder="$t('staff.position')" />
                </v-col>
                <v-col cols="12" md="4" style="margin-top: -30px;">
                    <v-label>{{ $t('staff.study') }}</v-label>
                    <v-select v-model="staff.staff_study" :items="[
                        { label: 'มัธยมศึกษาตอนต้น', value: 'ม.ต้น' },
                        { label: 'มัธยมศึกษาตอนปลาย', value: 'ม.ปลาย' },
                        { label: 'ปวช.', value: 'ปวช.' },
                        { label: 'ปวส.', value: 'ปวส.' },
                        { label: 'ปริญญาตรี', value: 'ป.ตรี' }
                    ]" item-title="label" item-value="value" variant="outlined" density="compact"
                        :placeholder="$t('staff.study')" />
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
