<script setup lang="ts">
import Swal from "sweetalert2";
import type { SaleStaff } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getSaleStaffBy, deleteSaleStaffBy } = useSaleStaff();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const salestaffs = ref<SaleStaff[]>([]);
const loading = ref(false);
const searchTerm = ref('');
const salestaff_id = ref('');

const headers = computed(() => [
    { title: t('salestaff.id'), key: 'salestaff_id' },
    { title: t('salestaff.name'), key: 'salestaff_name' },
    { title: t('salestaff.gender'), key: 'salestaff_gender' },
    { title: t('salestaff.age'), key: 'salestaff_age' },
    { title: t('salestaff.phone'), key: 'salestaff_phone' },
    { title: t('salestaff.fax'), key: 'salestaff_fax' },
    { title: t('any.actions'), key: 'actions' },
]);


onMounted(async () => {
    await fetchSaleStaffs();
});

const fetchSaleStaffs = async () => {
    loading.value = true;
    try {
        salestaffs.value = await getSaleStaffBy();
    } catch (error) {
        console.error("Error loading salestaffs", error);
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

const onDelete = (salestaff_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteSaleStaffBy({ salestaff_id: salestaff_id })
        await fetchSaleStaffs()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    salestaff_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    salestaff_id.value = id;
    dialogDetail.value = true;
};

const searchSaleStaff = computed(() => {
    if (!searchTerm.value) return salestaffs.value;
    const term = searchTerm.value.toLowerCase();

    return salestaffs.value.filter(salestaff =>
        salestaff.salestaff_name.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('salestaff.manage') }}
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-row class="mb-4 mt-2">
                    <v-col class="d-flex flex-wrap gap-2 align-center  py-2" cols="12" md="3">
                        <v-text-field v-model="searchTerm" :label="t('any.search')" append-inner-icon="mdi-magnify"
                            density="compact" variant="outlined" hide-details style="width: 500px"></v-text-field>
                    </v-col>
                    <v-col class="d-flex flex-wrap gap-2 align-center justify-md-end py-2" cols="12" md="9">
                        <v-btn elevation="3" prepend-icon="mdi-plus" color="success" @click="openAddDialog">{{
                            t('button.add') }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table :headers="headers" :items="searchSaleStaff" :search="searchTerm" :loading="loading">
                    <template v-slot:item.salestaff_gender="{ item }">
                        <v-chip :color="item.salestaff_gender === 'male' ? 'blue' :
                            item.salestaff_gender === 'female' ? 'pink' : 'purple'" text-color="white" size="small">
                            {{ item.salestaff_gender === 'male' ? 'ชาย' :
                                item.salestaff_gender === 'female' ? 'หญิง' : 'ไม่ระบุ' }}
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
                                    <v-list-item-title @click="viewDetail(item.salestaff_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.salestaff_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact"
                                    @click="onDelete(item.salestaff_id)">
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
                <v-toolbar-title>{{ t('salestaff.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <SaleStaffAdd v-on:done="() => fetchSaleStaffs()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('salestaff.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <SaleStaffUpdate :salestaff_id="salestaff_id" v-on:done="() => fetchSaleStaffs()"
                v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('salestaff.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <SaleStaffDetail v-on:close="() => closeDialog('detail')" :salestaff_id="salestaff_id" />
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-container {
    padding: 16px;
}

.v-btn {
    margin-right: 8px;
}
</style>