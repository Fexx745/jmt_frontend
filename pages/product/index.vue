<script setup lang="ts">
import Swal from "sweetalert2";
import { decimalFix } from "@/utils/number-func"
import { formatDate } from "@/utils/date-func"
import type { Product } from "@/misc/type";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getProductBy, deleteProductBy } = useProduct();

const dialogAdd = ref(false);
const dialogUpdate = ref(false);
const dialogDetail = ref(false);
const product = ref<Product[]>([]);
const loading = ref(false);
const search = ref('');
const product_id = ref('');

const headers = computed(() => [
    { title: t('product.id'), key: 'product_id' },
    { title: t('product.name'), key: 'product_name' },
    { title: t('product.moo'), key: 'product_moo' },
    { title: t('product.type'), key: 'product_type' },
    { title: t('product.mxp'), key: 'product_mxp' },
    { title: t('product.exp'), key: 'product_exp' },
    { title: t('product.price'), key: 'product_price' },
    { title: t('any.actions'), key: 'actions' },
]);

onMounted(async () => {
    await fetchProduct();
});

const fetchProduct = async () => {
    loading.value = true;
    try {
        product.value = await getProductBy();
    } catch (error) {
        console.error("Error loading product", error);
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

const onDelete = (product_id: string) => Swal.fire({
    title: t('title.del_confirm'),
    text: t('text.del_confirm'),
    icon: "warning",
    showCancelButton: true,
}).then(async ({ value }) => {
    try {
        if (!value) return
        await deleteProductBy({ product_id: product_id })
        await fetchProduct()
        Swal.fire({ title: t('title.del_success'), text: t('text.del_success'), icon: "success" })
    } catch (e) {
        console.error(e)
    }
})

const onUpdate = (id: string) => {
    product_id.value = id;
    dialogUpdate.value = true;
};

const viewDetail = (id: string) => {
    product_id.value = id;
    dialogDetail.value = true;
};

const searchProduct = computed(() => {
    if (!search.value) return product.value;
    const term = search.value.toLowerCase();
    return product.value.filter(product =>
        product.product_name.toLowerCase().includes(term)
    );
});
</script>

<template>
    <v-container>
        <v-card elevation="5" class="pa-2 withbg">
            <v-card-title>
                {{ $t('product.manage') }}
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
                <v-data-table :headers="headers" :items="searchProduct" :search="search" :loading="loading">
                    <template v-slot:item.product_gender="{ item }">
                        <v-chip :color="item.product_gender === 'Male' ? 'blue' :
                            item.product_gender === 'Female' ? 'pink' : 'purple'" text-color="white" size="small">
                            {{ item.product_gender === 'Male' ? 'ชาย' :
                                item.product_gender === 'Female' ? 'หญิง' : 'ไม่ระบุ' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.product_mxp="{ item }">
                        <span>{{ formatDate(item.product_mxp, "dd/MM/yyyy") }}</span>
                    </template>
                    <template v-slot:item.product_exp="{ item }">
                        <span>{{ formatDate(item.product_exp, "dd/MM/yyyy") }}</span>
                    </template>
                    <template v-slot:item.product_price="{ item }">
                        <span>{{ decimalFix(item.product_price) }} ฿</span>
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
                                    <v-list-item-title @click="viewDetail(item.product_id)">
                                        <v-icon>mdi-chat-processing-outline</v-icon> {{ $t('button.detail')
                                        }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact">
                                    <v-list-item-title @click="onUpdate(item.product_id)">
                                        <v-icon>mdi-square-edit-outline</v-icon> {{ $t('button.edit') }}
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item class="cursor-pointer" density="compact"
                                    @click="onDelete(item.product_id)">
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
                <v-toolbar-title>{{ t('product.title_add') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('add')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ProductAdd v-on:done="() => fetchProduct()" v-on:close="() => closeDialog('add')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="1200px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('product.title_update') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('update')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ProductUpdate :product_id="product_id" v-on:done="() => fetchProduct()"
                v-on:close="() => closeDialog('update')" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDetail" max-width="600px">
        <v-card>
            <v-toolbar color="muted">
                <v-toolbar-title>{{ t('product.title_detail') }}</v-toolbar-title>
                <v-btn icon dark @click="closeDialog('detail')">
                    <v-icon size="tiny">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <ProductDetail v-on:close="() => closeDialog('detail')" :product_id="product_id" />
        </v-card>
    </v-dialog>
</template>