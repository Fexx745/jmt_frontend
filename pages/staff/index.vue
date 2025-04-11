<script setup lang="ts">
import Swal from "sweetalert2";
import { decimalFix } from '@/utils/number-func'
import type { Staff } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getStaffBy, deleteStaffBy } = useStaff();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const staff = ref<Staff[]>([]);
const loading = ref(false);
const search = ref('');
const staff_id = ref('');

const headers = computed(() => [
    { title: t('staff.id'), key: 'staff_id' },
    { title: t('staff.name'), key: 'staff_name' },
    { title: t('staff.gender'), key: 'staff_gender' },
    { title: t('staff.age'), key: 'staff_age' },
    { title: t('staff.salary'), key: 'staff_salary' },
    { title: t('staff.position'), key: 'staff_position' },
    { title: t('staff.study'), key: 'staff_study' },
    { title: t('any.actions'), key: 'actions' },
]);



onMounted(async () => {
    await fetchStaff();
});

const fetchStaff = async () => {
    loading.value = true;
    try {
        staff.value = await getStaffBy();
    } catch (error) {
        console.error("Error loading staff", error);
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

const onDelete = (staff_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteStaffBy({ staff_id: staff_id })
        await fetchStaff()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    staff_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    staff_id.value = id;
    dialogDetail.value = true;
};

const searchStaff = computed(() => {
    if (!search.value) return staff.value;
    const term = search.value.toLowerCase();
    return staff.value.filter(staff =>
        staff.staff_name.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('staff.manage') }}
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
                <v-data-table :headers="headers" :items="searchStaff" :search="search" :loading="loading">
                    <template v-slot:item.staff_gender="{ item }">
                        <v-chip :color="item.staff_gender === 'Male' ? 'blue' :
                            item.staff_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                            {{ item.staff_gender === 'Male' ? 'ชาย' :
                                item.staff_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.staff_salary="{ item }">
                        <span>{{ decimalFix(item.staff_salary) }}</span>
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
                                    <v-list-item-title @click="viewDetail(item.staff_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.staff_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.staff_id)">
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
                <v-toolbar-title>{{ t('staff.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StaffAdd v-on:done="() => fetchStaff()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('staff.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StaffUpdate :staff_id="staff_id" v-on:done="() => fetchStaff()" v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('staff.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <StaffDetail v-on:close="() => closeDialog('detail')" :staff_id="staff_id" />
        </v-card>
    </v-dialog>
</template>