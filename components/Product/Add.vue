<script setup lang="ts">
import Swal from 'sweetalert2';
import type { Product } from "@/misc/type";
import { formatDate } from "@/utils/date-func"
const { insertProductBy } = useProduct();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits(['done', 'close']);
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const product = ref<Product>({
    product_id: '',
    product_name: '',
    product_moo: '',
    product_type: '',
    product_mxp: new Date(),
    product_exp: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow
    })(),
    product_price: 0
});

const onSubmit = async () => {
    if (!validateForm()) { return }
    try {
        await insertProductBy(product.value);
        product.value = {
            product_id: '',
            product_name: '',
            product_moo: '',
            product_type: '',
            product_mxp: '',
            product_exp: '',
            product_price: 0
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
        { key: 'product_name' },
        { key: 'product_mxp' },
        { key: 'product_exp' },
        { key: 'product_price' }
    ];
    fields.forEach(field => {
        const value = product.value[field.key];
        if (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        ) {
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
            <v-col cols="12" md="3">
                <v-label class="mb-2">
                    {{ $t('product.name') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="product.product_name" :error-messages="errors.product_name" variant="outlined"
                    density="compact" :placeholder="$t('product.name')" />
            </v-col>
            <v-col cols="12" md="3">
                <v-label class="mb-2">{{ $t('product.moo') }}<span class="text-error ml-1">*</span></v-label>
                <v-select v-model="product.product_moo" :items="[
                    { value: 'อาหาร' },
                    { value: 'เครื่องดื่ม' },
                    { value: 'เครื่องใช้ไฟฟ้า' },
                    { value: 'เสื้อผ้า' },
                    { value: 'เครื่องสำอาง' },
                    { value: 'อุปกรณ์กีฬา' },
                    { value: 'หนังสือ' },
                    { value: 'ของใช้ในบ้าน' }
                ]" variant="outlined" item-value="value" item-title="value" density="compact"
                    :error-messages="errors.product_moo" :placeholder="$t('product.moo')" />
            </v-col>
            <v-col cols="12" md="3">
                <v-label class="mb-2">{{ $t('product.type') }}<span class="text-error ml-1">*</span></v-label>
                <v-select v-model="product.product_type" :items="[
                    { value: 'ขนมขบเคี้ยว' },
                    { value: 'อาหารแช่แข็ง' },
                    { value: 'น้ำผลไม้' },
                    { value: 'น้ำอัดลม' },
                    { value: 'โทรทัศน์' },
                    { value: 'เครื่องซักผ้า' },
                    { value: 'เสื้อยืด' },
                    { value: 'กางเกงยีนส์' },
                    { value: 'ครีมบำรุงผิว' },
                    { value: 'ลิปสติก' },
                    { value: 'รองเท้ากีฬา' },
                    { value: 'ไม้แบดมินตัน' },
                    { value: 'นวนิยาย' },
                    { value: 'ตำราเรียน' },
                    { value: 'เครื่องครัว' },
                    { value: 'ของตกแต่งบ้าน' }
                ]" variant="outlined" item-value="value" item-title="value" density="compact"
                    :error-messages="errors.product_type" :placeholder="$t('product.type')" />
            </v-col>
            <v-col cols="12" md="3">
                <v-label class="mb-2">
                    {{ $t('product.price') }}<span class="text-error ml-1">*</span>
                </v-label>
                <v-text-field v-model="product.product_price" :error-messages="errors.product_price" variant="outlined"
                    density="compact" :placeholder="$t('product.price')" />
            </v-col>
            <v-col cols="12" md="6" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('product.mxp') }}</v-label>
                <Datepicker v-model="product.product_mxp" :format="(e: any) => formatDate(e, 'dd / MM / yyyy')"
                    :placeholder="t('product.mxp')" :enable-time-picker="false"
                    @update:modelValue="(e: any) => product.product_mxp = formatDate(e, 'yyyy-MM-dd')" />
            </v-col>
            <v-col cols="12" md="6" style="margin-top: -30px;">
                <v-label class="mb-2">{{ $t('product.exp') }}</v-label>
                <Datepicker v-model="product.product_exp" :format="(e: any) => formatDate(e, 'dd / MM / yyyy')"
                    :placeholder="t('product.exp')" :enable-time-picker="false"
                    @update:modelValue="(e: any) => product.product_exp = formatDate(e, 'yyyy-MM-dd')" />
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
            <v-card-text class="d-flex justify-center py-4">
                <v-btn color="success" size="small" @click="onSubmit" class="mr-2">
                    <template v-if="submitting">
                        <v-progress-circular class="mr-2" indeterminate color="success"
                            :size="16"></v-progress-circular>
                    </template>
                    {{ t('button.save') }}
                </v-btn>
                <v-btn color="red" size="small" @click="() => emit('close')">{{ t('button.cancel') }}</v-btn>
            </v-card-text>
        </v-row>
    </v-card-text>
</template>