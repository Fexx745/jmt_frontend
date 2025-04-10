<script setup lang="ts">
import Swal from "sweetalert2";
import type { Customer } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getCustomerBy, deleteCustomerBy } = useCustomer();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const customers = ref<Customer[]>([]);
const loading = ref(false);
const searchTerm = ref('');
const customer_id = ref('');

const headers = computed(() => [
    { title: t('customer.id'), key: 'customer_id' },
    { title: t('customer.name'), key: 'customer_name' },
    { title: t('customer.gender'), key: 'customer_gender' },
    { title: t('customer.tel'), key: 'customer_tel' },
    { title: t('customer.tax'), key: 'customer_tax' },
    { title: t('customer.tambon'), key: 'customer_tambon' },
    { title: t('customer.aumper'), key: 'customer_aumper' },
    { title: t('customer.province'), key: 'customer_province' },
    { title: t('customer.code'), key: 'customer_code' },
    { title: t('customer.action'), key: 'actions' },
]);


onMounted(async () => {
    await fetchCustomers();
});

const fetchCustomers = async () => {
    loading.value = true;
    try {
        customers.value = await getCustomerBy();
    } catch (error) {
        console.error("Error loading customers", error);
    } finally {
        loading.value = false;
    }
};

const openAddDialog = () => {
    dialogAdd.value = true;
};

const closeDialog = () => {
    dialogAdd.value = false;
};

const onDelete = (customer_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteCustomerBy({ customer_id: customer_id })
        await fetchCustomers()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    customer_id.value = id;
    dialogUpdate.value = true;
};

const filteredCustomers = computed(() => {
    if (!searchTerm.value) return customers.value;
    const term = searchTerm.value.toLowerCase();
    return customers.value.filter(customer =>
        customer.customer_name.toLowerCase().includes(term) ||
        customer.customer_tel.toLowerCase().includes(term) ||
        customer.customer_province.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title>
                จัดการข้อมูลลูกค้า
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-row class="mb-2">
                    <v-col class="d-flex flex-wrap gap-2 align-center  py-2" cols="12" md="8">
                        <v-text-field v-model="searchTerm" label="ค้นหาชื่อลูกค้า" append-inner-icon="mdi-magnify"
                            density="compact" variant="outlined" hide-details style="width: 500px"></v-text-field>
                    </v-col>
                    <v-col class="d-flex flex-wrap gap-2 align-center justify-md-end py-2" cols="12" md="4">
                        <v-btn elevation="3" prepend-icon="mdi-plus" color="success" @click="openAddDialog">เพิ่มลูกค้า
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table :headers="headers" :items="filteredCustomers" :search="searchTerm" :loading="loading"
                    loading-text="Loading customers..." class="elevation-1">
                    <template v-slot:item.customer_gender="{ item }">
                        <v-chip :color="item.customer_gender === 'male' ? 'blue' :
                            item.customer_gender === 'female' ? 'pink' : 'purple'" text-color="white" size="small">
                            {{ item.customer_gender }}
                        </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" color="blue" :onClick="() => onUpdate(item.customer_id)">
                            mdi-pencil
                        </v-icon>
                        <v-icon small color="red" :onClick="() => onDelete(item.customer_id)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogAdd" max-width="1200px">
            <v-card>
                <v-toolbar color="muted">
                    <v-toolbar-title>{{ t('customer.title_add') }}</v-toolbar-title>
                    <v-btn icon dark @click="closeDialog">
                        <v-icon size="tiny">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <CustomerAdd v-on:done="() => fetchCustomers()" v-on:close="() => closeDialog()" />
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogUpdate" max-width="1200px">
            <v-card>
                <v-toolbar color="muted">
                    <v-toolbar-title>{{ t('customer.title_update') }}</v-toolbar-title>
                    <v-btn icon dark @click="closeDialog">
                        <v-icon size="tiny">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <CustomerUpdate :customer_id="customer_id" v-on:done="() => fetchCustomers()"
                    v-on:close="() => closeDialog()" />
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
.v-container {
    padding: 16px;
}

.v-btn {
    margin-right: 8px;
}
</style>