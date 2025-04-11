<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Staff } from "@/misc/type";
const { getStaffByID } = useStaff();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    staff_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const staff = ref<Staff>({
    staff_id: '',
    staff_name: '',
    staff_gender: '',
    staff_age: '',
    staff_salary: '',
    staff_position: '',
    staff_study: ''
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getStaffByID({ staff_id: props.staff_id });
        staff.value = res;
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
                    <v-label>{{ $t('staff.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ staff.staff_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('staff.name') }}:</v-label>
                    {{ staff.staff_name }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label class="mr-2">{{ $t('staff.gender') }}:</v-label>
                    <v-chip :color="staff.staff_gender === 'Male' ? 'blue' :
                        staff.staff_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                        {{ staff.staff_gender === 'Male' ? 'ชาย' :
                            staff.staff_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                    </v-chip>
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('staff.age') }}:</v-label>
                    {{ staff.staff_age }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('staff.salary') }}:</v-label>
                    {{ staff.staff_salary }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('staff.position') }}:</v-label>
                    {{ staff.staff_position }}
                </v-col>
                <v-col cols="6" style="margin-top: -20px;">
                    <v-label>{{ $t('staff.study') }}:</v-label>
                    {{ staff.staff_study }}
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
