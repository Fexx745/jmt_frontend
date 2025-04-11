<script setup lang="ts">
import Swal from "sweetalert2";
import type { Manager } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getManagerBy, deleteManagerBy } = useManager();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const manager = ref<Manager[]>([]);
const loading = ref(false);
const search = ref('');
const manager_id = ref('');

const headers = computed(() => [
    { title: t('manager.id'), key: 'manager_id' },
    { title: t('manager.name'), key: 'manager_name' },
    { title: t('any.actions'), key: 'actions' },
]);



onMounted(async () => {
    await fetchManager();
});

const fetchManager = async () => {
    loading.value = true;
    try {
        manager.value = await getManagerBy();
    } catch (error) {
        console.error("Error loading manager", error);
    } finally {
        loading.value = false;
    }
};

const openAddDialog = () => {
    dialogAdd.value = true;
};

const closeDialog = (type: string) => {
    if (type === 'update') {
        dialogUpdate.value = false;
    } else if (type === 'detail') {
        dialogDetail.value = false;
    } else if (type === 'add') {
        dialogAdd.value = false;
    }
};

const onDelete = (manager_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteManagerBy({ manager_id: manager_id })
        await fetchManager()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    manager_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    manager_id.value = id;
    dialogDetail.value = true;
};

const searchManager = computed(() => {
    if (!search.value) return manager.value;
    const term = search.value.toLowerCase();
    return manager.value.filter(manager =>
        manager.manager_name.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('manager.manage') }}
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-row class="mb-4 mt-2">
                    <v-col class="d-flex flex-wrap gap-2 align-center  py-2" cols="12" md="3">
                        <v-text-field v-model="search" :label="t('any.search')" append-inner-icon="mdi-magnify"
                            density="compact" variant="outlined" hide-details style="width: 500px"></v-text-field>
                    </v-col>
                    <v-col class="d-flex flex-wrap gap-2 align-center justify-md-end py-2" cols="12" md="9">
                        <v-btn elevation="3" prepend-icon="mdi-plus" color="success" @click="openAddDialog">{{
                            t('button.add') }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table :headers="headers" :items="searchManager" :search="search" :loading="loading">
                    <template v-slot:item.manager_gender="{ item }">
                        <v-chip :color="item.manager_gender === 'Male' ? 'blue' :
                            item.manager_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                            {{ item.manager_gender === 'Male' ? 'ชาย' :
                                item.manager_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ props }">
                                <v-label class="cursor-pointer" icon v-bind="props">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-label>
                            </template>
                            <v-list>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="viewDetail(item.manager_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.manager_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact"
                                    @click="onDelete(item.manager_id)">
                                    <v-list-item-title>
                                        <v-icon>mdi-trash-can-outline</v-icon> {{ $t('button.delete') }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>

    <v-dialog v-model="dialogAdd" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('manager.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ManagerAdd v-on:done="() => fetchManager()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('manager.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ManagerUpdate :manager_id="manager_id" v-on:done="() => fetchManager()"
                v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('manager.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ManagerDetail v-on:close="() => closeDialog('detail')" :manager_id="manager_id" />
        </v-card>
    </v-dialog>
</template>