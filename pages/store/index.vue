<script setup lang="ts">
import Swal from "sweetalert2";
import { decimalFix } from "@/utils/number-func"
import { formatDate } from "@/utils/date-func"
import type { Store } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getStoreBy, deleteStoreBy } = useStore();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const store = ref<Store[]>([]);
const loading = ref(false);
const search = ref('');
const store_id = ref('');

const headers = computed(() => [
    { title: t('store.id'), key: 'store_id' },
    { title: t('store.name'), key: 'store_name' },
    { title: t('store.detail'), key: 'store_detail' },
    { title: t('store.no'), key: 'store_no' },
    { title: t('store.tambon'), key: 'store_tambon' },
    { title: t('store.aumper'), key: 'store_aumper' },
    { title: t('store.province'), key: 'store_province' },
    { title: t('store.code'), key: 'store_code' },
    { title: t('store.tel'), key: 'store_tel' },
    { title: t('any.actions'), key: 'actions' },
]);

onMounted(async () => {
    await fetchStore();
});

const fetchStore = async () => {
    loading.value = true;
    try {
        store.value = await getStoreBy();
    } catch (error) {
        console.error("Error loading store", error);
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

const onDelete = (store_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteStoreBy({ store_id: store_id })
        await fetchStore()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    store_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    store_id.value = id;
    dialogDetail.value = true;
};

const searchStore = computed(() => {
    if (!search.value) return store.value;
    const term = search.value.toLowerCase();
    return store.value.filter(store =>
        store.store_name.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('store.manage') }}
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
                <v-data-table :headers="headers" :items="searchStore" :search="search" :loading="loading">
                    <template v-slot:item.actions="{ item }">
                        <v-menu offset-y>
                            <template v-slot:activator="{ props }">
                                <v-label class="cursor-pointer" icon v-bind="props">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-label>
                            </template>
                            <v-list>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="viewDetail(item.store_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.store_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.store_id)">
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
                <v-toolbar-title>{{ t('store.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StoreAdd v-on:done="() => fetchStore()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('store.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StoreUpdate :store_id="store_id" v-on:done="() => fetchStore()" v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('store.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StoreDetail v-on:close="() => closeDialog('detail')" :store_id="store_id" />
        </v-card>
    </v-dialog>
</template>