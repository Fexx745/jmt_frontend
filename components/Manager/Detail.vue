<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Manager } from "@/misc/type";
const { getManagerByID } = useManager();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const emit = defineEmits(['close'])
const props = defineProps({
    manager_id: {
        type: String,
        required: true,
    },
})
const pending = ref(false)

const manager = ref<Manager>({
    manager_id: '',
    manager_name: ''
})

onMounted(async () => {
    pending.value = true
    try {
        const res = await getManagerByID({ manager_id: props.manager_id });
        manager.value = res;
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
                    <v-label>{{ $t('manager.id') }}:</v-label>
                    <v-chip color="primary" variant="text" label>
                        {{ manager.manager_id }}
                    </v-chip>
                </v-col>
                <v-col cols="6">
                    <v-label>{{ $t('manager.name') }}:</v-label>
                    {{ manager.manager_name }}
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
