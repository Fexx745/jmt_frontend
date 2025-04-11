<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Manager } from "@/misc/type";
const { insertManagerBy } = useManager();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const manager = ref<Manager>({
    manager_id: '',
    manager_name: ''
});

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await insertManagerBy(manager.value);
        manager.value = {
            manager_id: '',
            manager_name: ''
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
        { key: 'manager_name' },
    ];
    fields.forEach(field => {
        if (!manager.value[field.key] || manager.value[field.key].trim() === '') {
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
            <v-col cols="12" md="12">
                <v-label class="mb-2">
                    {{ $t('manager.name') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="manager.manager_name" :error-messages="errors.manager_name" variant="outlined"
                    density="compact" :placeholder="$t('manager.name')" />
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
