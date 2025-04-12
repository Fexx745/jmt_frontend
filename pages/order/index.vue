<script setup lang="ts">
import Swal from "sweetalert2";
import { decimalFix } from "@/utils/number-func"
import { formatDate } from "@/utils/date-func"
import type { Order } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getOrderBy, deleteOrderBy } = useOrder();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const order = ref<Order[]>([]);
const loading = ref(false);
const search = ref('');
const order_id = ref('');

const headers = computed(() => [
    { title: t('order.id'), key: 'order_id' },
    { title: t('order.name'), key: 'order_name' },
    { title: t('order.price'), key: 'order_price' },
    { title: t('order.amount'), key: 'order_amount' },
    { title: t('order.detail'), key: 'order_detail' },
    { title: t('order.date'), key: 'order_date' },
    { title: t('any.actions'), key: 'actions' },
]);

onMounted(async () => {
    await fetchOrder();
});

const fetchOrder = async () => {
    loading.value = true;
    try {
        order.value = await getOrderBy();
    } catch (error) {
        console.error("Error loading order", error);
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

const onDelete = (order_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteOrderBy({ order_id: order_id })
        await fetchOrder()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    order_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    order_id.value = id;
    dialogDetail.value = true;
};

</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('order.manage') }}
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
                <v-data-table :headers="headers" :items="order" :search="search" :loading="loading">
                    <template v-slot:item.order_date="{ item }">
                        <span>{{ formatDate(item.order_date, "dd/MM/yyyy") }}</span>
                    </template>
                    <template v-slot:item.order_price="{ item }">
                        <span>{{ decimalFix(item.order_price) }} ฿</span>
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
                                    <v-list-item-title @click="viewDetail(item.order_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.order_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact" @click="onDelete(item.order_id)">
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
                <v-toolbar-title>{{ t('order.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <OrderAdd v-on:done="() => fetchOrder()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('order.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <OrderUpdate :order_id="order_id" v-on:done="() => fetchOrder()" v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('order.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <OrderDetail v-on:close="() => closeDialog('detail')" :order_id="order_id" />
        </v-card>
    </v-dialog>
</template>